import mongoose from "mongoose";

const { Schema, model } = mongoose;

const recipesSchema = new Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    servings: { type: Number, required: true },
    shared: { type: Boolean, required: true, default: false },
    picture: { type: String, required: true },
    ingredients: { type: [String], required: true },
    nutritionData: { type: Object },
    cookingTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    steps: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Recipe", recipesSchema);
