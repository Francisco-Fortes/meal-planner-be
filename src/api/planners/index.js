import express from "express";
import { JWTAuthMiddleware } from "../users/utils/jwtAuth.js";
import PlannersModel from "./model.js";
import RecipesModel from "../recipes/model.js";

const plannersRouter = express.Router();

plannersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const planners = await PlannersModel.find({
      author: req.user._id,
    });
    if (!planners) {
      return res.status(404).json({ message: "User has not created any plan" });
    }
    res.status(200).json(planners);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// plannersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
//   try {
//     const planners = await PlannersModel.find({ author: req.user._id });
//     if (!planners) {
//       return res.status(404).json({ message: "User has not created any plan" });
//     }
//     res.status(200).json(planners);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

//WORKING ON POSTMAN
// plannersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
//   try {
//     const planners = await PlannersModel.find();
//     if (!planners) {
//       return res.status(404).json({ message: "User has not created any plan" });
//     }
//     if (planners[0].author.toString() !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "You are not authorized to access this planner" });
//     }

//     res.status(200).json(planners);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

plannersRouter.get("/:plannerId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const planner = await PlannersModel.findById(req.params.plannerId).populate(
      {
        path: "Monday Tuesday Wednesday Thursday Friday Saturday Sunday",
        select: "",
      }
    );
    //Same as:
    //   [
    //     { path: "Monday", select: "" },
    //     { path: "Tuesday", select: "" },
    //     { path: "Wednesday", select: "" },
    //     { path: "Thursday", select: "" },
    //     { path: "Friday", select: "" },
    //     { path: "Saturday", select: "" },
    //     { path: "Sunday", select: "" },
    //   ]
    // );

    if (!planner) {
      return res.status(404).json({ message: "Planner not found" });
    }

    if (planner.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this planner" });
    }

    res.status(200).send(planner);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

plannersRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newPlanner = new PlannersModel({
      title: req.body.title,
      author: req.user._id,
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    });

    await newPlanner.save();

    res.status(201).json(newPlanner);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

plannersRouter.post(
  "/:plannerId/:day/:recipeId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const planner = await PlannersModel.findById(req.params.plannerId);
      if (!planner) {
        return res.status(404).json({ message: "Planner not found" });
      }

      const recipe = await RecipesModel.findById(req.params.recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      planner.addToDay(req.params.day, recipe._id);
      await planner.save();

      res.status(200).json({ message: "Recipe added to planner successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default plannersRouter;
