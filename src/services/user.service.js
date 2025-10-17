import { User } from "../models/user.model.js";

export const createUserService = async (userData) => {
  const user = await User.create(userData);
  return user;
};

export const getAllUsersService = async () => {
  const users = await User.findAll();
  return users;
};
