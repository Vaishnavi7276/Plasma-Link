const mongoose=require("mongoose");

const hospitalSchema =new mongoose.Schema({
    hospitalname :{
        type :String,
        require :true,
    },
    hospitalid :{
        type :String,
        require :true,
    },
    address : {
        type : String,
        require : true,
    },
    city : {
        type : String,
        require : true,
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
    },
    longitude : {
        type: Number,
        require:true,
    },
    latitude:{
        type: Number,
        require:true,
    }

})



const Hregisterlogin = new  mongoose.model("Hregisterlogin",hospitalSchema);
module.exports=Hregisterlogin;