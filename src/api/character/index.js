const express = require('express');
const multer = require('../../utils/upload-img');
const { CheckToken } = require('../../utils/token');
const CreateCharacter = require('./controllers/post-new-character');

const router = express.Router();

//AGREGAR TOKEN

//router.get('/', );
router.post('/add', CheckToken, multer.single('image'), CreateCharacter);
//router.put('/:id',);
//router.delete('/:id',);
//router.get('/:id');

module.exports = router;