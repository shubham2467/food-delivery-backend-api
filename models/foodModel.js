const mongoose = require("mongoose");

//schema
const foodSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:[true, 'Food Title is require']
    },
    description:{
        type:String,
        required:[true, 'food description is requored']
    },
    price:{
        type:Number,
        require:[true, 'food price is required']
    },
    imgUrl:{
        type:String,
        default:"https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png"
    },
    foodTags :{
        type:String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
},
    code:{
        type:String,
    },
    isAvailabe:{
        type:Boolean,
        default:true,
    },
    resturant:{
        type:mongoose.Schema.ObjectId,
        ref:'Resturant'
    },
    rating:{
        type:Number,
        default:5,
        min:1,
        max:5
    },
    ratingCount:{
        type:String,
    },

},
{ timestamps: true }
);

//export
module.exports = mongoose.model("Foods", foodSchema);