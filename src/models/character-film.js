module.exports = (sequelize, type) => {
	return sequelize.define('charactersFilm', {
		filmId: {
			type: type.INTEGER,
			primaryKey: true,

		},
		characterId: {
			type: type.INTEGER,
			primaryKey: true,

		},
	},
		{
			timestamps: false,
		});
}