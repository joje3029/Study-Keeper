import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // 개발환경에서만 true로 설정
    logging: true,
    entities: ["src/models/**/*.ts"],
    subscribers: [],
    migrations: [],
});
