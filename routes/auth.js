const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1',
        [email]);

    if (result.rowCount == 0) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const user = result.rows[0];
 
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }


    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome
      }
    });
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao logar'})
  }
});

module.exports = router
