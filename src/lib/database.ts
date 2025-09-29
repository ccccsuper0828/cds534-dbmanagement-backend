import mysql from "mysql2/promise";
import {
	databaseConfig,
	validateDatabaseConfig,
	type DatabaseConfig,
} from "@/config/database.config";

// 数据库连接类
class Database {
	private static instance: Database;
	private pool: mysql.Pool | null = null;
	private config: DatabaseConfig;

	private constructor() {
		// 验证配置
		validateDatabaseConfig();

		// 使用配置文件中的设置
		this.config = { ...databaseConfig };
	}

	// 单例模式，确保整个应用只有一个数据库连接实例
	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	// 初始化连接池
	public async initialize(databaseName?: string): Promise<void> {
		try {
			if (databaseName) {
				this.config.database = databaseName;
			}

			this.pool = mysql.createPool(this.config);

			// 测试连接
			const connection = await this.pool.getConnection();
			console.log("✅ 数据库连接成功");
			connection.release();
		} catch (error) {
			console.error("❌ 数据库连接失败:", error);
			throw error;
		}
	}

	// 获取连接池
	public getPool(): mysql.Pool {
		if (!this.pool) {
			throw new Error("数据库未初始化，请先调用 initialize() 方法");
		}
		return this.pool;
	}

	// 执行查询
	public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
		if (!this.pool) {
			throw new Error("数据库未初始化，请先调用 initialize() 方法");
		}

		try {
			const [rows] = await this.pool.execute(sql, params);
			return rows as T[];
		} catch (error) {
			console.error("SQL查询错误:", error);
			console.error("SQL语句:", sql);
			console.error("参数:", params);
			throw error;
		}
	}

	// 执行单条查询（返回第一条记录）
	public async queryOne<T = any>(
		sql: string,
		params?: any[],
	): Promise<T | null> {
		const results = await this.query<T>(sql, params);
		return results.length > 0 ? results[0] : null;
	}

	// 执行插入并返回插入ID
	public async insert(sql: string, params?: any[]): Promise<number> {
		if (!this.pool) {
			throw new Error("数据库未初始化，请先调用 initialize() 方法");
		}

		try {
			const [result] = await this.pool.execute(sql, params);
			const insertResult = result as mysql.ResultSetHeader;
			return insertResult.insertId;
		} catch (error) {
			console.error("SQL插入错误:", error);
			console.error("SQL语句:", sql);
			console.error("参数:", params);
			throw error;
		}
	}

	// 执行更新/删除并返回影响行数
	public async execute(sql: string, params?: any[]): Promise<number> {
		if (!this.pool) {
			throw new Error("数据库未初始化，请先调用 initialize() 方法");
		}

		try {
			const [result] = await this.pool.execute(sql, params);
			const executeResult = result as mysql.ResultSetHeader;
			return executeResult.affectedRows;
		} catch (error) {
			console.error("SQL执行错误:", error);
			console.error("SQL语句:", sql);
			console.error("参数:", params);
			throw error;
		}
	}

	// 开始事务
	public async beginTransaction(): Promise<mysql.PoolConnection> {
		if (!this.pool) {
			throw new Error("数据库未初始化，请先调用 initialize() 方法");
		}

		const connection = await this.pool.getConnection();
		await connection.beginTransaction();
		return connection;
	}

	// 提交事务
	public async commitTransaction(
		connection: mysql.PoolConnection,
	): Promise<void> {
		try {
			await connection.commit();
		} finally {
			connection.release();
		}
	}

	// 回滚事务
	public async rollbackTransaction(
		connection: mysql.PoolConnection,
	): Promise<void> {
		try {
			await connection.rollback();
		} finally {
			connection.release();
		}
	}

	// 测试数据库连接
	public async testConnection(): Promise<boolean> {
		try {
			if (!this.pool) {
				await this.initialize();
			}

			const result = await this.query("SELECT 1 as test");
			return result.length > 0 && result[0].test === 1;
		} catch (error) {
			console.error("数据库连接测试失败:", error);
			return false;
		}
	}

	// 获取数据库列表
	public async getDatabases(): Promise<string[]> {
		try {
			const results = await this.query("SHOW DATABASES");
			return results.map((row: any) => row.Database);
		} catch (error) {
			console.error("获取数据库列表失败:", error);
			throw error;
		}
	}

	// 获取表列表
	public async getTables(databaseName?: string): Promise<string[]> {
		try {
			let sql = "SHOW TABLES";
			if (databaseName) {
				sql = `SHOW TABLES FROM ${databaseName}`;
			}
			const results = await this.query(sql);
			const tableKey = Object.keys(results[0] || {})[0];
			return results.map((row: any) => row[tableKey]);
		} catch (error) {
			console.error("获取表列表失败:", error);
			throw error;
		}
	}

	// 关闭连接池
	public async close(): Promise<void> {
		if (this.pool) {
			await this.pool.end();
			this.pool = null;
		}
	}
}

// 导出数据库实例
export const db = Database.getInstance();

// 导出Database类供需要时使用
export { Database };

// 导出类型
export type { DatabaseConfig };
