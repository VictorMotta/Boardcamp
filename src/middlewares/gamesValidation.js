import { db } from "../config/database.connection.js";

export const validationExist = async (req, res, next) => {
  const { name } = req.body;
  try {
    const exist = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);

    if (exist.rowCount === 1) {
      return res.status(409).send("Não pode ser um nome de jogo já existente!");
    }

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
