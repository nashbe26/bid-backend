const mongoose = require('mongoose');


// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
mongoose.set('debug', true);


/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose.connect(
    process.env.MONGO_URI
  ).then(()=>{
    console.log("Database sucessfully connected !");
});
  return mongoose.connection;
};
