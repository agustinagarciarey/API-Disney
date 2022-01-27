const express = require('express');
const multer = require('../../utils/upload-img');
const { CheckToken } = require('../../utils/token');
const CreateFilm = require('./controllers/post-new-film');

const CreateGenre = require('./controllers/genre')

const router = express.Router();

//AGREGAR TOKEN

//router.get('/', );
router.post('/add', CheckToken, multer.single('image'), CreateFilm);
//router.put('/:id',);
//router.delete('/:id',);
//router.get('/:id');
router.post('/add/genre', multer.single('image'), CreateGenre);
module.exports = router;