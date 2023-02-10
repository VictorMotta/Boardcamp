import { db } from "../config/database.connection.js";

export const getClients = async (req, res) => {
  try {
    const clientes = await db.query("SELECT * FROM customers");

    res.send(clientes.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getClientId = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await db.query("SELECT * FROM customers WHERE id = $1", [id]);

    if (cliente.rowCount === 0) {
      return res.status(404).send("Usuário não encontrado!");
    }

    res.send(cliente.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const postClient = async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;
  try {
    await db.query("INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)", [
      name,
      phone,
      cpf,
      birthday,
    ]);

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const putClient = async (req, res) => {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    await db.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5;", [
      name,
      phone,
      cpf,
      birthday,
      id,
    ]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
