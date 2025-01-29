require("dotenv").config();

module.exports = {
  mongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterdevconnector.thjgj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDevConnector`,
};
