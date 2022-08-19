// Setting up our dependencies
const express = require("express");
const app = express();
const port = 3100;
const cors = require("cors");
// passes information from the frontend to the backend
const bodyParser = require("body-parser");
// This is our middleware for talking to mongoDB
const mongoose = require("mongoose");
// bcrypt for encrypting data (passwrords)
const bcrypt = require('bcryptjs');
// grab our config file
const config = require('./config.json')
console.log(config)

// Schemas
// every schema needs a capital letter
const Coffee = require("./models/coffee.js");
const User = require("./models/user.js");

// start our dependencies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

// Start our server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// let's connect to mongoDB 
// cluster name: mycluster 
// username: billyridgway
// password: R1dgway1 
mongoose.connect(
  `mongodb+srv://${config.username}:${config.password}@mycluster.p4iym.mongodb.net/?retryWrites=true&w=majority`,
  // .then is a chaining method used with promises
  // in simple terms, it will run something depending on the function before it
).then(() => {
  console.log(`You've connected to MongoDB!`)
  // .catch is a method to catch any errors that might happen in a promise
}).catch((err) => {
  console.log(`DB connection error ${err.message}`)
})

// ====================
//       ADD Method
// ====================

// set up a route/endpoint which the frontend will access 
// app.post will send data to the database 
app.post(`/addCoffee`, (req, res) => {
  // create a new instance of the coffee schema 
  const newCoffee = new Coffee({
    // give our new coffee the details we sent from the frontend 
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    price: req.body.price,
    image_url: req.body.image_url
  });
  // to save the newcoffee to the database
  // use the variable declared above
  newCoffee.save()
    .then((result) => {
      console.log(`Added a new coffee successfully!`)
      // return back to the frontend what just happened
      res.send(result)
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`)
    })
});


// ===================
//      GET Method
// ===================

// here we are setting up the /allCoffee route
app.get('/allCoffee', (req, res) => {
  // .then is method in which we can chain functions on
  // chaining means that once something has run, then we can
  // run another thing
  // the result variable is being returned by the .find() then we ran earlier
  Coffee.find().then(result => {
    // send back the result of the search to whoever asked for it
    // send back the result to the front end. I.E the go the button
    res.send(result)
  })
})

// =====================
//     DELETE Method
// ====================

// set up the delete route
// This route will only be actived if someone goes to it
// you can go to it using AJAX
app.delete('/deleteCoffee/:id', (req, res) => {
  // the request varible here (req) contains the ID, and you can access it using req.param.id
  const coffeeId = req.params.id;
  console.log("The following coffee was deleted:")
  console.log(coffeeId);
  // findById() looks up a piece of data based on the id aurgument which we give it first
  // we're giving it the coffee ID vairiblew 
  //  if it successful it will run a function
  // then function will provide us the details on that coffee or an error if it doesn't work
  Coffee.findById(coffeeId, (err, coffee) => {
    if (err) {
      console.log(err)
    } else {
      console.log(coffee);
      Coffee.deleteOne({ _id: coffeeId })
        .then(() => {
          console.log("Success! Actually deleted from mongoDB")
          // res.send will end the process
          res.send(coffee)
        })
        .catch((err) => {
          console.log(err)
        })
    }

  });
});

// ====================
//      EDIT Method
// ====================

app.patch('/updateProduct/:id', (req, res) => {
  const idParam = req.params.id;
  Coffee.findById(idParam, (err, coffee) => {
    const updatedProduct = {
      name: req.body.name,
      price: req.body.price,
      image_url: req.body.image_url
    }
    Coffee.updateOne({
      _id: idParam
    }, updatedProduct).
      then(result => {
        res.send(result);
      }).catch(err => res.send(err));
  })
})

// =======================
//      Registering users
// =======================
app.post('/registerUser', (req, res) => { // Checking if user is in the DB already

  User.findOne({ username: req.body.username }, (err, userResult) => {

    if (userResult) {
      // send back a string so we can validate the user
      res.send('username exists');
    } else {
      const hash = bcrypt.hashSync(req.body.password); // Encrypt User Password
      const user = new User({
        _id: new mongoose.Types.ObjectId,
        username: req.body.username,
        password: hash,
        profile_img_url: req.body.profile_img_url
      });

      user.save().then(result => { // Save to database and notify userResult
        res.send(result);
      }).catch(err => res.send(err));
    } // Else
  })
}) // End of Create Account

// Logging in

// ============
//     Log In
// =============
app.post('/loginUser', (req, res) => {
  // firstly look for a user with that username
  User.findOne({ username: req.body.username }, (err, userResult) => {
    if (userResult) {
      if (bcrypt.compareSync(req.body.password, userResult.password)) {
        res.send(userResult);
      } else {
        res.send('not authorised');
      } // inner if
    } else {
      res.send('user not found');
    } // outer if
  }) // Find one ends
}); // end of post login

