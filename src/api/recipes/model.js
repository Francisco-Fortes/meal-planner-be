import mongoose from "mongoose";

const { Schema, model } = mongoose;

const recipesSchema = new Schema(
  {
    title: { type: String, required: true },
    user: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    picture: { type: String, required: true },
    requirements: { type: String, required: true },
    specialRequirements: { type: String },
    ingredients: [String], // (require:true) ?

    cookingTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    steps: {
      step1: { type: String, required: true },
      // step2: { type: String, required: true },
      // step3: { type: String, required: true },
      // step4: { type: String, required: true },
      // step5: { type: String, required: true },
      // step6: { type: String, required: true },
      // step7: { type: String, required: true },
      // step8: { type: String, required: true },
      // step9: { type: String, required: true },
      // step10: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export default model("Recipe", recipesSchema);
