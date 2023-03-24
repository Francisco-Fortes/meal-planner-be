import express from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../users/utils/jwtAuth.js";
import { instance } from "../users/utils/tools.js";
import RecipesModel from "./model.js";
import cloudinaryUploader from "./utils/images/imageUploader.js";

const recipesRouter = express.Router();

recipesRouter.post("/", async (req, res, next) => {
  try {
    const newRecipe = await RecipesModel(req.body);
    newRecipe.save();
    console.log(newRecipe._id);
    res.send(newRecipe._id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

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
        createHttpError(404, `Recipe with ID ${req.params.recipeId} not found`)
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

recipesRouter.post(
  "/:recipeId/picture",
  JWTAuthMiddleware,
  cloudinaryUploader.single("picture"),
  async (req, res, next) => {
    try {
      if (req.user) {
        const recipe = await RecipesModel.findByIdAndUpdate(
          req.recipe._id,
          { picture: req.file.path },
          { new: true }
        );
        res.status(201).send(recipe);
      } else {
        next(createError(404, `You need to log in order to post a recipe`));
      }
      if (!recipe)
        next(createError(404, `Recipe with ID ${req.recipe._id} not found`));
    } catch (error) {
      res.send(error);
      next(error);
    }
  }
);

recipesRouter.post(
  "/:recipeId/nutritionData",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const recipe = await RecipesModel.findById(req.params.recipeId);
      //Implement code to preventing call the API is there is data already there
      // if (!recipe.nutritionalData) {
      //   next(createError(404, `Recipe with ID ${req.recipe._id} not found`));
      // }
      if (!recipe) {
        next(createError(404, `Recipe with ID ${req.recipe._id} not found`));
      }
      //       const ingredients = recipe.ingredients;
      //       const url = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`;
      //       const response = await fetch(url, {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //         body: JSON.stringify({ ingr: ingredients }),
      //       });
      //       const data = await response.json();
      //       console.log(data);
      //       res.send(data);
      //     } catch (error) {
      //       next(error);
      //     }
      //   }
      // );

      //WIP: Axios giving an error message
      //AxiosError: connect ECONNREFUSED ::1:80
      const ingredients = recipe.ingredients;
      console.log(ingredients);
      const response = await instance.post(
        //Axios instance created on tools.js
        process.env.EDAMAN_API,
        ingredients,
        {
          params: {
            app_id: process.env.EDAMAM_APP_ID,
            app_key: process.env.EDAMAM_APP_KEY,
          },
        }
      );
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
);

export default recipesRouter;
//Data from the FE
// const saveRecipeToDatabase = async (recipeData) => {
//   try {
//     const newRecipe = await RecipesModel(recipeData);
//     console.log(recipeData);
//     await newRecipe.save();
//     return newRecipe._id;
//   } catch (error) {
//     console.log(error);
//     throw createHttpError(500, "Could not save recipe");
//   }
// };

// recipesRouter.post("/", async (req, res, next) => {
//   try {
//     const newRecipe = await saveRecipeToDatabase(req.body);
//     console.log(newRecipe._id);
//     res.send(newRecipe._id);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });
