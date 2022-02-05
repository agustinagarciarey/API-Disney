module.exports = (sequelize, type) => {
	return sequelize.define('film', {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true,

		},
		title: {
			type: type.STRING(80),
			allowNull: false,
			required: true
		},
		image: {
			type: type.STRING(250),
			allowNull: true,
			required: false
		},
		year: {
			type: type.INTEGER,
			allowNull: false,
			required: true
		},
		rating: {
			type: type.FLOAT,
			defaultValue: 0,
		},
		genreId: {
			type: type.INTEGER,
			allowNull: false,
			required: true
		},
		createdAt: {
			type: type.BIGINT,
		},
		updatedAt: {
			type: type.BIGINT,
		}
	},
		{
			timestamps: false,
		});
}