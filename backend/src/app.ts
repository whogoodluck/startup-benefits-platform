import cors from "cors";
import express from "express";
import morgan from "morgan";

import unknownEndpoint from "./middlewares/unknown-endpoint";
import router from "./routes";

const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use("/api", router);

app.use(unknownEndpoint);

export default app;
