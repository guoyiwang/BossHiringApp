exports.dbConfig = {
  url: process.env.MONGODB_URI || "mongodb://localhost:27017/boss-hiring",
};

exports.clientConfig = {
  url: process.env.CLIENT_URI || "http://localhost:3000",
};
