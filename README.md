# 🔧 CDS534 后端 API 服务


## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 配置环境
创建 `.env.local` 文件：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_CONNECTION_LIMIT=10
```

### 启动开发服务器
```bash
npm run dev
```

服务器将在 http://localhost:3001 启动

## 📋 API 端点

### 👥 用户管理 API

#### 获取用户列表
```http
GET /api/users?limit=10&offset=0
```

**响应示例**:
```json
{
  "status": "success",
  "message": "Users retrieved successfully", 
  "data": [
    {
      "id": 1,
      "name": "test",
      "email": "test@example.com",
      "created_at": "2025-09-29T10:30:45.000Z",
      "updated_at": "2025-09-29T10:30:45.000Z"
    }
  ],
  "count": 1,
  "total": 1
}
```

#### 创建用户
```http
POST /api/users
Content-Type: application/json

{
  "name": "test",
  "email": "test@example.com"
}
```

#### 获取单个用户
```http
GET /api/users/{userId}
```

#### 更新用户
```http
PUT /api/users/{userId}
Content-Type: application/json

{
  "name": "新名字",
  "email": "new@email.com"
}
```

#### 删除用户
```http
DELETE /api/users/{userId}
```

### 🗄️ 数据库 API

#### 测试数据库连接
```http
GET /api/database/test
```

#### 执行数据库查询
```http
POST /api/database/test
Content-Type: application/json

{
  "databaseName": "group_project",
  "query": "SELECT * FROM users LIMIT 5"
}
```

## 📚 API 文档

访问 **http://localhost:3001/api/docs** 查看完整的Swagger UI文档。

## 🧪 测试

### 使用Swagger UI（推荐）
1. 访问 http://localhost:3001/api/docs
2. 选择要测试的API端点
3. 点击 "Try it out"
4. 输入参数或JSON数据
5. 点击 "Execute" 执行

### 示例测试数据

**创建用户**:
```json
{"name": "test2", "email": "test2@example.com"}
```

**更新用户**:
```json
{"name": "new name"}
{"email": "new@email.com"}
{"name": "check", "email": "complete@update.com"}
```

## 🛠️ 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 代码检查
npm run format   # 代码格式化
```

## 📝 API 响应格式

### 成功响应
```json
{
  "status": "success",
  "message": "操作成功信息",
  "data": { /* 返回数据 */ },
  "timestamp": "2025-09-29T10:30:45.123Z"
}
```

### 错误响应
```json
{
  "status": "error", 
  "message": "错误描述",
  "error": "详细错误信息",
  "timestamp": "2025-09-29T10:30:45.123Z"
}
```

## 📞 联系我们

- **团队**: CDS534 Group
- **邮箱**: wangchao9524@gmail.com
- **项目**: 数据库课程项目

---

*最后更新: 2025年9月29日*
