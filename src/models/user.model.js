import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const varOcg = "UserModel"; // __define-ocg__

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [2, 50] },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
});
