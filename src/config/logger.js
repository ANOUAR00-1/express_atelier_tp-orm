import winston from "winston";

const logger = winston.createLogger({
 level: "info", 
 format: winston.format.combine(
  winston.format.timestamp(),
  winston.format.json() 
 ),
 transports: [
 
  new winston.transports.File({ filename: 'logs.txt' }),
  new winston.transports.File({ filename: 'errors.log', level: 'error' })
 ],
});

export default logger;