import { db } from "../config/database.connection.js";

export const existClient = async (req, res, next) => {
  const { cpf } = req.body;

  try {
    const existClientBollean = await db.query("SELECT * FROM customers WHERE cpf = $1;", [cpf]);

    if (existClientBollean.rowCount > 0) {
      return res.status(409).send("Usuário com este cpf já existe!");
    }

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const existCpfUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { cpf } = req.body;

  try {
    const existClientId = await db.query("SELECT * FROM customers WHERE id = $1;", [id]);

    if (existClientId.rowCount == 0) {
      return res.sendStatus(404);
    }

    const existClientCpf = await db.query("SELECT * FROM customers WHERE cpf = $1;", [cpf]);

    if (existClientCpf.rowCount > 0) {
      if (existClientId.rows[0].cpf === cpf) {
        return next();
      }
      return res.status(409).send("Este usuário já está cadastrado!");
    }

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
