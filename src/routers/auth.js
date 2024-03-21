import express from "express";
import pool from "../database/config.js";
import bcrypt from "bcrypt";
import {
  LoginValidator,
  RegisterValidator,
} from "../validator/AuthValidator.js";
import jwt from "jsonwebtoken"
import "dotenv/config";

const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  const { body } = req;
  const payload = await RegisterValidator.validate(body);

  if (payload.error) {
    return res.status(400).json({
      message: "Data tidak valid",
      data: payload.error.message,
    });
  }

  try {
    const hashPassword = await bcrypt.hashSync(body.password, 10);

    const [rows] = await pool.query(
      `INSERT INTO users (name, email, password) VALUES('${payload.value.name}', '${payload.value.email}', '${hashPassword}')`
    );

    res.json({
      message: "Register successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { body } = req;

  const payload = await LoginValidator.validate(body);

  if (payload.error) {
    return res.status(400).json({
      message: "Data tidak valid",
      data: payload.error.message,
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = '${payload.value.email}' LIMIT 1`
    );

    if (rows.length == 0) {
      return res.status(400).json({
        message: "Data tidak valid",
        data: payload.error.message,
      });
    }

    const isBcrypt = await bcrypt.compare(
      payload.value.password,
      rows[0].password
    );

    if (!isBcrypt) {
      return res.status(400).json({
        message: "Password salah",
        data: payload.error.message,
      });
    }

    const secret = process.env.JWT_SECRET;
    const expiresIn = 60 * 60 * 1

    const token = jwt.sign(payload.value, secret, {
      expiresIn: expiresIn
    } )

    res.status(201).json({
      message: "success login",
      data: {
        name: rows[0].name,
        email: rows[0].email,
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error,
    });
  }
});

export default AuthRouter;
