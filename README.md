# 🔧 CDS534 后端 API 服务

基于 Next.js 15 构建的现代化API服务，提供用户管理和数据库操作功能。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 配置环境
创建 `.env` 文件：
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

服务器将在 http://localhost:3001 启动（如果3000端口被占用）

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
      "name": "张三",
      "email": "zhangsan@example.com",
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
  "name": "李四",
  "email": "lisi@example.com"
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

### 文档功能
- ✅ 交互式API测试界面
- ✅ 完整的请求/响应示例  
- ✅ 参数验证说明
- ✅ 错误码说明
- ✅ 直接在浏览器中测试API

## 🏗️ 项目架构

```
src/
├── app/
│   ├── api/                    # API 路由
│   │   ├── users/             # 用户管理API
│   │   │   ├── route.ts       # 用户列表和创建
│   │   │   └── [userId]/      # 单用户CRUD
│   │   ├── database/          # 数据库API
│   │   └── docs/              # API文档
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   └── page.tsx               # 主页
├── lib/
│   └── database.ts            # 数据库连接类
└── config/
    └── database.config.ts     # 数据库配置
```

## 🔗 数据库

### 连接信息
- **数据库**: `group_project`
- **表**: `users`
- **字段**: `id`, `name`, `email`, `created_at`, `updated_at`

### 表结构
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### ID序列说明
用户ID可能不连续（如：1,3,5,7），这是因为：
- MySQL的AUTO_INCREMENT不会重用已删除的ID
- 这确保了数据的一致性和审计追踪
- 这是标准的数据库行为，无需担心

## ⚡ 特性

- ✅ **类型安全** - 完整的TypeScript支持
- ✅ **现代化** - Next.js 15 + App Router
- ✅ **响应式** - Tailwind CSS样式
- ✅ **标准化** - RESTful API设计
- ✅ **文档化** - 自动生成的API文档
- ✅ **错误处理** - 完善的错误响应
- ✅ **CORS支持** - 跨域资源共享配置

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
{"name": "测试用户", "email": "test@example.com"}
{"name": "张三", "email": "zhangsan@test.com"}
{"name": "李四", "email": "lisi@company.com"}
```

**更新用户**:
```json
{"name": "新名字"}
{"email": "new@email.com"}
{"name": "完整更新", "email": "complete@update.com"}
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

## 🔐 安全特性

- ✅ **输入验证** - 邮箱格式、必填字段验证
- ✅ **SQL注入防护** - 使用参数化查询
- ✅ **CORS配置** - 限制跨域访问
- ✅ **错误处理** - 安全的错误信息返回

## 📞 联系我们

- **团队**: CDS534 Group
- **邮箱**: wangchao9524@gmail.com
- **项目**: 数据库课程项目

---

*最后更新: 2025年9月29日*