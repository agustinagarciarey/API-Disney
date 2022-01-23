module.exports = (sequelize, type) => {
	return sequelize.define('genre', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoincrement: true
		},
		name: {
			type: type.STRING(50),
			allowNull: false,
			required: true
		},
		image: {
			type: type.STRING(250),
			allowNull: true,
			required: false
		},
	},
		{
			underscored: true
		});
}