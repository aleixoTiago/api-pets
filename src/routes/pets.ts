import { Router, Request, Response } from 'express';
import pool from '../database/db';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

interface CreatePetBody {
  name?: string;
  avatar?: string;
  especie?: string;
  raca?: string;
  dataNascimento?: string | number;
  bio?: string;
  userId?: number;
}

router.post('/', async (req: Request, res: Response) => {
  const { name, avatar, especie, raca, dataNascimento, bio, userId } =
    req.body as CreatePetBody;

  if (!name || !especie || !dataNascimento || !userId) {
    return res.status(400).json({
      error: 'Preencha nome, espécie, data de nascimento e usuário.',
    });
  }

  try {
    // verifica se usuário existe
    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [
      userId,
    ]);

    if (!userExists.rowCount || userExists.rowCount === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado.',
      });
    }

    const result = await pool.query(
      `INSERT INTO pets
        (name, avatar, especie, raca, data_nascimento, bio, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        avatar || null,
        especie,
        raca || null,
        new Date(dataNascimento),
        bio || null,
        userId,
      ]
    );

    return res.status(201).json({
      message: 'Pet criado com sucesso!',
      pet: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro interno do servidor.',
    });
  }
});

/**
 * GET /pets/my
 * Pets do usuário autenticado
 */
router.get('/my', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
          p.id,
          p.name,
          p.avatar,
          p.especie,
          p.raca,
          p.data_nascimento,
          p.bio,
          u.nome AS tutor_nome
        FROM pets p
        JOIN users u ON u.id = p.user_id
        WHERE p.user_id = $1`,
      [req.userId]
    );

    return res.status(200).json({
      total: result.rowCount,
      pets: result.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro ao buscar pets',
    });
  }
});

/**
 * GET /pets
 * Listar todos os pets
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
        p.id,
        p.name,
        p.avatar,
        p.especie,
        p.raca,
        p.data_nascimento,
        p.bio,
        p.user_id,
        u.nome AS tutor_nome
      FROM pets p
      JOIN users u ON u.id = p.user_id`
    );

    return res.status(200).json({
      total: result.rowCount,
      pets: result.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro ao buscar pets.',
    });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, avatar, especie, raca, dataNascimento, bio }: CreatePetBody =
    req.body;

  try {
    const result = await pool.query(
      `
        UPDATE pets
        SET
          name = COALESCE($1, name),
          avatar = COALESCE($2, avatar),
          especie = COALESCE($3, especie),
          raca = COALESCE($4, raca),
          data_nascimento = COALESCE($5, data_nascimento),
          bio = COALESCE($6, bio)
        WHERE id = $7 AND user_id = $8
        RETURNING *
        `,
      [name, avatar, especie, raca, dataNascimento, bio, id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Pet não encontrado ou não pertence ao usuário',
      });
    }

    return res.status(200).json({
      pet: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro ao atualizar pet',
    });
  }
});

export default router;
