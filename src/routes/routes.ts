import { Router } from "express";
const route = Router();

/*
   Import All Routes
*/

import { AuthRoute } from "../api/v1/Auth/Auth.routes";

route.use("/api/v1", AuthRoute);

export { route };
