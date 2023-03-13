import express from "express";
import { auth } from "./auth/auth.js.js";
import { client } from "./index.js.js";

let mobileRouter = express.Router()

mobileRouter.get("/", auth, async (req, res) => {
    let data = await client.db("movie").collection("mobiles").find().toArray();
    res.send(data);
    console.log(data[0]._id);
})
mobileRouter.put("/:id", async (req, res) => {
    let { id } = req.params
    let result = await client.db(movie).collection("mobiles").findOne({ "_id": ` new ObjectId(${id})` })
    res.send(result)
})

export default mobileRouter;