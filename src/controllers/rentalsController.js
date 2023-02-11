import { db } from "../config/database.connection.js";
import dayjs from "dayjs";

export const getRentals = async (req, res) => {
  try {
    const rentals = await db.query(
      `SELECT json_build_object(
      'id',rentals.id,
      'customerId', rentals."customerId",
      'gameId', rentals."gameId",
      'rentDate', rentals."rentDate",
      'daysRented', rentals."daysRented",
      'returnDate', rentals."returnDate",
      'originalPrice', rentals."originalPrice",
      'delayFee', rentals."delayFee",
      'customer', json_build_object(
        'id',customers.id,
        'name', customers.name
      ),
      'game', json_build_object(
        'id',games.id,
        'name', games.name
      )
    )
    FROM rentals
    JOIN customers
    ON rentals."customerId"=customers.id
    JOIN games
    ON rentals."gameId"=games.id;`
    );

    const listaLimpa = rentals.rows.map((json) => json.json_build_object);

    res.send(listaLimpa);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

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
