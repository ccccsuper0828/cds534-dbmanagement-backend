/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Error message
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2025-09-29T10:30:45.123Z
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 用户ID
 *           example: 1
 *         name:
 *           type: string
 *           description: 用户姓名
 *           example: "张三"
 *         email:
 *           type: string
 *           format: email
 *           description: 用户邮箱
 *           example: "zhangsan@example.com"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *           example: "2025-09-29T10:30:45.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *           example: "2025-09-29T10:30:45.000Z"
 *       required:
 *         - id
 *         - name
 *         - email
 *         - created_at
 *         - updated_at
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: 用户姓名
 *           example: "李四"
 *           minLength: 1
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: 用户邮箱
 *           example: "lisi@example.com"
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 用户姓名（可选）
 *           example: "王五"
 *           minLength: 1
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: 用户邮箱（可选）
 *           example: "wangwu@example.com"
 *   tags:
 *     - name: Users
 *       description: 用户管理API - 完整的CRUD操作
 */