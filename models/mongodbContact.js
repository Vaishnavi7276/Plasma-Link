const mongoose=require("mongoose");

const contactSchema =new mongoose.Schema({
    name :{
        type :String,
        require :true,
    },
    phone :{
        type :String,
        require :true,
        minlength:6,
        maxlength:10,
    },
    email : {
        type :String,
        require :true,
    },
    message : {
        type :String,
        require :true,
    },
    
});

module.exports = mongoose.model("Contact",contactSchema);
