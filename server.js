const express = require('express')
require('dotenv').config();
const cors = require('cors')

const app = express()

// habilitar CORS para permitir requisições do front (http://localhost:3000)
app.use(cors({
  origin: "http://localhost:3000"
}))

app.use(express.json())

// rotas
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
// const petsRoutes = require('./routes/pets')

app.use('/users', usersRoutes)
app.use('/login', authRoutes)
// app.use('/pets', petsRoutes)

const PORT = 4000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
