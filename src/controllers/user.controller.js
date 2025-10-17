import { createUserService, getAllUsersService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json(new ApiResponse(true, "User created", user));
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(new ApiResponse(true, "Users fetched", users));
  } catch (error) {
    next(error);
  }
};
