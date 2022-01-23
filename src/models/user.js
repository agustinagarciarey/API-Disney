module.exports = (sequelize, type) => {
	return sequelize.define('user', {
		/*
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoincrement: true,
		},*/
		name: {
			type: type.STRING(50),
			allowNull: false,
			required: true
		},
		surname: {
			type: type.STRING(50),
			allowNull: false,
			required: true
		},
		mail: {
			type: type.STRING,
			allowNull: false,
			isEmail: true,
			required: true,
			len: [7 - 100]
		},
		password: {
			type: type.STRING(150),
			allowNull: false,
			required: true
		},
	},
		{
			underscored: true
		});
}