const mongoose=require("mongoose");

const drequestSchema =new mongoose.Schema({
    donorname :{
        type :String,
        require :true,
    },
    donation_for :{
        type :String,
        require :true,
    },
    gender :{
        type :String,
        require :true,
    },
    contact :{
        type :String,
        require :true,
        minlength:6,
        maxlength:10,
    },
    bloodtype :{
        type :String,
        require :true,
    },
    address : {
        type :String,
        require :true,
    },
    email : {
        type :String,
        require :true,
    },

});



module.exports = mongoose.model("D_request",drequestSchema);
