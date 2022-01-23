module.exports = (sequelize, type) => {
	return sequelize.define('film', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoincrement: true
		},
		title: {
			type: type.STRING(80),
			allowNull: false,
			required: true
		},
		year: {
			type: type.INTEGER,
			allowNull: false,
			required: true
		},
		rating: {
			type: type.INTEGER,
			defaultValue:0,
		},
		genre_id: {
			type: type.INTEGER,
			allowNull: false,
			required: true
		}
	},
		{
			underscored: true,
		});
}