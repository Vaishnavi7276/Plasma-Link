const mongoose=require("mongoose");

const loginSchema =new mongoose.Schema({
    firstname :{
        type :String,
        require :true,
    },
    lastname :{
        type :String,
        require :true,
    },
    username :{
        type :String,
        require :true,
    },
    email : {
        type :String,
        require :true,
    },
    password : {
        type : String,
        require : true,
    },
    repassword : {
        type : String,
        require : true,
        validate: {
            validator: function(value){
                return value === this.password;
            },
            message:'Paaword and Confirm Password must match'
        }
    },
    profilePic: {
        type: String,
        require: false,  // Set to false as it's not mandatory
       // default: 'path_to_default_image.png'
    }
})



const Registerlogin = new  mongoose.model("Registerlogin",loginSchema);
module.exports=Registerlogin;