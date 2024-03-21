import express from "express";
import pool from "../database/config.js";
import { UpdateUsers } from "../validator/UserValidator.js";
import authValidation from "../midlleware/authValidation.js";

const UserRoutes = express.Router();



UserRoutes.get("/", authValidation, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, name, email FROM users`);

    res.json({
      message: "get data successfully",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

UserRoutes.patch("/:id", authValidation, async (req, res) => {
    const { id } = req.params;
    const {body} = req
  
    const payload = await UpdateUsers.validate(body);
  
    if (payload.error) {
      return res.status(400).json({
        message: "Data tidak valid",
        data: payload.error.message,
      });
    }
  
    try {
      const [rows] = await pool.query(`UPDATE users SET ? WHERE id = ?`, [
        payload.value,
        id,
      ]);
  
      res.json({
        message: "update data successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  });

export default UserRoutes;
