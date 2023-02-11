import { db } from "../config/database.connection.js";

export const verifyInsertRentals = async (req, res, next) => {
  const { customerId, gameId } = req.body;

  try {
    const verifyCostumerId = await db.query("SELECT * FROM customers WHERE id = $1;", [customerId]);
    const verifyGameId = await db.query("SELECT * FROM games WHERE id = $1;", [gameId]);

    if (verifyCostumerId.rowCount <= 0 || verifyGameId.rowCount <= 0) {
      return res.sendStatus(400);
    }

    res.locals.pricePerDay = verifyGameId.rows[0].pricePerDay;
    res.locals.qtdStock = verifyGameId.rows[0].stockTotal;

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const verifyStockGames = async (req, res, next) => {
  const { gameId } = req.body;
  const stockTotal = res.locals.qtdStock;
  console.log(stockTotal);
  try {
    const qtdStock = await db.query(
      `
    SELECT * FROM rentals
    JOIN games
    ON rentals."gameId"=games.id
    WHERE games.id=$1 AND rentals."returnDate" ISNULL;`,
      [gameId]
    );

    const stockRemaining = Number(stockTotal) - Number(qtdStock.rowCount);

    console.log(stockRemaining);

    if (stockRemaining <= 0) {
      return res.status(400).send("Não há jogos suficiente em estoque!");
    }

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};