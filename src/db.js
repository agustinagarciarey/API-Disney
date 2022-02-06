const Sequelize = require('sequelize');
const FilmModel = require('./models/film');
const UserModel = require('./models/user');
const CharacterModel = require('./models/character');
const GenreModel = require('./models/genre');
const CharactersFilmModel = require('./models/character-film');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION
});

const Genre = GenreModel(sequelize, Sequelize);
const Film = FilmModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Character = CharacterModel(sequelize, Sequelize);
const CharactersFilms = CharactersFilmModel(sequelize, Sequelize)


// associations
Character.belongsToMany(Film, { through: "charactersFilms" })
Film.belongsToMany(Character, { through: "charactersFilms" })
Genre.hasMany(Film)
Film.belongsTo(Genre);

// synchronizing db
sequelize.sync({ force: false})
    .then(() => {
        console.log('Tablas sincronizadas')
    }).catch(() => {
        console.log('Error al sincronizar tablas')
    });


module.exports = {
    Film,
    User,
    Character,
    Genre,
    CharactersFilms 
}