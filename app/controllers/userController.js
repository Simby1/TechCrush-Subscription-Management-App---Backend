import User from "../models/userModel.js";

export const createUser  = async (userData) => {
  const { username, email, password, firstName, lastName } = userData;
  const user = new User({ username, email, password, firstName, lastName });
  const result = await user.save();
  console.log("User created:", result);
};

export const getUsers = async () => {
  const users = await User.find();
  console.log("Users fetch:", users);
  return users;
};

export const findUser = async (username) => {
  const result = await User.findOne({ username });
  console.log("User found:", result);
  return result;
};

export const updateUser  = async (username, updates) => {
  const result = await User.updateOne(
    { username },
    { $set: updates }
  );
  console.log("User  updated:", result);
};

export const deleteUser = async (username) => {
  const result = await User.deleteOne({ username });
  console.log("User deleted:", result);
};
