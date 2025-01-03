import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
    },
    email: {
      type: String,
      required: [true, "Please enter an email."],
      unique: [true, "Email is already in use."],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    photo: String,
    role: {
      type: String,
      enum: ["user", "admin", "superuser"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must be stronger: at least 8 characters, 1 uppercase letter, 1 number, and 1 symbol",
      },
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (value) {
          return value == this.password;
        },
        message: "Password & Confirm Password does not match!",
      },
    },
    isAccountActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,
  },

  { timestamps: true }
);

// Pre-save mongoose middleware that handles encrypting the user's password and removing the confirmPassword field
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Encrypt the password before saving it
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  // No need to store confirmPassword in the DB
  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isAccountActive: { $ne: false } });
  next();
});

// Custom instance method to compare user password during login activity
userSchema.methods.comparePasswordInDB = async function (pswd, pswdDB) {
  return await bcrypt.compare(pswd, pswdDB);
};

// Custom instance method that checks whether a user's password has been changed after a JWT was issued
userSchema.methods.isPasswordChanged = async function (JWT_Timestamp) {
  if (this.passwordChangedAt) {
    const pswdChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWT_Timestamp < pswdChangedTimestamp;
  }
  return false;
};

// Custom instance method to create a reset password token for a user
userSchema.methods.createResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Store a hashed version of the token in the DB
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(resetToken, this.resetPasswordToken);
  // Return the plain reset token for the user to use
  return resetToken;
};

userSchema.methods.sanitize = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordTokenExpires;
  return userObject;
};

// Create and export the user model
const User = mongoose.model("User", userSchema);

export default User;
