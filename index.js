const express = require('express');
const app = express()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 4000
require('dotenv').config()


app.use(cors())
app.use(express.json())

// FsZqKFCovFjK5735

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authHeader.split(' ')[1];
  // jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
  //   if (err) {
  //     return res.status(403).send({ message: 'Forbidden access' });
  // }
  // console.log('decoded',decoded);
  // })
  console.log('in jwt ', authHeader);
  next()
}



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://sufian:FsZqKFCovFjK5735@cluster0.874uo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
  try {
    await client.connect();


    const productCollection = client.db("inventory").collection("products")


    //==============upload pd ============//


    //  app.post('/uploadpd',async(req,res)=>{
    //     const pd=req.body 
    //     const tokenInfo = req.headers.authorization;
    //      console.log(tokenInfo);
    //     // console.log(pd);
    //     const result = await productCollection.insertOne(pd);
    //     res.send('successfull')
    //  })

    app.post('/uploadPd', async (req, res) => {
      // const name = req.body.name
      // const price =req.body.price
      const pd = req.body
      // const tokenInfo = req.headers.authorization;
      // console.log(tokenInfo);
      // const [email, accessToken] = tokenInfo.split(" ")
      // const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      // console.log(decoded);
      // if (email === decoded.email) {
        const result = await productCollection.insertOne(pd);
        res.send('successfully')
      // }
      // else {
      //   res.send({ success: 'UnAuthoraized Access' })
      // }

    })


    //   read  

    app.get('/products', verifyJWT, async (req, res) => {

      const products = await productCollection.find({}).toArray();
      res.send(products)


    })


    // =========delete =======




    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id
      const q = { _id: (ObjectId(id)) }
      console.log(id);
      const result = await productCollection.deleteOne(q)
      res.send(result)
    })


    //==========update  =============
    /// ==========uodate con 1

    app.put('/product/:id', async (req, res) => {
      const id = req.params.id
      const data = req.body
      console.log(data);
      console.log(id);
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          // name:data.name,
          price: data.price
          // newname: data.newname
        },
      };

      const result = await productCollection.updateOne(filter, updateDoc, options);
      res.send(result)
      //  //  console.log(q);
      //   const result = await productCollection.findOne(q);
      //   res.send(result)
    })


    // =================jwt ============
    app.post("/login", (req, res) => {
      const email = req.body;
       console.log(email)     
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);

      res.send({ token })
  })

    console.log('db connec');
  } finally {
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send("hello")
})

app.get('/hero', (req, res) => {
  res.send("hello h")
})
app.get('/h', (req, res) => {
  res.send("hello h")
})






app.listen(port, () => {
  console.log('Listening')
})