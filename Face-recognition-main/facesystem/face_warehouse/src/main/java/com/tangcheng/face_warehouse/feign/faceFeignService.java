package com.tangcheng.face_warehouse.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import result.Result;

import java.util.List;
import java.util.Set;

@Component
@FeignClient(value = "FACE-CORN")  // 调用FACE-CORN微服务
public interface faceFeignService {
    @PutMapping("registered_engine")
    void registeredEngine();

    // 核心修改：移除OSS相关4个参数，仅保留userList
    @PutMapping("loadface")
    void loadface(@RequestParam(value = "userList") List<String> userList);

    @PutMapping("/delface")
    void delface(@RequestParam(value = "userList") List<String> userList);

    @PostMapping("/facesearch")
    Result facesearch(@RequestParam(value = "imagebase64") String imagebase64,
                      @RequestParam(value = "userList") List<String> userList);

    @GetMapping("/getsystemState")
    String getsystemState();

    @GetMapping("/getredisfaceList")
    Set<String> getredisfaceList();
}