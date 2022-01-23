require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoute = require('./api/user/index');

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
app.use('/user', userRoute);
/*
app.use('/film', filmRoute);
app.use('/character', characterRoute);
*/

//starting the server
app.listen(process.env.PORT, () =>{
	console.log('Corriendo en el puerto ' + process.env.PORT);
});

//module.exports = { app, server };