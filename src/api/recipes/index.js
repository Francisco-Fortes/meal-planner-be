import express from "express";
import createHttpError from "http-errors";
import RecipessModel from "./model.js";

const recipesRouter = express.Router();

recipesRouter.post("/", async (req, res, next) => {
  try {
    const recipes = await RecipesModel.find();
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

recipesRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

recipesRouter.get("/:recipeId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

recipesRouter.put("/:recipeId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

recipesRouter.delete("/:recipeId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default recipesRouter;
