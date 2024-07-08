// src/index.js
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
var cors = require('cors')
import bodyParser from "body-parser";
import dutyRouter from "./routes/duty.route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors({origin: '*'}));


app.get("/", (req: Request, res: Response) => {
  res.send("Server Started");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use("/duties", dutyRouter);


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send('Internal Server Error!');
});

export default app;