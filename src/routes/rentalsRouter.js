import { Router } from "express";
import {
  deleteRental,
  getRentals,
  insertRental,
  returnRentals,
} from "../controllers/rentalsController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { insertRentalSchema } from "../schemas/rentalSchemas.js";
import {
  verifyDeleteRental,
  verifyInsertRentals,
  verifyReturnRentals,
  verifyStockGames,
} from "../middlewares/rentalsValidation.js";

const RentalsRouter = Router();

RentalsRouter.get("/rentals", getRentals);
RentalsRouter.post(
  "/rentals",
  validateSchema(insertRentalSchema),
  verifyInsertRentals,
  verifyStockGames,
  insertRental
);
RentalsRouter.post("/rentals/:id/return", verifyReturnRentals, returnRentals);
RentalsRouter.delete("/rentals/:id", verifyDeleteRental, deleteRental);

export default RentalsRouter;
