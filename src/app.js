import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import GamesRouter from "./routes/gamesRoutes.js";
import ClientesRouter from "./routes/clientesRoutes.js";
import RentalsRouter from "./routes/rentalsRouter.js";
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use([GamesRouter, ClientesRouter, RentalsRouter]);

app.listen(port, console.log(`Servidor iniciado com sucesso! Na porta: ${port}`));
