const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors())
require('dotenv').config();
app.use(express.json())

const uri = `mongodb+srv://${process.env.tutor_db_user_name}:${process.env.tutor_db_user_pass}@cluster0.bbqqyyb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    const servicesCollection = client.db('e-tutor').collection('services');
    const reviewsCollection = client.db('e-tutor').collection('reviews');

    app.get('/', (req, res) => {
      console.log(new Date())
      res.send('e-tutor server running')
    })

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services)
    })

    app.post('/reviews', async (req, res) => {
      let query = req.body;
      var d = new Date();
      var date = d.getDate();
      var month = d.getMonth() + 1;
      var year = d.getFullYear();
      var dateStr = date + "/" + month + "/" + year;
      query.date = dateStr;
      const review = await reviewsCollection.insertOne(query);
      console.log(review)
      res.send(review)
    })

    app.post('/addService', async (req, res) => {
      const query = req.body;
      const review = await servicesCollection.insertOne(query)
      console.log(review)
      res.send(review)
    })

    app.get('/reviews/:name', async (req, res) => {
      const teacherName = req.params.name;
      let query = { teacherName: teacherName };
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews)
    })
    app.get('/myreviews', async (req, res) => {
      let query = req.params.email;
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews)
    })

    app.get("/serviceDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();

      res.send(services)
    })
  } finally {
  }
}
run().catch(error => console.log(error));




app.listen(port, () => {
  console.log(`e-tutor running on port ${port}`)
})