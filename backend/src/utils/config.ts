import { config } from "dotenv";

config();

const NODE_ENV = process.env.NODE_ENV;

const PORT = process.env.PORT || 3001;

export default {
  NODE_ENV,
  PORT,
};
