import express from 'express';
import cors from 'cors';

import usersRouter from './routes/users';
import authRouter from './routes/auth';
import petsRouter from './routes/pets';
import publicationRouter from './routes/publication';

const app = express();

// middlewares globais
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(express.json());

// rotas
app.use('/users', usersRouter);
app.use('/login', authRouter);
app.use('/pets', petsRouter);
app.use('/publication', publicationRouter);

export default app;
