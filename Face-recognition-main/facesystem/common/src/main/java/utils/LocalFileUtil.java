package utils;


import org.springframework.util.Base64Utils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * 本地文件操作工具类（替换阿里云OSS）
 */
@Component
public class LocalFileUtil {
    // 本地存储路径（可通过配置文件注入，避免硬编码）
    private static String LOCAL_STORAGE_PATH;

    @Value("${local.storage.path:D:/face_storage/}")
    public void setLocalStoragePath(String path) {
        LOCAL_STORAGE_PATH = path;
        // 初始化存储目录（不存在则创建）
        File dir = new File(LOCAL_STORAGE_PATH);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    /**
     * Base64字符串转字节数组（处理前端带前缀的Base64）
     */
    public static byte[] base64ToBytes(String base64Str) {
        if (base64Str.contains(",")) {
            base64Str = base64Str.split(",")[1]; // 移除data:image/jpeg;base64,前缀
        }
        return Base64Utils.decodeFromString(base64Str);
    }

    /**
     * 上传字节数组到本地文件
     */
    public static String uploadFile(byte[] bytes, String fileName) throws IOException {
        String filePath = LOCAL_STORAGE_PATH + fileName;
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(bytes);
        }
        return filePath;
    }

    /**
     * 下载本地文件为Base64字符串
     */
    public static String downloadFile(String fileName) throws IOException {
        String filePath = LOCAL_STORAGE_PATH + fileName;
        byte[] bytes = Files.readAllBytes(Paths.get(filePath));
        return Base64Utils.encodeToString(bytes);
    }

    /**
     * 删除本地文件
     */
    public static boolean deleteFile(String fileName) throws IOException {
        String filePath = LOCAL_STORAGE_PATH + fileName;
        File file = new File(filePath);
        return file.exists() && file.delete();
    }
}