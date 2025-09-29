import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { databaseConfig } from "@/config/database.config";

/**
 * @swagger
 * /api/database/test:
 *   get:
 *     summary: 测试数据库连接
 *     description: 测试与MySQL数据库的连接状态并获取可用数据库列表
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: 数据库连接成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "数据库连接成功！"
 *                 data:
 *                   type: object
 *                   properties:
 *                     connectionStatus:
 *                       type: string
 *                       example: "connected"
 *                     availableDatabases:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["information_schema", "mysql", "test"]
 *                     host:
 *                       type: string
 *                       example: "database_host"
 *                     port:
 *                       type: number
 *                       example: 3306
 *                     user:
 *                       type: string
 *                       example: "username"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: 数据库连接失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
	try {
		// 测试基本连接
		const isConnected = await db.testConnection();

		if (!isConnected) {
			return NextResponse.json(
				{
					status: "error",
					message: "数据库连接失败",
					timestamp: new Date().toISOString(),
				},
				{ status: 500 },
			);
		}

		// 获取数据库信息
		const databases = await db.getDatabases();

		return NextResponse.json({
			status: "success",
			message: "数据库连接成功！",
			data: {
				connectionStatus: "connected",
				availableDatabases: databases,
				host: databaseConfig.host,
				port: databaseConfig.port,
				user: databaseConfig.user,
			},
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		console.error("数据库测试错误:", error);

		return NextResponse.json(
			{
				status: "error",
				message: "数据库连接测试失败",
				error: error.message,
				details: {
					host: databaseConfig.host,
					port: databaseConfig.port,
					user: databaseConfig.user,
				},
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

/**
 * @swagger
 * /api/database/test:
 *   post:
 *     summary: 执行数据库查询操作
 *     description: 执行自定义SQL查询、获取表结构或其他数据库操作
 *     tags: [Database]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatabaseTestRequest'
 *     responses:
 *       200:
 *         description: 数据库操作成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "数据库操作完成"
 *                 data:
 *                   type: object
 *                   description: 查询结果数据
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: 数据库操作失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { databaseName, tableName, query: customQuery } = body;

		// 如果指定了数据库名，初始化连接到该数据库
		if (databaseName) {
			await db.initialize(databaseName);
		}

		let result: any = {};

		// 如果提供了自定义查询
		if (customQuery) {
			try {
				const queryResult = await db.query(customQuery);
				result.customQueryResult = queryResult;
			} catch (queryError: any) {
				result.customQueryError = queryError.message;
			}
		}

		// 如果指定了数据库名，获取表列表
		if (databaseName) {
			try {
				const tables = await db.getTables();
				result.tables = tables;
			} catch (tableError: any) {
				result.tablesError = tableError.message;
			}
		}

		// 如果指定了表名，获取表结构
		if (tableName && databaseName) {
			try {
				const tableStructure = await db.query(`DESCRIBE ${tableName}`);
				result.tableStructure = tableStructure;
			} catch (structureError: any) {
				result.tableStructureError = structureError.message;
			}
		}

		return NextResponse.json({
			status: "success",
			message: "数据库操作完成",
			data: result,
			timestamp: new Date().toISOString(),
		});
	} catch (error: any) {
		console.error("数据库POST操作错误:", error);

		return NextResponse.json(
			{
				status: "error",
				message: "数据库操作失败",
				error: error.message,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
