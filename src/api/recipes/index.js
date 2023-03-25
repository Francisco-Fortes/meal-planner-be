import express from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../users/utils/jwtAuth.js";
import { instance } from "../users/utils/tools.js";
import RecipesModel from "./model.js";
import cloudinaryUploader from "./utils/images/imageUploader.js";

const recipesRouter = express.Router();

//This should be an Mod/Admin endpoint
recipesRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newRecipe = await RecipesModel({
      ...req.body,
      user: req.user._id,
    });
    const recipeToAdd = await UsersModel(
      ...user,
      recipe: recipeToAdd._id
    )
    await newRecipe.save();
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
      console.log(recipe.ingredients);
      if (!recipe) {
        next(createError(404, `Recipe with ID ${req.recipe._id} not found`));
      }
      if (recipe.nutritionData.calories) {
        res
          .status(200)
          .send(
            `Recipe with ID:${recipe._id} contains the nutrition data already`
          );
      } else {
        const url = `https://api.edamam.com/api/nutrition-data?app_id=${
          process.env.EDAMAM_APP_ID
        }&app_key=${process.env.EDAMAM_APP_KEY}&ingr=${encodeURIComponent(
          recipe.ingredients.join("\n")
        )}`;
        console.log(`I am after calling the API`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const nutritionData = await response.json();
        recipe.nutritionData = nutritionData;
        await recipe.save();
        res.status(201).send(recipe.nutritionData);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default recipesRouter;

// recipesRouter.post(
//   "/:recipeId/nutritionData",
//   JWTAuthMiddleware,
//   async (req, res, next) => {
//     try {
//       const recipe = await RecipesModel.findById(req.params.recipeId);
//       console.log(recipe.ingredients);
//       if (!recipe) {
//         next(createError(404, `Recipe with ID ${req.recipe._id} not found`));
//       }
//       const url = `https://api.edamam.com/api/nutrition-data?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`;
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: { ingr: recipe.ingredients },
//       });
//       res.status(201).send(recipe.nutritionData);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

//WIP: Axios giving an error message
//AxiosError: connect ECONNREFUSED ::1:80
//       const ingredients = recipe.ingredients;
//       console.log(ingredients);
//       const response = await instance.post(
//         //Axios instance created on tools.js
//         process.env.EDAMAN_API,
//         ingredients,
//         {
//           params: {
//             app_id: process.env.EDAMAM_APP_ID,
//             app_key: process.env.EDAMAM_APP_KEY,
//           },
//         }
//       );
//       res.send(response);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

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
