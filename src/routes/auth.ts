import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../database/db";

const router = Router();

/**
 * Tipagem do body do login
 */
interface LoginBody {
  email?: string;
  senha?: string;
}

/**
 * POST /login
 */
router.post("/", async (req: Request, res: Response) => {
  const { email, senha } = req.body as LoginBody;

  if (!email || !senha) {
    return res.status(400).json({
      message: "Email e senha são obrigatórios",
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, nome, email, senha FROM users WHERE email = $1",
      [email]
    );

    if (!result.rowCount || result.rowCount === 0) {
      return res.status(401).json({
        message: "Credenciais inválidas",
      });
    }

    const user = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        message: "Credenciais inválidas",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro ao logar",
    });
  }
});

export default router;
