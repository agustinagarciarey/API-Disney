require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoute = require('./api/user/index');
const characterRoute = require('./api/character/index')
const filmRoute = require('./api/film/index')
const cloudinary = require('cloudinary');
const app = express();

require('./db');

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
	origin: "*",
	allowedHeaders: "*"
}));

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,

});

//routes
app.use('/users', userRoute);
app.use('/movies', filmRoute);
app.use('/characters', characterRoute);

//starting the server
app.listen(process.env.PORT || 3000, () => {
	console.log('Corriendo en el puerto ' + process.env.PORT);
});
