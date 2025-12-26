import express from "express";
import cors from "cors";

import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import petsRoutes from "./routes/pets";

const app = express();

// middlewares globais
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// rotas
app.use("/users", usersRoutes);
app.use("/login", authRoutes);
app.use("/pets", petsRoutes);

export default app;
