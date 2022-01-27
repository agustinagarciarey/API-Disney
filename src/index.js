require('dotenv').config();
const express = require('express');
const cors = require('cors');
//const path = require('path');
const userRoute = require('./api/user/index');
const characterRoute = require('./api/character/index')
const filmRoute = require('./api/film/index')

const app = express();

require('./db');

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
	origin: "*",
	allowedHeaders: "*"
}));


//routes
app.use('/users', userRoute);
app.use('/films', filmRoute);
app.use('/characters', characterRoute);

//imgs
//app.use('/uploads', express.static(path.resolve('uploads')));


//starting the server
app.listen(process.env.PORT, () =>{
	console.log('Corriendo en el puerto ' + process.env.PORT);
});

//module.exports = { app, server };