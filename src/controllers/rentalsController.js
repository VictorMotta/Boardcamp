import { db } from "../config/database.connection.js";
import dayjs from "dayjs";

export const getRentals = async (req, res) => {
  const { status, startDate } = req.query;
  console.log(status);
  console.log(startDate);

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

    let listaLimpa = rentals.rows.map((json) => json.json_build_object);

    if (status != undefined) {
      if (status == "open") {
        const newList = listaLimpa.filter((rental) => rental.returnDate === null);
        listaLimpa = newList;
      }
      if (status == "closed") {
        const newList = listaLimpa.filter((rental) => rental.returnDate != null);
        listaLimpa = newList;
      }
    }

    if (startDate != undefined) {
      const newList = listaLimpa.filter((rental) => rental.rentDate >= startDate);
      listaLimpa = newList;
    }

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

export const returnRentals = async (req, res) => {
  const { id } = req.params;
  const rental = res.locals.existRental;
  const currentDate = dayjs(new Date());
  const daysRented = rental.daysRented;
  const rentDate = dayjs(rental.rentDate);
  let amountPay = 0;

  try {
    const game = await db.query(`SELECT * FROM games WHERE id=$1`, [rental.gameId]);
    const pricePerDay = game.rows[0].pricePerDay;

    if (rentDate.$M === currentDate.$M) {
      let daysToPay = currentDate.$D - rentDate.$D - daysRented;
      let totalPayToFine = daysToPay * pricePerDay;
      amountPay = totalPayToFine;
    }

    if (rentDate.$M < currentDate.$M) {
      let lastMonth = currentDate.$M - rentDate.$M;
      let daysRemain = currentDate.$D - rentDate.$D;
      let totalDays = lastMonth * 30 + daysRemain;
      amountPay = totalDays * pricePerDay;
    }

    if (amountPay <= 0) {
      await db.query(`UPDATE rentals SET "returnDate"=$1,"delayFee"='0' WHERE id=$2;`, [
        currentDate,
        id,
      ]);
      return res.sendStatus(200);
    } else {
      await db.query(`UPDATE rentals SET "returnDate"=$1,"delayFee"=$2 WHERE id=$3;`, [
        currentDate,
        amountPay,
        id,
      ]);
      return res.sendStatus(200);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteRental = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM rentals WHERE id=$1;`, [id]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
