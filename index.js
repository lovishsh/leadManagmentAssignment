require('dotenv').config();
const express=require('express');
const bodyParser = require('body-parser');
const app=express();
const cors=require('cors');
const cookieParser=require('cookie-parser');
const router = require('./routers/api.routes');
const connectDB = require('./DBConnection');
connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());
app.use('/api',router);
const port=4000;
app.listen(port,()=>{
    console.log(`server is listening on ${port}`);
})
