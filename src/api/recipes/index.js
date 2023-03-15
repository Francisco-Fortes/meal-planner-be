import express from "express";
import createHttpError from "http-errors";
import RecipesModel from "./model.js";

const recipesRouter = express.Router();

//Data from the FE
const saveRecipeToDatabase = async (recipeData) => {
  try {
    const newRecipe = await RecipesModel(recipeData);
    console.log(recipeData);
    return newRecipe.save();
  } catch (error) {
    console.log(error);
    throw createHttpError(500, "Could not save recipe");
  }
};

recipesRouter.post("/", async (req, res, next) => {
  try {
    const newRecipe = await saveRecipeToDatabase(req.body);
    console.log(newRecipe._id);
    res.send(newRecipe._id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// recipesRouter.post("/", async (req, res, next) => {
//   try {
//     const newRecipe = await RecipesModel(req.body);
//     newRecipe.save();
//     console.log(newRecipe._id);
//     res.send(newRecipe._id);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

//GET ALL RECIPES
recipesRouter.get("/", async (req, res, next) => {
  try {
    const allRecipes = await RecipesModel.find();
    res.send(allRecipes);
  } catch (error) {
    next(error);
  }
});

recipesRouter.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await RecipesModel.findById(req.params.recipeId);
    if (recipe) {
      res.send(recipe);
    } else {
      next(
        createHttpError(404, `Recipe with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

recipesRouter.put("/:recipeId", async (req, res, next) => {
  try {
    const recipeToModify = await RecipesModel.findByIdAndUpdate(
      req.params.recipeId,
      req.body,
      { new: true }
    );
    if (recipeToModify) {
      res.send(recipeToModify);
    } else {
      next(
        createHttpError(404, `Recipe with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

recipesRouter.delete("/:recipeId", async (req, res, next) => {
  try {
    const recipeToDelete = await RecipesModel.findByIdAndDelete(
      req.params.recipeId
    );
    if (recipeToDelete) {
      res.send("Recipe succesfully deleted");
    } else {
      next(
        createHttpError(404, `Recipe with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default recipesRouter;
