const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderluxe";
const initData = require('./data');
const Listing = require('../models/listing');
async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("DB connected with sample data");
})
.catch(err=>{
    console.log(err);
})
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner:"65e096696942f0d72864c32e"}));
    //console.log(initData.data)
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();