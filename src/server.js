import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import recipesRouter from "./api/recipes/index.js";
import {
  badRequestHandler,
  unauthorizedErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import createHttpError from "http-errors";
import usersRouter from "./api/users/index.js";
import plannersRouter from "./api/planners/index.js";

const server = express();
const port = process.env.PORT || 3001;
const whitelist = [process.env.FE_PROD_URL, process.env.FE_DEV_URL];
const corsOptions = {
  origin: (origin, corsNext) => {
    if (whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(createHttpError(400, `${origin} is not in the whitelist`));
    }
  },
};
//MIDDLEWARES
server.use(cors(corsOptions));
server.use(express.json());

//ENDPOINTSS
server.use("/recipes", recipesRouter);
server.use("/users", usersRouter);
server.use("/planners", plannersRouter);

//ERROR HANDLERS
server.use(badRequestHandler);
server.use(unauthorizedErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
