import { Router, Request, Response } from 'express';
import pool from '../database/db';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

interface CreatePublicationBody {
  author: string;
  authorAvatar?: string;
  category?: string;
  content?: string;
  image?: string;
  petImage?: Array<string>;
  likes?: number;
  comments?: Array<string>;
  created_at?: string;
}

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const {
    author,
    authorAvatar,
    category,
    content,
    image,
    petImage,
    likes,
    comments,
  }: CreatePublicationBody = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO publication (
        author,
        author_avatar,
        category,
        content,
        image,
        pet_image,
        likes,
        comments,
        user_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        author,
        authorAvatar,
        category,
        content,
        image,
        petImage,
        likes,
        comments,
        req.userId,
      ]
    );

    return res.status(201).json({
      publication: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro ao criar publicação',
    });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT
          p.author,
          p.author_avatar,
          p.category,
          p.content,
          p.image,
          p.pet_image,
          p.likes,
          p.comments,
          p.created_at,
          p.user_id
        FROM publication p
        WHERE p.id = $1 AND p.user_id = $2
        `,
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Publicacao não encontrada',
      });
    }

    return res.status(200).json({
      total: result.rowCount,
      publication: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro ao buscar publicacao',
    });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
        SELECT
          p.id,
          p.author,
          p.author_avatar,
          p.category,
          p.content,
          p.image,
          p.pet_image,
          p.likes,
          p.comments,
          p.created_at,
          p.user_id
        FROM publication p
        ORDER BY p.created_at DESC
        `
    );

    console.log(result.rows);

    return res.status(200).json({
      total: result.rowCount,
      publications: result.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro ao buscar publicações',
    });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    author,
    authorAvatar,
    category,
    content,
    image,
    petImage,
    likes,
    comments,
    created_at,
  }: CreatePublicationBody = req.body;

  try {
    const result = await pool.query(
      `
        UPDATE publication
        SET
          author = COALESCE($1, author),
          author_avatar = COALESCE($2, author_avatar),
          category = COALESCE($3, category),
          content = COALESCE($4, content),
          pet_image = COALESCE($5, pet_image),
          likes = COALESCE($6, likes),
          comments = COALESCE($7, comments),
          created_at = COALESCE($8, created_at),
        WHERE id = $9 AND user_id = $10
        RETURNING *
        `,
      [
        author,
        authorAvatar,
        category,
        content,
        image,
        petImage,
        likes,
        comments,
        created_at,
        req.userId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Publicacao não encontrado ou não pertence ao usuário',
      });
    }

    return res.status(200).json({
      total: result.rowCount,
      publication: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Erro ao atualizar publicacao',
    });
  }
});

export default router;
