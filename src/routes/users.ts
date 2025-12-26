import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../database/db";

const router = Router();

/**
 * POST /users
 * Criar usuário
 */
router.post("/", async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body as {
    nome?: string;
    email?: string;
    senha?: string;
  };

  if (!nome || !email || !senha) {
    return res.status(400).json({
      error: "Preencha nome, email e senha.",
    });
  }

  try {
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rowCount && userExists.rowCount > 0) {
      return res.status(400).json({
        error: "Email já cadastrado.",
      });
    }

    const hash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO users (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [nome, email, hash]
    );

    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
});

/**
 * GET /users
 * Listar usuários
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, email, created_at FROM users"
    );

    return res.status(200).json({
      total: result.rowCount,
      users: result.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro ao buscar usuários",
    });
  }
});

export default router;
