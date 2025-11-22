const express = require('express')
const router = express.Router()

// "banco" de users em memória
const users = []

// POST /users
router.post('/', (req, res) => {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha nome, email e senha.' })
  }

  const novoUser = {
    id: users.length + 1,
    nome,
    email,
    senha
  }

  users.push(novoUser)

  return res.status(201).json({
    message: 'Usuário criado com sucesso!',
    user: novoUser
  })
})

// GET /users
router.get('/', (req, res) => {
  return res.status(200).json({
    total: users.length,
    users
  })
})

module.exports = router
