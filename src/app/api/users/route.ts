import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 获取用户列表
 *     description: 获取所有用户的列表，支持分页
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 限制返回的用户数量
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: 跳过的用户数量
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: 成功获取用户列表
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const offset = parseInt(searchParams.get("offset") || "0", 10);
		const database = "group_project";

		// 初始化数据库连接
		await db.initialize(database);

		// 查询用户列表
		const users = await db.query(
			`SELECT id, name, email, created_at, updated_at FROM users LIMIT ${limit} OFFSET ${offset}`,
		);

		// 获取总数
		const totalResult = await db.queryOne(
			"SELECT COUNT(*) as total FROM users",
		);
		const total = totalResult?.total || 0;

		return NextResponse.json({
			status: "success",
			message: "Users retrieved successfully",
			data: users,
			count: users.length,
			total: total,
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		console.error("获取用户列表错误:", error);

		return NextResponse.json(
			{
				status: "error",
				message: "Failed to retrieve users",
				error: error.message,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 创建新用户
 *     description: 创建一个新的用户
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: 用户创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: 用户创建成功
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email } = body;
		const database = "group_project";

		// 验证必填字段
		if (!name || !email) {
			return NextResponse.json(
				{
					status: "error",
					message: "Name and email are required fields",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}

		// 验证邮箱格式
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{
					status: "error",
					message: "Invalid email format",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}

		// 初始化数据库连接
		await db.initialize(database);

		// 检查邮箱是否已存在
		const existingUser = await db.queryOne(
			"SELECT id FROM users WHERE email = ?",
			[email],
		);

		if (existingUser) {
			return NextResponse.json(
				{
					status: "error",
					message: "Email already exists",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}

		// 创建用户
		const userId = await db.insert(
			"INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
			[name, email],
		);

		// 获取创建的用户信息
		const newUser = await db.queryOne(
			"SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
			[userId],
		);

		return NextResponse.json(
			{
				status: "success",
				message: "User created successfully",
				data: newUser,
				timestamp: new Date().toISOString(),
			},
			{ status: 201 },
		);
	} catch (error: any) {
		console.error("创建用户错误:", error);

		return NextResponse.json(
			{
				status: "error",
				message: "Failed to create user",
				error: error.message,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
