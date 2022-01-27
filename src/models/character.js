module.exports = (sequelize, type) => {
	return sequelize.define('character', {
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
		age: {
			type: type.INTEGER,
			allowNull: false,
			required: true
		},
        weight: {
			type: type.DECIMAL(5,2),
			allowNull: false,
			required: true
		},
		history: {
			type: type.TEXT,
			allowNull: false,
			required: true
		},
	},
		{
			underscored: true
		});
}