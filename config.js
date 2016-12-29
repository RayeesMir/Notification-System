module.exports = {
    tailabeCollection:"system.profile",
	database: {
		dev: {
			protocol: "mongodb",
			host: "localhost",
			port: "27017",
			database: "notificationSystem",
			username: "",
			password: ""

		},
		production: {
			protocol: "mongodb",
			host: "localhost",
			port: "27017",
			database: "notificationSystem",
			username: "",
			password: ""
		}
	},
	tokenSettings: {
		dev: {
			accessToken: {
				time: "2",
				unit: "hours",
				secret: "testSecretForTest"
			}
		},
		production: {
			accessToken: {
				time: "2",
				unit: "hours",
				secret: "testSecretForProduction"
			}
		}
	},
	timeUnits:{
		"seconds": 's',
		"minutes": 'm',
		"hours": "h",
		"days": "d"
	},
	getConnectionString: function(env) {
		var connection;
		var connectionString = "";
		if (env == 'dev')
			connection = this.database.dev;
		else if (env == 'production')
			connection = this.database.production;
		else
			connection = null;
		if (connection) {
			connectionString = connection.protocol + "://";
			if (connection.username!="" && connection.password!="")
				connectionString += connection.username + ":" + connection.password + "@";
			connectionString += connection.host + ":" + connection.port +"/"+ connection.database;
			return connectionString
		} else
			return null;
	},
	getTokenSettings:function(env){
		if(env=='dev')
			return this.tokenSettings.dev.accessToken;
		else if(env=='production')
			return this.tokenSettings.production.accessToken;
	},
	getTimeUnits:function(){
		return this.timeUnits;
	}

}