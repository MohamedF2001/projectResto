const express = require("express");
const cors = require("cors")
const connectDB = require('./config/db')
const path = require('path')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const app = express();
const multer = require('multer')
const fs = require('fs');
const cat = require('./models/categorie')

connectDB()

app.use(cors())
app.use("/uploads", express.static(__dirname + "/uploads"));
//app.use(bodyParser.urlencoded({ extended: false}))
//app.use(bodyParser.json())
app.use(express.json());

app.use(routes)

const uploadDir = './uploads';

app.listen(/*3000*/process.env.PORT || 3000, () => {
    console.log("Server is running at port 8000");
});