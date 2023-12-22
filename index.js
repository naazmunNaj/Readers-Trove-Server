const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());


console.log(process.env.DB_PASSWORD);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mewwgyu.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)



    const bookCategoriesCollection = client.db('readersTrove').collection('bookCategories');
    const allCategoryBooksCollection = client.db('readersTrove').collection('allCategoryBooks');
    const borrowedBooksCollection = client.db('readersTrove').collection('borrowedBooks');



    app.get('/bookCategories', async(req,res)=>{
      const cursor = bookCategoriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })
    app.get('/allCategoryBooks', async(req,res)=>{
      const cursor = allCategoryBooksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/allCategoryBooks/:id', async(req,res) =>{
      const id = req.params.id;
      const query ={
        _id: new ObjectId(id)
      }
      const user = await allCategoryBooksCollection.findOne(query)
      res.send(user);
    })


    app.post("/borrowedBooks", async (req, res) => {
      const order = req.body;
      const result = await borrowedBooksCollection.insertOne(order);
      res.send(result);
    });



    app.get("/borrowedBooks", async (req, res) => {
      const result = await borrowedBooksCollection.find().toArray();
      res.send(result);
      });



    app.delete("/borrowedBooks/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id:(id)
      };
      const result = await borrowedBooksCollection.deleteOne(query);
      res.send(result);
    });




    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res)=>{
    res.send('Trove is working')
})

app.listen(port,()=>{
    console.log((`Readers Trove is running on port ${port}`));
})