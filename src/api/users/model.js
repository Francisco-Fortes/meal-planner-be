import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.shareicon.net%2Fdata%2F512x512%2F2017%2F02%2F15%2F878685_user_512x512.png&tbnid=zRnYyCMWIvcVMM&vet=12ahUKEwid7OeO3fT9AhWVvyoKHdkWDMMQMygPegUIARDjAQ..i&imgrefurl=https%3A%2F%2Fwww.shareicon.net%2Fuser-male-profile-human-avatar-878685&docid=9kB7aBotiKweqM&w=512&h=512&q=image%20profile%20unisex&ved=2ahUKEwid7OeO3fT9AhWVvyoKHdkWDMMQMygPegUIARDjAQ",
    },
    about: { type: String },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    planner: [{ type: mongoose.Schema.Types.ObjectId, ref: "Planner" }],
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  {
    timestamps: true,
  }
);

usersSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 2);
    currentUser.password = hash;
  }
  next();
});

usersSchema.methods.toJSON = function () {
  const userDoc = this;
  const user = userDoc.toObject();

  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

usersSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model("User", usersSchema);
