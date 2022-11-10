const express = require('express');
const app = express();
var cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.gsxxpjk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const serviceCollection = client.db('cleaningService').collection('services');
    const reviewCollection = client.db('cleaningService').collection('reviews');
    app.get('/services', async(req, res) =>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    //Services all
    app.get('/servicesall', async(req, res) =>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    
    app.get('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //Add service
    app.post('/services', async(req, res) =>{
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    })

    //Add reviews
    app.post('/reviews', async(req, res) =>{
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    })
    //Get reviews
    app.get('/reviews', async(req, res) =>{
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //Delete reviews
    app.delete('/reviews/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    })

    
  }
  finally{

  }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
  res.send('Cleaning service server is running')
})

app.listen(port, () => {
  console.log(`Cleaning service server is running on ${port}`)
})