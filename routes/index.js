import { Router } from "express";
import userRoutes from "./user_routes.js";
import docRoutes from "./doc_routes.js";

const appRouter = Router();

appRouter.use("/user", userRoutes); //domain/api/v1/user
appRouter.use("/doc", docRoutes); //domain/api/v1/doc

export default appRouter;
