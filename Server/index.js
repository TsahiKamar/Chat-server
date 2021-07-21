//npm start

//4.17.1
const express = require("express");


var STATIC_ROOMS = [{
  name: 'Public Room1',
  participants: 0,
  id: 1,
  sockets: []
}, {
  name: 'Private Room1',
  participants: 0,
  id: 2,
  sockets: []
}];

var app = require('express')();
var http = require('http').createServer(app);
const PORT = 8080;

//Cors allowed !
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET","POST","DELETE","PUT"]
  }
});

//Instead body-parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const userRoutes = require('./Api/Routes/user');
const chatRoutes = require('./Api/Routes/chat');

app.use('/user',userRoutes);
app.use('/chat',chatRoutes);

const morgan = require('morgan');

 const mongoose = require('mongoose');
 mongoose.connect('mongodb+srv://YYYYTYTYTT:mE5TQDRwpKrbHa11@cluster0.rhwod.mongodb.net/MaccabiDbName?retryWrites=true&w=majority',{
        useNewUrlParser: true ,
        useUnifiedTopology: true
  },function(err){

 if (err) 
 {
   console.log('Mongodb err: ' + err);
 }
 else 
 {
  console.log('Mongodb connection succesed !');
 }
 
});

 const Users = require('./Api/Models/user');
 const Chat = require('./Api/Models/chat');


app.use(morgan("dev"));


// Static files
app.use(express.static("public"));

app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","*");
 
 if (req.method === "OPTIONS") {
   res.header("Access-Control-Allow-Methods","PUT, POST, PATCH, DELETE, GET");
   return res.status(200).json({});
 }
 next();
});

app.use((req, res,next) => {
    const error = new Error('Not found !');
    error.status= 404;
    next(error);    
});

//Errors ..
app.use((error,req, res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        } 
    });
});

http.listen(PORT, () => {
    console.log(`Chat Server listening on *:${PORT}`);
});


const activeUsers = new Set();

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
  console.log('New Client Connected !');
  socket.emit('connection', null);
  
  socket.on("new user", function (data,ackFn) {
    console.log('New User ..');
 
    socket.userId = data;
    console.log('New user userName:' + data.userName);
    console.log('New user password:' + data.password);
 

    activeUsers.add(data);
    console.log('New user activeUsers:' + JSON.stringify(activeUsers));

    io.emit("new user", [...activeUsers]);

    newUser(data.userName,data.password);

      
  });
  //Selected Channel(Room)
  socket.on('channel-join', id => {
      console.log('channel join', id);
      STATIC_ROOMS.forEach(c => {
          if (c.id === id) {
              if (c.sockets.indexOf(socket.id) == (-1)) {
                  c.sockets.push(socket.id);
                  c.participants++;
                  io.emit('channel', c);
              }
          } else {
              let index = c.sockets.indexOf(socket.id);
              if (index != (-1)) {
                  c.sockets.splice(index, 1);
                  c.participants--;
                  io.emit('channel', c);
              }
          }
      });
      return id;
  });

  socket.on('send-message', message => {
      console.log('send-message : ' + message);
      console.log('message.text : ' + message.text);
      console.log('socket.userName : ' + socket.userName);

      io.emit('message', message);
      console.log('new message socket : ' + socket);

      messageSave(message.channel_id,message.text,message.senderName);

  });

  socket.on("typing", function (data) {
    console.log('typyng .. ');
    console.log('typyng data: ' + JSON.stringify(data));


    socket.broadcast.emit("typing", data);
  });

  socket.on('disconnect', () => {
    console.log('disconnect ! ');

    STATIC_ROOMS.forEach(c => {
          let index = c.sockets.indexOf(socket.id);
          if (index != (-1)) {
              c.sockets.splice(index, 1);
              c.participants--;
              io.emit('channel', c);
          }
      });
  });

});


function newUser(userName,password){
  console.log('newUser .. ');
  console.log('userName params:' + userName);
  
   const users = new Users({
       _id: mongoose.Types.ObjectId(),
       userName: userName,
       password: password  
    });
  
  if (userName != undefined && password != undefined) 
  {
  users.save() 
  .then(result => {
      console.log('New user Save result: ' + result);
  })
  .catch(err => {
      console.log(err);
  })  
  }
  else
  {
    console.log('newUser userName and password are undefined !')
  }

}

function messageSave(channelId,text,senderName) {
 
   const chat = new Chat({
       _id: mongoose.Types.ObjectId(),
       channelId:channelId,
       userName: senderName,
       message: text  
    });
  
  chat.save() 
  .then(result => {
      console.log('Message save result: ' + result);
  })
  .catch(err => {
      console.log(err);
  })  


}


app.get('/getUser/:userName', (req, res) => {
  const userName = req.params.userName;
  res.json({
    id:null,  
    userName: userName
  })
});  

