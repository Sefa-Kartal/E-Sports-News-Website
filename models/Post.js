const mongoose = require("mongoose")
const Category = require("../models/Category")

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required:true},
    post_image: {type: String, required: true},
    category: { type: mongoose.Schema.Types.ObjectId, ref:"categories"},
    date: {type: Date, default: Date.now}
})

module.exports =  mongoose.model("Post", PostSchema)
 