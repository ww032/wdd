package com.tangcheng.face_corn.service.impl;

import com.alibaba.fastjson.JSON;
import com.arcsoft.face.*;
import com.arcsoft.face.enums.DetectMode;
import com.arcsoft.face.enums.DetectOrient;
import com.arcsoft.face.enums.ErrorInfo;
import com.arcsoft.face.toolkit.ImageInfo;
import com.tangcheng.face_corn.faceModel.faceEngineModel;
import com.tangcheng.face_corn.service.faceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import utils.Base64Util;

import static com.arcsoft.face.toolkit.ImageFactory.getRGBData;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class faceServiceImpl implements faceService {
    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    public void registeredEngine(String appId,String sdkKey,String dllPath) {
        System.out.println("appId" + appId);
        System.out.println("sdkKey" + sdkKey);
        System.out.println("dllPath" + dllPath);

        FaceEngine faceEngine = faceEngineModel.init(dllPath);
        //激活引擎
        int errorCode = faceEngine.activeOnline(appId, sdkKey);

        if (errorCode != ErrorInfo.MOK.getValue() && errorCode != ErrorInfo.MERR_ASF_ALREADY_ACTIVATED.getValue()) {
            System.out.println("引擎激活失败");
        }
        ActiveFileInfo activeFileInfo=new ActiveFileInfo();
        errorCode = faceEngine.getActiveFileInfo(activeFileInfo);
        if (errorCode != ErrorInfo.MOK.getValue() && errorCode != ErrorInfo.MERR_ASF_ALREADY_ACTIVATED.getValue()) {
            System.out.println("获取激活文件信息失败");
        }

        //引擎配置
        EngineConfiguration engineConfiguration = new EngineConfiguration();
        engineConfiguration.setDetectMode(DetectMode.ASF_DETECT_MODE_IMAGE);
        engineConfiguration.setDetectFaceOrientPriority(DetectOrient.ASF_OP_ALL_OUT);
        engineConfiguration.setDetectFaceMaxNum(10);
        engineConfiguration.setDetectFaceScaleVal(16);
        //功能配置
        FunctionConfiguration functionConfiguration = new FunctionConfiguration();
        functionConfiguration.setSupportAge(true);
        functionConfiguration.setSupportFace3dAngle(true);
        functionConfiguration.setSupportFaceDetect(true);
        functionConfiguration.setSupportFaceRecognition(true);
        functionConfiguration.setSupportGender(true);
        functionConfiguration.setSupportLiveness(true);
        functionConfiguration.setSupportIRLiveness(true);
        engineConfiguration.setFunctionConfiguration(functionConfiguration);

        //初始化引擎
        errorCode = faceEngine.init(engineConfiguration);

        if (errorCode != ErrorInfo.MOK.getValue()) {
            System.out.println("初始化引擎失败");
        }
        System.out.println("激活成功");
    }

    @Override
    public void loadFace(List<String> userList) throws IOException {
        // 【核心修改1】删除所有OSS相关代码，调整人脸照片加载逻辑
        // 说明：原逻辑从OSS下载照片，需替换为新的照片来源（示例：本地路径/数据库二进制/其他存储）
        // 以下为「本地路径加载」示例（需根据实际存储路径调整）
        String facePhotoBasePath = "/path/to/your/local/face/photos/"; // 替换为实际本地人脸照片存储路径

        for (int i = 0; i < userList.size(); i++) {
            String itemUser = userList.get(i);
            // 【核心修改2】移除OSS下载，改为本地文件流读取（或其他存储方式）
            // 示例：从本地路径读取人脸照片（文件名=用户名+.jpeg）
            String photoPath = facePhotoBasePath + itemUser + ".jpeg";
            InputStream inputStream = new java.io.FileInputStream(photoPath); // 本地文件流

            // 原有人脸特征提取逻辑保留（无需修改）
            ImageInfo imageInfo = getRGBData(inputStream);
            FaceEngine faceEngine = faceEngineModel.getFaceEngine();

            List<FaceInfo> faceInfoList = new ArrayList<FaceInfo>();
            int code1 = faceEngine.detectFaces(imageInfo.getImageData(), imageInfo.getWidth(), imageInfo.getHeight(), imageInfo.getImageFormat(), faceInfoList);
            System.out.println("人脸检测返回码：" + code1);

            // 特征提取（需确保人脸检测到至少1个人脸）
            if (!faceInfoList.isEmpty()) {
                FaceFeature faceFeature = new FaceFeature();
                int code2 = faceEngine.extractFaceFeature(imageInfo.getImageData(), imageInfo.getWidth(), imageInfo.getHeight(), imageInfo.getImageFormat(), faceInfoList.get(0), faceFeature);
                System.out.println("特征提取返回码：" + code2);
                redisTemplate.opsForValue().set(itemUser, Base64Util.encode(faceFeature.getFeatureData()));
            } else {
                System.out.println("用户「" + itemUser + "」的照片未检测到人脸");
            }
            inputStream.close(); // 关闭流
        }
    }

    @Override
    public String facesearch(InputStream inputStream,List<String> userList) throws IOException {
        ImageInfo imageInfo = getRGBData(inputStream);
        FaceEngine faceEngine = faceEngineModel.getFaceEngine();

        List<FaceInfo> faceInfoList = new ArrayList<FaceInfo>();
        int code1 = faceEngine.detectFaces(imageInfo.getImageData(), imageInfo.getWidth(), imageInfo.getHeight(), imageInfo.getImageFormat(), faceInfoList);
        System.out.println("搜索人脸检测返回码：" + code1);

        // 特征提取（传来的脸）
        if (faceInfoList.isEmpty()) {
            return null; // 未检测到人脸，直接返回
        }
        FaceFeature targetFaceFeature = new FaceFeature();
        faceEngine.extractFaceFeature(imageInfo.getImageData(), imageInfo.getWidth(), imageInfo.getHeight(), imageInfo.getImageFormat(), faceInfoList.get(0), targetFaceFeature);

        for (int index = 0 ;index < userList.size();index ++){
            String key = userList.get(index);
            String objstring = String.valueOf(redisTemplate.opsForValue().get(key));
            if (objstring == null || objstring.equals("null")) {
                continue; // 跳过Redis中无特征的用户
            }
            byte[] bytes = Base64Util.base64ToImgByteArray(objstring);
            FaceFeature sourceFaceFeature = new FaceFeature();
            sourceFaceFeature.setFeatureData(bytes);
            FaceSimilar faceSimilar = new FaceSimilar();
            int errorCode = faceEngine.compareFaceFeature(targetFaceFeature, sourceFaceFeature, faceSimilar);
            float score = faceSimilar.getScore();
            System.out.println("用户「" + key + "」匹配得分：" + score);
            if (score >=0.8){
                return key;
            }
        }
        return null;
    }

    @Override
    public String engineState() {
        FaceEngine faceEngine = faceEngineModel.getFaceEngine();
        if (faceEngine == null){
            return "0"; // 引擎未初始化
        }else {
            return "1"; // 引擎正常
        }
    }

    @Override
    public Set<String> getfaceList() {
        // *号 必须要加，否则无法模糊查询
        Set keys = redisTemplate.keys("*");
        System.out.println("Redis中人脸特征数量：" + keys.size());
        return keys;
    }

    @Override
    public void delface(List<String> userList) throws IOException {
        for (int i = 0;i<userList.size();i++){
            redisTemplate.delete(userList.get(i));
        }
        System.out.println("成功删除Redis中「" + userList.size() + "」个人脸特征");
    }
}