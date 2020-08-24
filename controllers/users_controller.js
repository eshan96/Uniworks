const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken')

module.exports.create = function(req, res) {
    if(req.body.password != req.body.confirm_password) {
        return res.json(409, {
            message: "Password and Confirm Password does not match :("
        })
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            return res.json(204, {
                message: "Error in finding the user"
            })
        }

        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('error is----- ', err)
                    return res.json(422, {
                        message: "Error in creating the user"
                    })

                }

                return res.json(200, {
                    message: "User Created Successfully",
                    user: user
                })
            })
        }else{
            return res.json(422, {
                message: "User Already exist"
            })
        }
    })
}



module.exports.createSession = async function(req, res) {
  try{
      let user = await User.findOne({
          email: req.body.email
      })


      if(!user || user.password != req.body.password) {
          return res.json(422, {
              message: "Invalid username or password"
          })
      }
         var token = jwt.sign(user.toJSON(), 'uniworks', {expiresIn: '100000'})

          return res.json(200, {
          message: "Sign in successfull, here is your token, please keep it safe :)",
          data: {
              token: token,
              //decoded: jwt.verify(token, 'uniworks')
          }
      })
  }catch(err) {
      console.log('error is---', err)
          return res.json(500, {
              message: "Internal Server Error"
          })
  }
}

module.exports.list = async function(req, res) {
    try{
        let users = await User.find({});

        return res.json(200, {
            message: "Here is the list of users!",
            users: users
        })

    }catch(err){
        console.log('Error is----- ', err)
        return res.json(500, {
            message: "Internal Server Error"
        })
    }
}

module.exports.info = async function(req, res) {
    try{
        let user = await User.findOne({email: req.query.email});

        return res.json(200, {
            message: "Here is the information about user",
            user: user
        })

    }catch(err){
        return res.json(500, {
            message: "Internal Server Error"
        })
    }
}


module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {
                    console.log('*****Multer Error: ', err)
                    return res.json(422, {
                        message: "Error in updating the profile pic"
                    })
                }
                
                user.name = req.body.name;
                user.email = req.body.email;
                user.phone = req.body.phone;
                user.address = req.body.address;
                user.age = req.body.age;
                user.occupation = req.body.occupation;
                user.caption = req.body.caption;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'User has been updated successfully!');
                return res.json(200, {
                    message: "Profile has been updated!"
                });
            });

        }catch(err){
            
            return res.json(500, {
                message: "Internal Server Error"
            })
        }


    }else{
        return res.json(401, {
            message: "Unauthorized"
        });
    }
}

module.exports.delete = async function(req,res) {
    try{
        let user = await User.findById(req.params.id);
        user.remove()
        return res.json(200, {
            message: "User Deleted Successfully!"
        })
    }catch(err){
        return res.json(500, {
            message: "Internal Server Error"
        })
    }
}