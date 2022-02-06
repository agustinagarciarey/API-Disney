const express = require('express');
const multer = require('../../utils/upload-img');
const { CheckToken } = require('../../utils/token');
const CreateCharacter = require('./controllers/post-new-character');
const GetCharacters = require('./controllers/get-characters')
const GetCharacter = require('./controllers/get-character')
const UpdateImage = require('./controllers/update-image')

const router = express.Router();

//AGREGAR TOKEN

router.get('/', CheckToken, GetCharacters );
router.get('/:id', CheckToken, GetCharacter);
router.post('/add', CheckToken, multer.single('image'), CreateCharacter);
//router.put('/:id',);
//router.delete('/:id',);
router.put('/image/:id', CheckToken, multer.single('image'), UpdateImage);

module.exports = router;