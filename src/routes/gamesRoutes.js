import { Router } from "express";
import { getGames, postGames } from "../controllers/gamesController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { gameSchema } from "../schemas/gamesSchemas.js";
import { validationExist } from "../middlewares/gamesValidation.js";

const GamesRouter = Router();

GamesRouter.get("/games", getGames);
GamesRouter.post("/games", validateSchema(gameSchema), validationExist, postGames);

export default GamesRouter;
