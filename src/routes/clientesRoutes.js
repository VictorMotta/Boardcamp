import { Router } from "express";
import {
  getClients,
  getClientId,
  postClient,
  putClient,
} from "../controllers/clientsController.js";
import validateSchema from "../middlewares/schemaValidation.js";
import { clientSchema } from "../schemas/clientsSchemas.js";
import { existClient, existCpfUpdate } from "../middlewares/clientsValidation.js";

const ClientesRouter = Router();

ClientesRouter.get("/customers", getClients);
ClientesRouter.get("/customers/:id", getClientId);
ClientesRouter.post("/customers", validateSchema(clientSchema), existClient, postClient);
ClientesRouter.put("/customers/:id", validateSchema(clientSchema), existCpfUpdate, putClient);

export default ClientesRouter;
