const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const pool = require('../database/db');

router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha nome, email e senha.' })
  }

  try {
    const userExists = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
    
    if (userExists.rowCount > 0) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10)

    const result = await pool.query(
        `INSERT INTO users (nome, email, senha)
        VALUES ($1, $2, $3)
        RETURNING id, nome, email`,
        [nome, email, hash]
      );

    return res.status(201).json({
        message: 'Usuário criado com sucesso!',
        user: result.rows[0],
      });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
})

// GET /users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('Select id, nome, email, created_at from users');

    return res.status(200).json({
      total: result.rowCount,
      users: result.rows,
    });

  } catch {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao buscar usuários'})
  }
})

module.exports = router
