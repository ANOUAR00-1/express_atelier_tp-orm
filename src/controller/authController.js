import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export const register = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository(User);
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = repo.create({ username, email, password: hashedPassword });

  await repo.save(user);
  logger.info(`User registered: ${username}`);
  res.status(201).json({ message: "User created" });
 } catch (error) {
  logger.error(`Register error: ${error.message}`);
  res.status(500).json({ error: error.message });
 }
};

export const login = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOneBy({ email: req.body.email });

  if (user && await bcrypt.compare(req.body.password, user.password)) {
   const secretString = process.env.JWT_SECRET;
   if (!secretString) {
    throw new Error("Secret key is missing. Please restart the server or check the .env file.");
   }
   const token = jwt.sign({ id: user.id }, secretString, { expiresIn: '1h' });
   logger.info(`User logged in: ${user.username}`);
   return res.json({ token });
  }

  logger.warn(`Failed login attempt for: ${req.body.email}`);
  res.status(401).json({ message: "Invalid credentials" });
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};