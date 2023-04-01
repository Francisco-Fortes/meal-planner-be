import mongoose from "mongoose";

const { Schema, model } = mongoose;

const plannersSchema = new Schema(
  {
    title: { type: String, required: true, default: "WEEK 1" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Monday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Tuesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Wednesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Thursday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Friday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Saturday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    Sunday: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  {
    timestamps: true,
  }
);

plannersSchema.methods.addToDay = function (day, recipeId) {
  const dayArray = this[day];
  if (dayArray.length < 5) {
    dayArray.push(recipeId);
  } else {
    throw new Error(
      `Sorry, at the moment the maximum number of recipes you can add per day is ${dayArray.length}`
    );
  }
};

export default model("Planner", plannersSchema);
