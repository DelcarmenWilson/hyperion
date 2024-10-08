import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const login = async (userId: string) =>
  await pool.query(`CALL loginStatusOn(?)`, [userId]);

const logoff = async (userId: string) =>
  await pool.query(`CALL loginStatusOff(?)`, [userId]);

export { login, logoff };
