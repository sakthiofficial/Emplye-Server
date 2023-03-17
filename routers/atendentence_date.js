import express from "express";
import { client } from "../index.js";
import mongodb, { MongoClient, ObjectId } from "mongodb";


let attendenceRouter = express.Router()
attendenceRouter.post("/:name", async (req, res) => {
    let data = req.body;
    if (data.length == 0) {
        res.status(404).send({ msg: "Sorry there is no data" });
    }

    await data.map(async (val) => {
        res.setHeader("Content-Type", "text/html");
        updateEmployee(req.params.name, val.name, { date: val.date, month: val.month, year: val.year, attendence: val.attendence, place: val.place, work: val.work })

    })
    res.status(200).send({ msg: "Succecfully added all the employee attendence" })

})
async function updateEmployee(db, name, data) {
    let result = await client.db(db).collection(name).findOne({ date: data.date })
    try {
        if (result) {
            await client.db(db).collection(name).updateOne({ date: data.date }, { "$set": data })
        } else {
            await client.db(db).collection(name).insertOne(data)
        }

    } catch (err) {
        console.log("error comming" + err);
    }
}
attendenceRouter.put("/month/list/:name", async (req, res) => {
    try {
        let data = await client.db(req.params.name).collection(req.body.name).find({ month: req.body.month, year: req.body.year }).toArray();
        if (!data) {
            res.status(404).send({ msg: "Sorry there is no data" });

        } else {
            res.status(200).send(data)
        }
    } catch (err) {
        res.send("Something Invalid")
    }
})
attendenceRouter.put("/edit/:name", async (req, res) => {
    try {
        let result = await client.db(req.params.name).collection(req.body.name).updateOne({ month: req.body.month, year: req.body.year }, { "$set": req.body.edit })
    } catch (err) {
        res.status(404).send({ msg: "Please Give a valid data" });

    }
    if (result.modifiedCount > 0) {
        res.status(200).send(result)
    } else {
        res.status(404).send({ msg: "Please Give a valid data" });


    }

})
export default attendenceRouter
