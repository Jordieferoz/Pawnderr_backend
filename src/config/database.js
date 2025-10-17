import { Sequelize } from "sequelize";
import { config } from "./index.js";

// __define-ocg__ - Initialize Sequelize instance
export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: "postgres",
    logging: false,
  }
);

// Utility function to connect DB
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
