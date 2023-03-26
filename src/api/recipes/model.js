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
    picture: { type: String, required: true },
    requirements: { type: String, required: true },
    specialRequirements: { type: String },
    ingredients: [String], // (require:true) ?
    nutritionData: { type: Object },
    cookingTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    steps: {
      step1: { type: String, required: true },
      step2: { type: String },
      step3: { type: String },
      step4: { type: String },
      step5: { type: String },
      step6: { type: String },
      step7: { type: String },
      step8: { type: String },
      step9: { type: String },
      step10: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export default model("Recipe", recipesSchema);
