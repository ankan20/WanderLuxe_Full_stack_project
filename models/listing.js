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
            url:String,
            filename:String  
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
        }],
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        geometry :{
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
          }
    }
)

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;
