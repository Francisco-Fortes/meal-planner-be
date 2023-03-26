import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import { JWTAuthMiddleware } from "../users/utils/jwtAuth.js";
import { createAccessToken } from "../users/utils/tools.js";
import cloudinaryUploader from "../recipes/utils/images/imageUploader.js";
const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndUpdate(JWTAuthMiddleware.payload.user);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

usersRouter.post(
  "/me/avatar",
  JWTAuthMiddleware,
  cloudinaryUploader.single("avatar"),
  async (req, res, next) => {
    try {
      const user = await UsersModel.findByIdAndUpdate(
        req.user._id,
        { avatar: req.file.path },
        { new: true }
      );
      if (!user)
        next(createError(404, `User with ID ${req.user._id} not found`));
      res.status(201).send(user);
    } catch (error) {
      res.send(error);
      next(error);
    }
  }
);

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Wrong credentials"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/me/logout", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accessToken = createAccessToken({ _id: req.user._id });
    await UsersModel.findByIdAndUpdate(
      req.user._id,
      { accessToken: null },
      { new: true }
    );
    console.log(accessToken);
    console.log(`User with ID ${req.user._id} successfully logged out`);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// usersRouter.delete("/logout", JWTAuthMiddleware, async (req, res, next) => {
//   try {
//     const user = await UsersModel.findByIdAndUpdate(
//       req.user._id,
//       { accessToken: null },
//       { new: true }
//     );
//     if (!user) {
//       return next(createError(404, `User with the id ${req.user._id} not found`));
//     }
//     console.log(`User with ID ${req.user._id} successfully logged out`);
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });

//GET
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with ID ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

//POST
usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
    console.log(newUser.email);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//PUT
usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with ID ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

//DELETE
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with ID ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
