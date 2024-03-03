const mongoose = require('mongoose');
const link ="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg";
const Review = require("../models/review.js");




const listingSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            maxLength:100
        },
        description:{
            type:String,
            maxLength:1000
        },
        image:{
            type: String,
            set:(v)=>v===""?link:v,
            
        },
        price:{
            type:Number,
            required:true,
            min:1
        },
        location:{
            type:String,
            required:true
        },
        country:{
            type:String
        },
        reviews: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }]
    }
)

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;
