import app from "./src/app.js"
import { AppDataSource } from "./src/config/data-source.js"
import dotenv from "dotenv"
import logger from "./src/config/logger.js";

dotenv.config()

AppDataSource.initialize()
   .then(() => {
      logger.info("Database connected successfully");
      app.listen(process.env.PORT, () => {
         logger.info(`Server Running on port ${process.env.PORT}`)
      })
   })
   .catch((error) => {
      logger.error(`Error connecting to database: ${error}`);
   })