
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

    Users.findOne({userName: userName})
    .exec()
    .then(data => {
        console.log('getUser result data:' + JSON.stringify(data));

        if (data != null) {
            res.status(200).json({
                data: data
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
    
    const query = {"userName": user, "password": pass}
    const projection = {}


    Users.findOne({userName: user, password:pass})
    .exec()
    .then(usr =>  {
        if (usr) {
            console.log('login succesed ! ');
            console.log('login result usr userName:' + usr["userName"]);
  
            res.status(200).json(usr["userName"]); //Return userName    
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

