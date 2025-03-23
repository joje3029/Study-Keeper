import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 환경변수 설정
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Study Keeper API' });
});

export default app;