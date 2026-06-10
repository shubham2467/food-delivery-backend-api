const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

// GET USER INFO
const getUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById(req.userId);

    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    // hide password
    user.password = undefined;

    // response
    res.status(200).send({
      success: true,
      message: "User Get Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Get User API",
      error,
    });
  }
};

// UPDATE USER
const updateUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById(req.userId);

    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    // update fields
    const { username, address, phone } = req.body;

    if (username) user.username = username;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    // save updated user
    await user.save();

    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Update User API",
      error,
    });
  }
};
//RESET PASSWORD
const resetPasswordController = async(req, res) =>{
    try{
        const {email, newPassword, answer } = req.body
        if(!email || !newPassword || !answer){
            return res.status(500).send({
                success:false,
                message:'Please Provide All Fields'
            })
        }
        const user = await userModel.findOne({email, answer})
        if(!user){
            return res.status(500).send({
                success:false,
                message:'User Not Found or invalid answer'
            })
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword
        await user.save()
        res.status(200).send({
            success:true,
            message:'Password Reset Successfully'
        })



    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in PASSWORD RESET API',
            error
        })

    }
};
//UPDATE USER PASSWORD
const updatePasswordController = async (req, res) => {
    try{
        //find user
        const user = await userModel.findById(req.userId);
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User Not Found'
            })
        }
        
        //get data from user
        const {oldPassword, newPassword} = req.body
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success:false,
                message:'Please Provide Old or New Password'
            })
        }
        //check user password | compare password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message:"Invalid old password"
            });
        }
        //hashing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword
        await user.save();
        res.status(200).send({
            success:true,
            message: "Password Updated!",
        });


    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Password Update API',
            error
        })

    }
};
//DELETE PROFILE ACCOUNT
const deleteProfileController = async(req, res) => {
  try{
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success:true,
      message:"Your account has been deleted",
});

  }catch(error){
    console.log(error)
    res.status(500).send({
      success: false,
      message:'Error In Delete Profile API',
      error
    })

  }
};

// UPDATE USER ROLE
const updateUserRoleController = async (req, res) => {
  try {

    const { id } = req.params;
    const { usertype } = req.body;

    // validate role
    const allowedRoles = [
      "client",
      "admin",
      "vendor",
      "driver"
    ];

    if (!allowedRoles.includes(usertype)) {
      return res.status(400).send({
        success: false,
        message: "Invalid User Role",
      });
    }

    // UPDATE ROLE
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { usertype },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User Role Updated Successfully",
      updatedUser,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error In Update User Role API",
      error,
    });

  }
};
module.exports = {
  getUserController,
  updateUserController,
  updatePasswordController,
  resetPasswordController,
  deleteProfileController,
  updateUserRoleController,
};