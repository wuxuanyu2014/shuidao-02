# 图片上传接口开发需求

## 接口信息
- **接口路径**: `/api/uploadImage`
- **请求方法**: `POST`
- **Content-Type**: `multipart/form-data`

## 功能需求
开发一个图片上传接口，将用户上传的图片文件保存到腾讯云COS（对象存储），并返回图片的访问URL。

## 请求参数
- **参数名**: `file`
- **参数类型**: `File` (multipart/form-data格式的文件)
- **必填**: 是
- **说明**: 用户上传的图片文件

## 功能要求
1. **文件验证**:
   - 仅允许上传图片文件（jpg, jpeg, png, gif, webp等）
   - 文件大小限制：最大5MB
   - 如果文件类型不符合或文件过大，返回错误信息

2. **腾讯云COS上传**:
   - 将文件上传到腾讯云COS对象存储
   - 文件路径建议格式：`images/pesticide/{timestamp}_{随机字符串}.{文件扩展名}`
   - 或者：`images/agricultural-management/{timestamp}_{随机字符串}.{文件扩展名}`
   - 确保文件名唯一，避免覆盖

3. **返回格式**:
   接口需要返回以下格式之一（前端已兼容多种格式）：
   
   **推荐格式1**:
   ```json
   {
     "success": true,
     "data": {
       "url": "https://your-cos-domain.com/images/pesticide/1234567890_abc123.jpg"
     }
   }
   ```
   
   **格式2**:
   ```json
   {
     "url": "https://your-cos-domain.com/images/pesticide/1234567890_abc123.jpg"
   }
   ```
   
   **格式3**:
   ```json
   {
     "data": "https://your-cos-domain.com/images/pesticide/1234567890_abc123.jpg"
   }
   ```

4. **错误处理**:
   - 文件类型错误：返回 `{ "success": false, "message": "只能上传图片文件" }`
   - 文件过大：返回 `{ "success": false, "message": "文件大小不能超过5MB" }`
   - 上传失败：返回 `{ "success": false, "message": "图片上传失败：具体错误信息" }`

## 技术实现建议
1. **腾讯云COS SDK**: 使用腾讯云COS的SDK进行文件上传
2. **文件命名**: 使用时间戳+随机字符串确保文件名唯一
3. **文件路径**: 建议按业务分类存储，如 `images/pesticide/` 或 `images/agricultural-management/`
4. **访问权限**: 确保上传的文件设置为公共读权限，或者返回带签名的临时URL

## 使用场景
此接口主要用于系统配置管理页面，用户上传农药管理相关的图片，图片URL会保存到配置数据中。

## 注意事项
- 确保腾讯云COS的配置信息（SecretId, SecretKey, Region, Bucket等）已正确配置
- 考虑文件安全性，建议对上传的文件进行病毒扫描或内容验证
- 如果使用临时密钥，注意密钥的有效期
- 建议添加日志记录，方便排查问题

## 示例代码结构（参考）
```javascript
// 伪代码示例
async function uploadImage(req, res) {
  try {
    // 1. 获取上传的文件
    const file = req.file;
    
    // 2. 验证文件类型和大小
    if (!isImageFile(file)) {
      return res.json({ success: false, message: '只能上传图片文件' });
    }
    if (file.size > 5 * 1024 * 1024) {
      return res.json({ success: false, message: '文件大小不能超过5MB' });
    }
    
    // 3. 生成唯一文件名
    const fileName = generateUniqueFileName(file.originalname);
    const filePath = `images/pesticide/${fileName}`;
    
    // 4. 上传到腾讯云COS
    const cosUrl = await uploadToTencentCOS(file.buffer, filePath);
    
    // 5. 返回图片URL
    return res.json({
      success: true,
      data: {
        url: cosUrl
      }
    });
  } catch (error) {
    return res.json({
      success: false,
      message: '图片上传失败：' + error.message
    });
  }
}
```

## 测试要求
- 测试上传jpg、png、gif等常见图片格式
- 测试上传超过5MB的文件（应返回错误）
- 测试上传非图片文件（应返回错误）
- 验证返回的URL可以正常访问
- 测试并发上传多个文件


