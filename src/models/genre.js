module.exports = (sequelize, type) => {
	return sequelize.define('genre', {
		id: {
			type: type.INTEGER,
			autoIncrement: true,
			primaryKey: true,

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