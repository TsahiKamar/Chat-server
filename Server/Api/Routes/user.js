
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Users = require('../Models/user');

const bodyParser = require('body-parser');

router.get('/getUsers', (req, res) => {
    console.log('getUsers ..');
    Users.find()
    .exec()
    .then(data => {
        res.status(200).json({
            users: data 
        });
        
     })    
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
  
});  

router.get('/getUser/:userName', (req, res) => {
    const userName = req.params.userName;;
    console.log('getUser userName :' + userName);  

    Users.find({userName: userName})
    .exec()
    .then(usr => {
        console.log('getUser result usr:' + usr);

        if (usr != null || usr) {
            console.log('User found' + usr);
            res.status(200).json({
                data: usr
            });    
        } else {
            console.log('User not found !');
            res.status(401).json({
              message: 'User not found !'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});  
  

router.post('/login',(req,res) => {
    console.log('login  ..');
 
    console.log('login req.body :' + req.body);
    
    var user = req.body.userName;
    var pass = req.body.password;
    console.log('login user :' + user);
    console.log('login pass :' + pass);
    
    const query = {"userName": user, "password": pass}//{ "quantity": { "$gte": 25 } };
    const projection = {}


    Users.find({userName: user, password:pass})
    .select("_id userName")    
    .exec()
    .then(usr => {
        console.log('login result usr:' + usr);
        if (usr) {
            console.log('login succesed ! ');

            res.status(200).json(user); //Return userName    
        } else {
            console.log('login failed ! ');

            res.status(401).json({
              message: 'User not found !'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
   
});

router.delete('/deleteUser/:id',(req,res,next) => {
    console.log('deleteUser..' );

    const id = req.params.id;
    console.log('delete id :' + id);
    Users.deleteOne({_id: id })   
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted !'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
  
});


module.exports = router;

