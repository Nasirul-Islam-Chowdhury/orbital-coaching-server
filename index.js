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
// root page 
    app.get('/', (req, res) => {
      console.log(new Date())
      res.send('e-tutor server running')
    })

// get services from mongodb service collection
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services)
    })

// post reviews to mongodb database
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

// add service to the service collectoion
    app.post('/addService', async (req, res) => {
      const query = req.body;
      const review = await servicesCollection.insertOne(query)
      console.log(review)
      res.send(review)
    })

    // get reviews in each services by name quey
    app.get('/reviews/:name', async (req, res) => {
      const teacherName = req.params.name;
      let query = { teacherName: teacherName };
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews)
    })
// get user reviewes by query
    app.get('/myreviews', async (req, res) => {
      console.log(req.query.name)
      const query = {userName :req.query.name}
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews)
    })

    // delete review by query
    app.delete('/review/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const deleteItem = await reviewsCollection.deleteOne(query);
        res.send(deleteItem);    
      })
      // get each service details by id
    app.get("/serviceDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services)
    }) 

    app.patch('/review/:id', async (req, res) => {
      const id = req.params.id;
      console.log(req.body)
      const { review } = req.body;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
          $set: {
              reviewText: review,
          }
      }
      const result = await reviewsCollection.updateOne(filter, updateDoc);
      res.send(result)
  })
  } finally {
  }
}
run().catch(error => console.log(error));




app.listen(port, () => {
  console.log(`e-tutor running on port ${port}`)
})