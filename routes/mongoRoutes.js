// include my model for this application
var mongoModel = require("../models/mongoModel.js")

// Define the routes for this controller
exports.init = function(app) {

  app.get('/api/:collection', doRetrieve); // CRUD Retrieve

  app.put('/api/:collection', doCreate); // CRUD Create

  app.post('/api/:collection', doUpdate); // CRUD Update

  app.delete('/api/:collection', doDelete); //CRUD Delete

  // The CRUD Delete path is left for you to define
}

/**
test ajax call to put data in db
$.ajax({
  url: "/api/users/",
  data: tempUser,
  type: 'PUT',
  success: function(result) {

    console.log(result);

  }
});

*/


/********** CRUD Create *******************************************************
 * Take the object defined in the request body and do the Create
 * operation in mongoModel.  (Note: The mongoModel method was called "insert"
 * when we discussed this in class but I changed it to "create" to be
 * consistent with CRUD operations.)
 */
doCreate = function(req, res) {
  /*
   * A series of console.log messages are produced in order to demonstrate
   * the order in which the code is executed.  Given that asynchronous 
   * operations are involved, the order will *not* be sequential as implied
   * by the preceding numbers.  These numbers are only shorthand to quickly
   * identify the individual messages.
   */
  console.log("1. Starting doCreate in dbRoutes");
  /*
   * First check if req.body has something to create.
   * Object.keys(req.body).length is a quick way to count the number of
   * properties in the req.body object.
   */
  if (Object.keys(req.body).length == 0) {
    res.send(false);
    return;
  }
  /*
   * Call the model Create with:
   *  - The collection to do the Create into
   *  - The object to add to the model, received as the body of the request
   *  - An anonymous callback function to be called by the model once the
   *    create has been successful.  The insertion of the object into the 
   *    database is asynchronous, so the model will not be able to "return"
   *    (as in a function return) confirmation that the create was successful.
   *    Consequently, so that this controller can be alerted with the create
   *    is successful, a callback function is provided for the model to 
   *    call in the future whenever the create has completed.
   */


  mongoModel.create(req.params.collection,
    req.body,
    function(result) {
      res.send(result);


      console.log("2. Done with callback in dbRoutes create");
    });
  console.log("3. Done with doCreate in dbRoutes");
}

/********** CRUD Retrieve (or Read) *******************************************
 * Take the object defined in the query string and do the Retrieve
 * operation in mongoModel.  (Note: The mongoModel method was called "find"
 * when we discussed this in class but I changed it to "retrieve" to be
 * consistent with CRUD operations.)
 */

doRetrieve = function(req, res) {
  /*
   * Call the model Retrieve with:
   *  - The collection to Retrieve from
   *  - The object to lookup in the model, from the request query string
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the retrieve has been successful.
   * modelData is an array of objects returned as a result of the Retrieve
   */
  mongoModel.retrieve(
    req.params.collection,
    req.query,
    function(modelData) {
      res.send(modelData);
    });
}

/********** CRUD Update *******************************************************
 * Take the MongoDB update object defined in the request body and do the
 * update.  (I understand this is bad form for it assumes that the client
 * has knowledge of the structure of the database behind the model.  I did
 * this to keep the example very general for any collection of any documents.
 * You should not do this in your project for you know exactly what collection
 * you are using and the content of the documents you are storing to them.)
 */
doUpdate = function(req, res) {
  // if there is no filter to select documents to update, select all documents
  var filter = req.body.find ? JSON.parse(req.body.find) : {};
  // if there no update operation defined, render an error page.
  if (!req.body.update) {
    res.render('message', {
      title: 'Mongo Demo',
      obj: "No update operation defined"
    });
    return;
  }
  var update = JSON.parse(req.body.update);
  /*
   * Call the model Update with:
   *  - The collection to update
   *  - The filter to select what documents to update
   *  - The update operation
   *    E.g. the request body string:
   *      find={"name":"pear"}&update={"$set":{"leaves":"green"}}
   *      becomes filter={"name":"pear"}
   *      and update={"$set":{"leaves":"green"}}
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the update has been successful.
   */
  mongoModel.update(req.params.collection, filter, update,
    function(status) {
      res.send(status);
    });
}

/********** CRUD Delete *******************************************************
 * The delete route handler is left as an exercise for you to define.
 */

doDelete = function(req, res) {
  // if there is no filter to select documents to update, select all documents
  var filter = req.body.find ? JSON.parse(req.body.find) : {};


  mongoModel.Mdelete(req.params.collection, filter,
    function(status) {
      res.render('message', {
        title: 'Mongo Demo',
        obj: status
      });
    });
}