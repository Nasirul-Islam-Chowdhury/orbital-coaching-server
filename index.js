const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors())
require('dotenv').config();


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

    app.get("/services", async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
     
        res.send(services)
    })
    app.get("/serviceDetails/:id", async (req, res) => {
      const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
     
        res.send(services)
    })

  } finally {

  }
}
run().catch(error=>console.log(error));



app.get('/', (req, res) => {
    res.send('e-tutor server running')
})



app.listen(port, () => {
    console.log(`e-tutor running on port ${port}`)
})