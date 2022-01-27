module.exports = (sequelize, type) => {
	return sequelize.define('film', {
		id: {
			type: type.UUID,
			primaryKey: true,
			autoIncrement: true 
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
			type: type.INTEGER,
			defaultValue: 0,
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