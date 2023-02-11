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

export const verifyReturnRentals = async (req, res, next) => {
  const { id } = req.params;
  if (!id || id <= 0) {
    return res.sendStatus(404);
  }

  try {
    const existRental = await db.query("SELECT * FROM rentals WHERE id=$1", [id]);

    if (existRental.rowCount <= 0) {
      return res.status(404).send("Aluguel não existe!");
    }
    if (existRental.rows[0].returnDate != null) {
      return res.status(400).send("Este aluguel ja foi entregue!");
    }

    res.locals.existRental = existRental.rows[0];

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const verifyDeleteRental = async (req, res, next) => {
  const { id } = req.params;

  try {
    const rental = await db.query("SELECT * FROM rentals WHERE id=$1;", [id]);

    if (rental.rowCount <= 0) {
      return res.status(404).send("Aluguel não existe!");
    }

    if (rental.rows[0].returnDate == null) {
      return res.status(400).send("Não pode excluir um aluguel sem ter devolvido o game!");
    }

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
