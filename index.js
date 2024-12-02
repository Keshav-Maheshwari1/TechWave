import express from "express";
import './loadEnvironment.js'
import moneyRequestRouter from "./routes/moneyRequestRouter.js"
import consumerRouter from "./routes/consumerRouter.js"
import phedRouter from "./routes/phedRouter.js"
import panchayatRouter from "./routes/panchayatRouter.js"

const app = express();

app.use(express.json());

app.use("/api/request",moneyRequestRouter)
app.use("/api/consumer",consumerRouter);
app.use("/api/gp",panchayatRouter);
app.use("/api/phed",phedRouter)


const port = process.env.PORT || 3001;

app.listen("/",()=>{
    console.log(`Server running on port ${port}`);
})
