const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /pets
router.post('/', async (req, res) => {
  const {
    name,
    avatar,
    especie,
    raca,
    dataNascimento,
    bio,
    userId
  } = req.body;

  if (!name || !especie || !dataNascimento || !userId) {
    return res.status(400).json({
      error: 'Preencha nome, espécie, data de nascimento e usuário.'
    });
  }

  try {
    // verifica se usuário existe
    const userExists = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const result = await pool.query(
      `INSERT INTO pets
        (name, avatar, especie, raca, data_nascimento, bio, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        avatar,
        especie,
        raca,
        new Date(dataNascimento),
        bio,
        userId
      ]
    );

    return res.status(201).json({
      message: 'Pet criado com sucesso!',
      pet: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// GET /pets/user/:userId
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id,
        p.name,
        p.avatar,
        p.especie,
        p.raca,
        p.data_nascimento,
        p.bio,
        p.user_id,
        u.nome AS tutor_nome FROM pets WHERE user_id = $1`,
      [req.userId]
    );
    return res.status(200).json({
      total: result.rowCount,
      pets: result.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar pets' });
  }
});


// GET /pets
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
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
      JOIN users u ON u.id = p.user_id
    `);

    return res.status(200).json({
      total: result.rowCount,
      pets: result.rows,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar pets.' });
  }
});

module.exports = router;
