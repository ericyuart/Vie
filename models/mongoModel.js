// Retrieve
var MongoClient = require('mongodb').MongoClient;

var assert = require('assert');
// Connect to the db
var mongoDB;
MongoClient.connect("mongodb://localhost:27017/vie", function(err, db) {
  assert.equal(null, err);
  console.log("Connected to MongoDB");
  // assign db to global
  mongoDB = db;
});




/********** CRUD Create -> Mongo insert ***************************************
 * @param {string} collection - The collection within the database
 * @param {object} data - The object to insert as a MongoDB document
 * @param {function} callback - Function to call upon insert completion
 *
 * See the API for more information on insert:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#insertOne
 */
exports.create = function(collection, data, callback) {
  console.log("4. Start insert function in mongoModel");
  // Do an asynchronous insert into the given collection
  mongoDB.collection(collection).insertOne(
    data, // the object to be inserted
    function(err, status) { // callback upon completion
      if (err) doError(err);
      console.log("5. Done with mongo insert operation in mongoModel");
      // use the callback function supplied by the controller to pass
      // back true if successful else false
      var success = (status.result.n == 1 ? true : false);
      callback(success);
      console.log("6. Done with insert operation callback in mongoModel");
    });
  console.log("7. Done with insert function in mongoModel");
}

/********** CRUD Retrieve -> Mongo find ***************************************
 * @param {string} collection - The collection within the database
 * @param {object} query - The query object to search with
 * @param {function} callback - Function to call upon completion
 *
 * See the API for more information on find:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#find
 * and toArray:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#toArray
 */
exports.retrieve = function(collection, query, callback) {
  /*
   * The find sets up the cursor which you can iterate over and each
   * iteration does the actual retrieve. toArray asynchronously retrieves the
   * whole result set and returns an array.
   */
  mongoDB.collection(collection).find(query).toArray(function(err, docs) {
    if (err) doError(err);
    // docs are MongoDB documents, returned as an array of JavaScript objects
    // Use the callback provided by the controller to send back the docs.
    callback(docs);
  });
}

/********** CRUD Update -> Mongo updateMany ***********************************
 * @param {string} collection - The collection within the database
 * @param {object} filter - The MongoDB filter
 * @param {object} update - The update operation to perform
 * @param {function} callback - Function to call upon completion
 *
 * See the API for more information on insert:
 * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#updateMany
 */
exports.update = function(collection, filter, update, callback) {
  mongoDB
    .collection(collection) // The collection to update
    .updateMany( // Use updateOne to only update 1 document
      filter, // Filter selects which documents to update
      update, // The update operation
      {
        upsert: false
      }, // If document not found, insert one with this update
      // Set upsert false (default) to not do insert
      function(err, status) { // Callback upon error or success
        if (err) doError(err);
        callback('Modified ' + status.modifiedCount +
          ' and added ' + status.upsertedCount + " documents");
      });
}

/********** CRUD Delete -> Mongo deleteOne or deleteMany **********************
 * The delete model is left as an exercise for you to define.
 */

exports.Mdelete = function(collection, filter, callback) {
  mongoDB
    .collection(collection)
    .deleteOne(
      filter,
      function(err, status) { // Callback upon error or success
        if (err) doError(err);
        callback('Modified ' + status.modifiedCount +
          ' and added ' + status.upsertedCount + " documents");
      });
}



var doError = function(e) {
  console.error("ERROR: " + e);
  throw new Error(e);
}