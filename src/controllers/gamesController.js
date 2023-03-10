import { db } from "../config/database.connection.js";

export const getGames = async (req, res) => {
  const { name } = req.query;

  try {
    let games = await db.query(`SELECT * FROM games;`);

    if (name != undefined) {
      games = await db.query(`SELECT * FROM games WHERE LOWER(name) LIKE LOWER('${name}%');`);
    }

    res.send(games.rows);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const postGames = async (req, res) => {
  const { name, image, stockTotal, pricePerDay } = req.body;
  try {
    await db.query(
      'INSERT INTO games(name,image,"stockTotal","pricePerDay") VALUES ($1,$2,$3,$4);',
      [name, image, stockTotal, pricePerDay]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
