import express from "express";
import mongodb, { MongoClient } from "mongodb";
import cors from "cors";
import employeeRouter from "./routers/employee_router.js";
import attendenceRouter from "./routers/atendentence_date.js";
import { comparePassword, gentratePassword } from "./assets/hashing_pass.js";
import * as dotenv from 'dotenv';
dotenv.config()

let app = express();
let port = process.env.PORT
app.use(cors())
app.use(express.json())
let client = new MongoClient(process.env.URL)
await client.connect;
app.get("/:name", async (req, res) => {
    let data = await client.db(req.params.name).collection("employee").find().toArray();
    if (data) {
        res.status(200).send(data)
    } else {
        res.status(404).send({ error: "Something Wrong" })

    }
})

// attendence api calls.
app.post("/attendence", async (req, res) => {
    try {
        let result = await client.db("").collection(req.body.year).insertOne(req.body);
        res.status(200).send(result)
    } catch (err) {
        res.status(404).send({ msg: "Something Wrong" })
    }
})
app.put("/attendence/month/list", async (req, res) => {
    let data = await client.db("").collection(req.body.year).find({ month: req.body.month }).toArray();
    try {
        res.status(200).send(data)
    } catch (err) {
        res.status(404).send({ msg: "Something Wrong" })

    }
})
app.post("/user/signup", async (req, res) => {
    let data = req.body;
    let user = await client.db("employeeusers").collection("users").findOne({ name: data.name })
    if (!user) {
        data.password = await gentratePassword(data.password);
        let result = await client.db("employeeusers").collection("users").insertOne(data);
        res.status(200).send({ msg: "SuccessFully Signup " })
    } else {
        res.status(404).send({ msg: "Username is used " })

    }


})
app.post("/user/login", async (req, res) => {
    let data = await client.db("employeeusers").collection("users").findOne({ "name": req.body.name });
    if (!data) {
        res.status(404).send({ msg: "Invalid Credential" })
    } else {
        let result = await comparePassword(req.body.password, data.password);
        if (result) {
            res.status(200).send({ msg: "Successfully loggedin" })
        } else {
            res.status(404).send({ msg: "Invalid cridential" })

        }
    }
})
app.use("/employee", employeeRouter)
app.use("/attendence/public", attendenceRouter)
app.listen(port, () => {
    console.log("Server is running on" + port + "port");
})
export { client }

