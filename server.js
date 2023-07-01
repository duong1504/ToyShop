// server.js
//console.log('May Node be with you')

const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://duong1504:123@cluster0.qgyv5uc.mongodb.net/'

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database successfully')
        
        // (1a) CREATE: client -> create -> database -> 'ToyShopDB'
        // -> create -> collection -> 'Products'
        const db = client.db('ToyShopDB')
        const productCollection = db.collection('Products')
        
        // To tell Express to EJS as the template engine
        app.set('view engine', 'ejs') 
        
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // To make the 'public' folder accessible to the public
        app.use(express.static('public'))

        // To teach the server to read JSON data 
        app.use(bodyParser.json())

        // (2) READ: client -> browser -> url 
        // -> server -> '/' -> collection -> 'Products' -> find() 
        // -> results -> index.ejs -> client
        app.get('/', (req, res) => {
            db.collection('Products').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('index.ejs', { products: results })
                })
                .catch(/* ... */)
        })

        // (1b) CREATE: client -> index.ejs -> data -> SUBMIT 
        // -> post -> '/products' -> collection -> insert -> result
        app.post('/products', (req, res) => {
            productCollection.insertOne(req.body)
            .then(result => {
                
                // results -> server -> console
                console.log(result)

                // -> redirect -> '/'
                res.redirect('/')
             })
            .catch(error => console.error(error))
        })

        // server -> listen -> port -> 3000
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })


