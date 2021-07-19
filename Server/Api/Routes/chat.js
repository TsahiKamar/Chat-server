//chat

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Chat = require('../Models/chat');

var STATIC_ROOMS = [{
    name: 'School Room',
    participants: 0,
    id: 1,
    sockets: []
}, {
    name: 'Lifestyle Room',
    participants: 0,
    id: 2,
    sockets: []
},
{
    name: 'Sport Room',
    participants: 0,
    id: 3,
    sockets: []
}
];

 router.get('/getChannels', (req, res) => {
     console.log('chat/getchannels ..');
     res.json({
         channels: STATIC_ROOMS
     })
});  
  
 
// router.get('/',(req,res,next) => {
// console.log('Get .. ');

// Chat.find()
// .exec()
// .then(chats => {
// const response = {
// count : chats.count,
//        chats: chats.map(item => {
//            return 
//            {
//            }
//        })
//      };
//      console.log('Get chats history ' + chats);
//       res.status(200).json(chats);   
// })
// .catch(err => {
//     console.log(err);
//     res.status(500).json({
//         error: err
//     });
// });
// });

// router.get('/chats',(req,res,next) => {
//     console.log('Get chats.. ');

//     Chat.find()
//     .exec()
//     .then(chats => {
//     const response = {
//     count : chats.count,
//            chats: chats.map(item => {
//                return 
//                {
//                }
//            })
//          };
//          console.log('Get chats history ' + chats);
//           res.status(200).json(chats);   
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// });
    



 module.exports = router;
