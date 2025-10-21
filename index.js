const express = require('express');
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express()
app.use(express.json({ limit: '50mb' }));
require('dotenv').config()
app.use(cors());
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.fyfyih2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
       
        const addVolunteerDataCollection = client.db('NeedVolunteer').collection('NeedVolunteerData');
        //Get upcommit deadline data limit 6
        app.get('/upcoming-deadline',async (req,res)=>{
            try{
                const result = await addVolunteerDataCollection.find()
                .sort({Deadline:1})
                .limit(6)
                .toArray();
                res.status(200).send(result);
            }catch (error){
                console.error("error fetching post by upcomming deadline",error);
                res.status(500).send({message:"Internal Server Error"})
            }
        })
        // Get all volunteers
        app.get('/addVolunteer', async (req, res) => {
            const result = await addVolunteerDataCollection.find().toArray();
            res.send(result);
        });

        // Get volunteer by ID
        app.get('/addVolunteer/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const result = await addVolunteerDataCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Post a new volunteer
        app.post('/addVolunteer', async (req, res) => {
            const newVolunteerNeed = req.body;
            const result = await addVolunteerDataCollection.insertOne(newVolunteerNeed);
            res.send(result);
        });

        // Delete a volunteer
        app.delete('/addVolunteer/:id', async (req, res) => {
            const id = req.params.id;
            const result = await addVolunteerDataCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Update a volunteer
        app.put('/addVolunteer/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }; // fixed capitalization
            const updateDoc = { $set: update };

            const result = await addVolunteerDataCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // Get posts by organizer email
        app.get('/my-post', async (req, res) => {
            const email = req.query.email;
            const result = await addVolunteerDataCollection.find({ Organizer_email: email }).toArray();
            res.send(result);
        });
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Volunteer server is running:${port}`)
})