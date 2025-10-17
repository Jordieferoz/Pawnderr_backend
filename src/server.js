import app from "./app.js";
import { config } from "./config/index.js";
import { connectDB, sequelize } from "./config/database.js";
import { User } from "./models/user.model.js";

const startServer = async () => {
  await connectDB();

  // Sync models to DB (force: true drops & recreates tables)
  await sequelize.sync({ alter: true });

  app.listen(config.port, () =>
    console.log(`🚀 Server running on port ${config.port} (${config.env})`)
  );
};

startServer();
