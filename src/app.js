import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, console.log(`Servidor iniciado com sucesso! Na porta: ${port}`));
