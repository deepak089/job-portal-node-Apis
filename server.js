const express=require('express');
const dotenv=require('dotenv');
const app=express();
const cors = require("cors");
const connetionDatabase=require('./database/db');
const auth = require('./route/authRoute');
const user = require('./route/userRoute');
const job = require('./route/jobRoute');
const xss=require('xss-clean');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const reateLimit=require('express-rate-limit');
dotenv.config({path:'./config/.env'});

connetionDatabase();

app.use(express.json());
app.use(cors());
// app.use(morgan('dev'));
// save mongos saonitization
app.use(mongoSanitize());
// limit to ip

app.use(helmet(``));
app.use(xss());
app.use('/api/v1',auth);
app.use('/api/v1',user);
app.use('/api/v1',job);

const port= process.env.PORT || 4000;

app.listen(port,()=>{
    console.log('listening to the port at 4000');
})