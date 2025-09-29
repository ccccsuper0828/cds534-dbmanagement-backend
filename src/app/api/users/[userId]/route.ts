import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: 获取单个用户
 *     description: 根据用户ID获取用户详细信息
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户信息
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
 *                   example: 成功获取用户信息
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
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
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const { userId } = await params;
		const id = parseInt(userId, 10);
		const database = "group_project";

		// 验证ID
		if (Number.isNaN(id) || id <= 0) {
			return NextResponse.json(
				{
					status: "error",
					message: "Invalid user ID",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}

		// 初始化数据库连接
		await db.initialize(database);

		// 查询用户
		const user = await db.queryOne(
			"SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
			[id],
		);

		if (!user) {
			return NextResponse.json(
				{
					status: "error",
					message: "User not found",
					timestamp: new Date().toISOString(),
				},
				{ status: 404 },
			);
		}

		return NextResponse.json({
			status: "success",
			message: "成功获取用户信息",
			data: user,
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		console.error("获取用户错误:", error);

		return NextResponse.json(
			{
				status: "error",
				message: "Failed to retrieve user",
				error: error.message,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: 更新用户信息
 *     description: 根据用户ID更新用户信息
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: User updated successfully
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
 *       404:
 *         description: User not found
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
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const { userId } = await params;
		const id = parseInt(userId, 10);
		const body = await request.json();
		const { name, email } = body;
		const database = "group_project";

		// 验证ID
		if (Number.isNaN(id) || id <= 0) {
			return NextResponse.json(
				{
					status: "error",
					message: "Invalid user ID",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}

		// 验证至少有一个字段要更新
		if (!name && !email) {
			return NextResponse.json(
				{
					status: "error",
					message: "At least one field must be provided for update",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}

		// 验证邮箱格式
		if (email) {
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
		}

		// 初始化数据库连接
		await db.initialize(database);

		// 检查用户是否存在
		const existingUser = await db.queryOne(
			"SELECT id FROM users WHERE id = ?",
			[id],
		);

		if (!existingUser) {
			return NextResponse.json(
				{
					status: "error",
					message: "User not found",
					timestamp: new Date().toISOString(),
				},
				{ status: 404 },
			);
		}

		// 如果更新邮箱，检查邮箱是否已被其他用户使用
		if (email) {
			const emailExists = await db.queryOne(
				"SELECT id FROM users WHERE email = ? AND id != ?",
				[email, id],
			);

			if (emailExists) {
				return NextResponse.json(
					{
						status: "error",
						message: "Email already used by another user",
						timestamp: new Date().toISOString(),
					},
					{ status: 400 },
				);
			}
		}

		// 构建更新语句
		const updateFields = [];
		const updateValues = [];

		if (name) {
			updateFields.push("name = ?");
			updateValues.push(name);
		}
		if (email) {
			updateFields.push("email = ?");
			updateValues.push(email);
		}

		updateFields.push("updated_at = NOW()");
		updateValues.push(id);

		// 更新用户
		const affectedRows = await db.execute(
			`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
			updateValues,
		);

		if (affectedRows === 0) {
			return NextResponse.json(
				{
					status: "error",
					message: "Update failed",
					timestamp: new Date().toISOString(),
				},
				{ status: 500 },
			);
		}

		// 获取更新后的用户信息
		const updatedUser = await db.queryOne(
			"SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
			[id],
		);

		return NextResponse.json({
			status: "success",
			message: "User updated successfully",
			data: updatedUser,
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		console.error("更新用户错误:", error);

		return NextResponse.json(
			{
				status: "error",
				message: "Failed to update user",
				error: error.message,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: 删除用户
 *     description: 根据用户ID删除用户
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: User deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
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
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const { userId } = await params;
		const id = parseInt(userId, 10);
		const database = "group_project";

		// 验证ID
		if (Number.isNaN(id) || id <= 0) {
			return NextResponse.json(
				{
					status: "error",
					message: "Invalid user ID",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}

		// 初始化数据库连接
		await db.initialize(database);

		// 先获取用户信息
		const user = await db.queryOne(
			"SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
			[id],
		);

		if (!user) {
			return NextResponse.json(
				{
					status: "error",
					message: "User not found",
					timestamp: new Date().toISOString(),
				},
				{ status: 404 },
			);
		}

		// 删除用户
		const affectedRows = await db.execute("DELETE FROM users WHERE id = ?", [
			id,
		]);

		if (affectedRows === 0) {
			return NextResponse.json(
				{
					status: "error",
					message: "Delete failed",
					timestamp: new Date().toISOString(),
				},
				{ status: 500 },
			);
		}

		return NextResponse.json({
			status: "success",
			message: "User deleted successfully",
			data: user,
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		console.error("删除用户错误:", error);

		return NextResponse.json(
			{
				status: "error",
				message: "Failed to delete user",
				error: error.message,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
