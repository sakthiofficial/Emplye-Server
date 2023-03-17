import express from "express";
import { client } from "../index.js";
import mongodb, { MongoClient, ObjectId } from "mongodb";


let employeeRouter = express.Router()
employeeRouter.post("/add/:name", async (req, res) => {
    let test = await client.db(req.params.name).collection("employee").findOne({ name: req.body.name });


    await client.db(req.params.name).collection("employee").insertOne(req.body)
    res.status(200).send({ msg: "SuccessFully Employee Added" })

})
employeeRouter.put("/edit/:name", async (req, res) => {
    console.log(req.url);

    let data = await client.db(req.params.name).collection("employee").updateOne({ _id: new ObjectId(req.body.id) }, { "$set": req.body })
    res.status(200).send(data);
})
employeeRouter.delete("/delete/:id/:name", async (req, res) => {
    console.log(req.params.id);
    let result = await client.db(req.params.name).collection("employee").deleteOne({ _id: new ObjectId(req.params.id) })
    if (result.deletedCount == 1) {
        res.status(200).send({ msg: "Succesfully Deleted" })
    } else {
        res.status(200).send({ msg: "Something Wrong" })

    }
    console.log(result);

});
export default employeeRouter