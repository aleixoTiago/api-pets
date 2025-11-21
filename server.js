const express = require('express')
const app = express()

app.use(express.json())

// rotas
const usersRoutes = require('./routes/users')
// const petsRoutes = require('./routes/pets')

app.use('/users', usersRoutes)
// app.use('/pets', petsRoutes)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
