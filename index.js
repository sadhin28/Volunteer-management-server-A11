const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const cookieParser = require('cookie-parser'); // uncomment if using cookies

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
// app.use(cookieParser()); // uncomment if using cookies

// Test routes
app.get('/', (req, res) => res.send('Volunteer hub is running'));
app.get('/ping', (req, res) => res.send('Pong'));

// MongoDB URI
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.fyfyih2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        const addVolunteerDataCollection = client.db('NeedVolunteer').collection('NeedVolunteerData');

        // Get all volunteers
        app.get('/addVolunteer', async (req, res) => {
            const result = await addVolunteerDataCollection.find().toArray();
            res.send(result);
        });

        // Get volunteer by ID
        app.get('/addVolunteer/:id', async (req, res) => {
            const id = req.params.id;
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
        console.log("Successfully connected to MongoDB!");
    } catch (err) {
        console.error(err);
    }
}

run().catch(console.dir);

// Start server
app.listen(port, () => {
    console.log(`Volunteer hub server running on port: ${port}`);
});
