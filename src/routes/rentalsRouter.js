import { Router } from "express";
import { getRentals, insertRental } from "../controllers/rentalsController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { insertRentalSchema } from "../schemas/rentalSchemas.js";
import { verifyInsertRentals, verifyStockGames } from "../middlewares/rentalsValidation.js";

const RentalsRouter = Router();

RentalsRouter.get("/rentals", getRentals);
RentalsRouter.post(
  "/rentals",
  validateSchema(insertRentalSchema),
  verifyInsertRentals,
  verifyStockGames,
  insertRental
);

export default RentalsRouter;
