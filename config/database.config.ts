// 数据库配置接口
export interface DatabaseConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database?: string;
	connectionLimit?: number;
}

// 数据库配置 - 直接从环境变量读取
export const databaseConfig: DatabaseConfig = {
	host: process.env.DB_HOST || "",
	port: parseInt(process.env.DB_PORT || "3306", 10),
	user: process.env.DB_USER || "",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME,
	connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10),
};

// 验证配置
export const validateDatabaseConfig = (): void => {
	const requiredFields = ["host", "port", "user", "password"];
	const missingFields = requiredFields.filter((field) => {
		const value = databaseConfig[field as keyof DatabaseConfig];
		return !value || value === "";
	});

	if (missingFields.length > 0) {
		throw new Error(
			`Missing required database configuration fields: ${missingFields.join(", ")}`,
		);
	}

	if (
		Number.isNaN(databaseConfig.port) ||
		databaseConfig.port <= 0 ||
		databaseConfig.port > 65535
	) {
		throw new Error("Invalid database port number");
	}
};
