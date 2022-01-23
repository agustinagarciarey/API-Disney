const Sequelize = require('sequelize');
const FilmModel = require('./models/film');
const UserModel = require('./models/user');
const CharacterModel = require('./models/character');
const GenreModel = require('./models/genre');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});


const Film = FilmModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Character = CharacterModel(sequelize, Sequelize);
const Genre = GenreModel(sequelize, Sequelize);

// associations
Character.belongsToMany(Film, { through: "characters_films" })
Film.belongsToMany(Character, { through: "characters_films" })
Genre.hasMany(Film)
Film.belongsTo(Genre);

// synchronizing db
sequelize.sync({ force: false })
    .then(() => {
        console.log('Tablas sincronizadas')
    });


module.exports = {
    Film,
    User,
    Character,
    Genre
}