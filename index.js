import express from "express";
import mongodb, { MongoClient } from "mongodb";
import cors from "cors";

let app = express()
app.use(cors())
app.use(express.json())
let client = new MongoClient("mongodb://127.0.0.1")
await client.connect;
app.get("/", async (req, res) => {
    let data = await client.db("sakthi").collection("employee").find().toArray();
    if (data) {
        res.status(200).send(data)
    } else {
        res.status(404).send({ error: "Something Wrong" })

    }
})

app.post("/employee/add", async (req, res) => {
    let test = await client.db("sakthi").collection("employee").findOne({ name: req.body.name });

    if (test) {
        res.status(404).send({ error: "Already there is a employee with that name" })
    } else {
        await client.db("sakthi").collection("employee").insertOne(req.body)
        res.status(200).send({ msg: "SuccessFully Employee Added" })
    }
})
app.put("/employee/edit", async (req, res) => {
    let data = await client.db("sakthi").collection("employee").updateOne({ name: req.body.name }, { "$set": req.body })
    console.log(data);
    res.status(200).send(data);
})
app.delete("/employee/delete", async (req, res) => {
    console.log(req.body);

    let result = await client.db("sakthi").collection("employee").deleteOne({ name: req.body.name })
    if (result.deletedCount == 1) {
        res.status(200).send({ msg: "Succesfully Deleted" })
    } else {
        res.status(200).send({ msg: "Something Wrong" })

    }

});
// attendence api calls.
app.post("/attendence", async (req, res) => {
    let data = req.body;
    if (data.length == 0) {
        res.status(404).send({ msg: "Sorry there is no data" });
    }
    await data.map(async (val) => {
        res.setHeader("Content-Type", "text/html");
        updateEmployee("sakthi", val.name, { date: val.date, month: val.month, year: val.year, attendence: val.attendence, place: val.place, work: val.work })

    })
    res.status(200).send({ msg: "Succecfully added all the employee attendence" })

})
async function updateEmployee(db, name, data) {
    await client.db(db).collection(name).insertOne(data)

}
app.put("/attendence/month/list", async (req, res) => {
    try {
        let data = await client.db("sakthi").collection(req.body.name).find({ month: req.body.month, year: req.body.year }).toArray();
        if (!data) {
            res.status(404).send({ msg: "Sorry there is no data" });

        } else {
            res.status(200).send(data)
        }
    } catch (err) {
        res.send("Something Invalid")
    }
})
app.put("/attendence/edit", async (req, res) => {
    try {
        let result = await client.db("sakthi").collection(req.body.name).updateOne({ month: req.body.month, year: req.body.year }, { "$set": req.body.edit })
    } catch (err) {
        res.status(404).send({ msg: "Please Give a valid data" });

    }
    if (result.modifiedCount > 0) {
        res.status(200).send(result)
    } else {
        res.status(404).send({ msg: "Please Give a valid data" });


    }

})

app.listen(4000, () => {
    console.log("Server is running on 4000 port");
})