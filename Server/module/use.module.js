import { model, Schema } from "mongoose";

import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
const UserSchema = new Schema(
  {
    fullName: {
      type: "string",
      required: [true, "name is required"],
      minLength: [5, "name must be 5 char"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: "string",
      required: [true, "name is required"],
      unique: [true, "email is registered"],
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill in a valid email address",
      ],
    },
    password: {
      type: "string",
      required: [true, "name is required"],
      minLength: [8, "password must be 8 char"],
      select: false,

      trim: true,
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "AUTHOR "],
      default: "USER",
    },
    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods = {
  comparePassword: async function (PlainPassword) {
    return await bcrypt.compare(PlainPassword, this.password);
  },
  generateJWTToken: async function () {
    return await JWT.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  generatePasswordResetToken: async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },
};

const User = model("User", UserSchema);
export default User;
