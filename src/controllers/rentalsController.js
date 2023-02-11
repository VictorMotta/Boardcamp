import { db } from "../config/database.connection.js";
import dayjs from "dayjs";

export const insertRental = async (req, res) => {
  const { customerId, gameId, daysRented } = req.body;
  const pricePerDay = res.locals.pricePerDay;
  const originalPrice = pricePerDay * daysRented;
  const rentDate = dayjs(new Date()).format("YYYY-MM-DD");

  try {
    await db.query(
      `INSERT INTO rentals 
      ("customerId","gameId","rentDate","daysRented","returnDate", "originalPrice", "delayFee") 
      VALUES ($1, $2,$3, $4, null, $5, null);`,
      [customerId, gameId, rentDate, daysRented, originalPrice]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
