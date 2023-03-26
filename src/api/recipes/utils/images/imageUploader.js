import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "FoodAppImages",
    },
  }),
});

export default cloudinaryUploader;

// recipesRouter.put(
//   "/:recipeId/image",
//   multerUploader.single("image"),
//   async (req, res, next) => {
//     try {
//       const recipeToUpdate = await RecipesModel.findById(req.params.recipeId);
//       if (!recipeToUpdate) {
//         throw createHttpError(
//           404,
//           `Recipe with id ${req.params.recipeId} not found!`
//         );
//       }
//       // update the recipe's image URL in the database
//       recipeToUpdate.imageUrl = req.file.path;
//       await recipeToUpdate.save();

//       res.send("Recipe image updated successfully!");
//     } catch (error) {
//       next(error);
//     }
//   }
// );
