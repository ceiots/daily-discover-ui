package com.example.config;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ResponseBodyAdvice;

import java.lang.reflect.Field;
import java.util.List;

@ControllerAdvice
public class ImageUrlResponseBodyAdvice implements ResponseBodyAdvice<Object> {
    
    private static final String IMAGE_PREFIX = "https://your-domain.com";
    
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }
    
    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request,
            ServerHttpResponse response) {
        if (body == null) {
            return null;
        }
        
        // 处理列表
        if (body instanceof List) {
            ((List<?>) body).forEach(this::processObject);
        } else {
            // 处理单个对象
            processObject(body);
        }
        
        return body;
    }
    
    private void processObject(Object obj) {
        // 通过反射获取所有字段
        Field[] fields = obj.getClass().getDeclaredFields();
        for (Field field : fields) {
            if (field.getName().toLowerCase().contains("imageurl") || 
                field.getName().toLowerCase().contains("avatarurl")) {
                field.setAccessible(true);
                try {
                    String value = (String) field.get(obj);
                    if (value != null && !value.startsWith("http")) {
                        field.set(obj, IMAGE_PREFIX + value);
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
    }
} 