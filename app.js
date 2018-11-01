"use strict"

//require node dependancies
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const logger = require('logger-request');
const bodyParser = require('body-parser');
const request = require('request'); //http

const {Mail} = require('./Components/mail.js');
const YouTube = require('./Components/youtube.js');

let YouTubeVideos = new Array();

var z = new YouTube;
//console.log(z.exec());
z.exec()
.then((data)=>{
  console.log(data);
  YouTubeVideos = data ;
})
.catch((err)=>{
  console.log(err);
})


require('dotenv').config();

//define the port to run the app on
const serverPort = process.env.PORT;

//initialize express
const app = express();

//initialize socket.io for realtime streaming
var http = require('http').Server(app);
var io = require('socket.io')(http);

//enable Cross Origin Resource Sharing
app.use(cors());


// ######### START OF DATABASE LAUNCH ACTIONS  ########

//initialize the use of native Node Promise with mongoose
mongoose.Promise = global.Promise;

//create a connection to mongoDB
const mongoOptions = {};

const mongodbUri = `mongodb://${process.env.DBUSERNAME}:${process.env.DBPASS}@ds133360.mlab.com:33360/${process.env.DBNAME}`;
//const mongodbUri = `mongodb://127.0.0.1:27017/${process.env.DBNAME}`;

mongoose.connect(mongodbUri, mongoOptions);

const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
  console.log(`MongoDB Connected!\nNow running on address ${mongodbUri} `);
});

// #########END OF DATABASE LAUNCH ACTIONS  ########


//Require Routes Handlers
const usersRoute = require('./Routes/users.js');
const notesRoute = require('./Routes/notes.js');
/*
var notesMail = new Mail('joshubig@gmail.com','SERMON','mATTHEW 1:1');
        notesMail.dispatchNow()
        .then((response)=>{
            console.log(response);
        })
        .catch((err)=>{
            console.log(err);
        })


*/
// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(logger({
  filename: 'prayer_center.log',
}));


app.use((req, res, next) => {
  //Get IP accessing this app
  const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

  console.log(`IP ADDRESS : ${ip}`);
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))

app.set('view engine', 'ejs');


//handle ejs requests
// index page 
app.get('/', function(req, res) {
  console.log(YouTubeVideos);
    res.render('pages/index',{data: YouTubeVideos});
});

//HANDLE ROUTE REQUESTS

app.use('/users', usersRoute);
app.use('/notes', notesRoute);


//this will handle the root( i.e top most '/' path) request
app.all('/', (req, res) => {
  let rejectedAccess = {
    code: 204,
    message: 'Rejected : This is an api service . Specify the path for resource you want to interact with',
  }
  res.json(rejectedAccess);
});


//DEV CLOSE SERVER
app.all('/exit', (req, res) => {
  res.send('closing server')
  process.exit();
});

//This is the default 404 Route
app.all('*', function (req, res) {
  let fourOHfour = {
    code: 404,
    message: 'Sorry , this is a heart-breaking message - this resource/url doesn`t exist , check your url'
  }
  res.status(404).json(fourOHfour);
});

/*
// Tibim! its time to launch up our servers
app.listen(serverPort, function(err, res) {
  console.log(`Server Started! \nNow running on port ${serverPort} ...`);
});
*/

class socketResponse {

  constructor(socketID, msg, status, debug) {
    this.socketID = socketID;
    this.msg = msg;
    this.status = status;
    this.debug = debug;
  }

  dispatch(){
    io.to(`${this.socketID}` ).emit('chat message', this);
  }


}

//Listen to socket connections
io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);

    io.emit('chat message', Math.random());

  });


  socket.on('chatBot', (msg) => {

    console.log(socket.id);
    let inbox = msg;
    msg = inbox.content;
    //console.log(JSON.stringify(inbox));

    let sessionId = 'Made From Server' || Math.random() || 'Made From Server';

    let accessToken = process.env.APIAIKEY;
    
    let options = {
      url: 'https://api.api.ai/v1/query',
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + accessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "query": msg,
        "lang": "en",
        "sessionId": socket.id
      })
    };

    function callback(error, response, body) {

      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);

        var feedback = new socketResponse(socket.id, body.result.speech, 'success', 'everything is good').dispatch();


      } else {
        console.log(error)

        var feedback = new socketResponse(socket.id, 'Sorry something is wrong', 'error', error).dispatch();

      }

    }

    request(options, callback);
  })

});

// Tibim! its time to launch up our servers
http.listen(serverPort, function () {
  console.log(`\n\t\n Server and Sockets started! \t\nNow running on port ${serverPort} ...`);
});