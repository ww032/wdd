package com.tangcheng.face_warehouse.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.tangcheng.face_warehouse.feign.faceFeignService;
import com.tangcheng.face_warehouse.model.Config;
import com.tangcheng.face_warehouse.model.UserInfo;
import com.tangcheng.face_warehouse.model.adminEneity;
import com.tangcheng.face_warehouse.model.vo.faceObj;
import com.tangcheng.face_warehouse.model.vo.login;
import com.tangcheng.face_warehouse.model.vo.ossset;
import com.tangcheng.face_warehouse.service.adminService;
import com.tangcheng.face_warehouse.service.fileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import result.Result;
import result.ResultCodeEnum;
import utils.Base64Util;
import utils.LocalFileUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Api("管理员相关操作")
@RestController
@RequestMapping("/admin")
@CrossOrigin
public class userController {
    @Autowired
    adminService adminService;
    @Autowired
    fileService fileService;
    @Autowired
    faceFeignService faceFeignService;

    @ApiOperation("查询所有管理员")
    @GetMapping("/findAll/{token}")
    public Result findAllAdmin() {
        List<adminEneity> adminEneities = adminService.finAlladmin();
        return Result.ok(ResultCodeEnum.SUCCESS).data("userList", adminEneities);
    }

    @ApiOperation("登录")
    @PostMapping("/login")
    public Result login(@RequestBody login login) {
        System.out.println(login.toString());
        adminEneity userInfo = adminService.login(login.getUsername(), login.getPassword());
        if (userInfo == null) {
            return Result.error(ResultCodeEnum.ERROR_PASSWORD);
        } else {
            return Result.ok(ResultCodeEnum.SUCCESS).data("token", "admin_token");
        }
    }

    @ApiOperation("获取登录用户信息")
    @GetMapping("/info/{token}")
    public Result getUserInfo(@PathVariable("token") String token) {
        return Result.ok(ResultCodeEnum.SUCCESS).data("userInfo", "");
    }

    @ApiOperation("修改管理员的权限")
    @PostMapping("/changeRole")
    public Result changeRole(Integer adminId) {
        System.out.println(adminId);
        return Result.ok();
    }

    // ========== 以下OSS配置接口已废弃（无需使用阿里云，可注释/删除） ==========
    /*
    @ApiOperation("获取oss配置信息")
    @GetMapping("/getOssInfo")
    public Result getOssInfo() {
        List<Config> oss = adminService.getOssConfig("oss");
        return Result.ok(ResultCodeEnum.SUCCESS).data("data", oss);
    }

    @ApiOperation("保存oss配置信息")
    @PostMapping("/saveOssInfo")
    public Result saveOssInfo(@RequestBody ossset ossset) {
        adminService.saveOssConfig(ossset);
        return Result.ok();
    }
    */

    @ApiOperation("人脸注册")
    @PostMapping("/faceDesign")
    public Result saveFace(@RequestBody faceObj faceObj) throws IOException {
        try {
            // 1. Base64转字节数组（复用原有Base64Util工具）
            byte[] bytes = Base64Util.base64ToImgByteArray(faceObj.getFace_base64());
            String fileName = faceObj.getFace_user() + ".jpeg";

            // 2. 上传到本地文件系统（替换阿里云OSS上传）
            LocalFileUtil.uploadFile(bytes, fileName);

            // 3. 入库+加载人脸到虹软引擎
            UserInfo userInfo = new UserInfo();
            userInfo.setUserName(faceObj.getFace_user());
            userInfo.setUserSex(faceObj.getFace_sex());
            try {
                adminService.insertUser(userInfo);
                List<String> userList = new ArrayList<>();
                userList.add(faceObj.getFace_user());
                // 移除OSS相关参数，仅传递用户列表
                faceFeignService.loadface(userList);
            } catch (Exception e) {
                return Result.error(ResultCodeEnum.USER_ALREADYSAVE);
            }
        } catch (Exception e) {
            System.out.println(e);
            return Result.error(ResultCodeEnum.FILE_UPLOAD_ERROR);
        }
        return Result.ok(ResultCodeEnum.SUCCESS);
    }

    @ApiOperation("查看人脸库")
    @GetMapping("/faceList")
    public Result getFaceList() {
        List<UserInfo> userList = adminService.getUserList("0");
        return Result.ok(ResultCodeEnum.SUCCESS).data("data", userList);
    }

    @ApiOperation("下载照片")
    @GetMapping("/faceinfo/{username}")
    public Result getface(@PathVariable("username") String username) {
        System.out.println("收到的数据是" + username);
        String image = null;
        try {
            // 从本地文件系统下载（替换阿里云OSS下载）
            image = LocalFileUtil.downloadFile(username + ".jpeg");
        } catch (IOException e) {
            e.printStackTrace();
            return Result.error();
        }
        return Result.ok(ResultCodeEnum.SUCCESS).data("image", "data:image/jpeg;base64," + image);
    }

    @ApiOperation("删除人脸")
    @GetMapping("/deluser/{username}")
    public Result delface(@PathVariable("username") String username) {
        System.out.println("收到的数据是" + username);
        try {
            List<String> userList = new ArrayList<>();
            userList.add(username.replace(".jpeg", ""));
            faceFeignService.delface(userList);

            // 删除本地文件（替换阿里云OSS删除）
            boolean isDelSuccess = LocalFileUtil.deleteFile(username);
            int deluser = adminService.deluser(username.replace(".jpeg", ""));

            System.out.println("文件删除结果：" + isDelSuccess + "，数据库删除结果：" + deluser);
            return Result.ok();
        } catch (IOException e) {
            e.printStackTrace();
            return Result.error(ResultCodeEnum.ERROR_DELERROR);
        }
    }

    @ApiOperation("人脸搜索")
    @PostMapping("/facesearch")
    public Result facesearch(@RequestBody String imagebase64) {
        JSONObject obj = JSONObject.parseObject(imagebase64);
        imagebase64 = obj.get("imagebase64").toString();
        List<String> usernameList = adminService.findUsernameList();
        Result facesearch = faceFeignService.facesearch(imagebase64, usernameList);
        System.out.println("查询到的信息" + facesearch.toString());
        return facesearch;
    }

    @ApiOperation("系统状态查询")
    @PostMapping("/getSystemState")
    public Result systemState() {
        String s = faceFeignService.getsystemState();
        Set<String> strings = faceFeignService.getredisfaceList();
        List<String> usernameList = adminService.findUsernameList();
        return Result.ok().data("eneigerState", s).data("redisDate", strings).data("mysqlDate", usernameList);
    }
}