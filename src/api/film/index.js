const express = require('express');
const multer = require('../../utils/upload-img');
const { CheckToken } = require('../../utils/token');
const CreateFilm = require('./controllers/post-new-film');
const GetFilms = require('./controllers/get-films');
const UpdateFilm = require('./controllers/update-film')
const DeleteFilm = require('./controllers/delete-film')
const GetFilm = require('./controllers/get-film')
const UpdateImage = require('./controllers/update-image')
const CreateGenre = require('./controllers/post-new-genre')

const router = express.Router();

router.get('/', CheckToken, GetFilms);
router.post('/add', CheckToken, multer.single('image'), CreateFilm);
router.put('/:id', CheckToken, UpdateFilm);
router.put('/image/:id', CheckToken, multer.single('image'), UpdateImage);
router.delete('/:id', CheckToken, DeleteFilm);
router.get('/:id', CheckToken, CheckToken, GetFilm);


router.post('/add/genre', CreateGenre);


module.exports = router;