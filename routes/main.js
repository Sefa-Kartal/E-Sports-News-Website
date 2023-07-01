const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const Category = require("../models/Category")


router.get("/", (req, res) => {
    const postPerPage = 4
    const page = req.query.page || 1
    Post.find({}).sort({ $natural: -1 }).populate({ path: "category", model: Category })
        .skip((postPerPage * page) - postPerPage)
        .limit(postPerPage)
        .then(posts => {
            Post.countDocuments().then(postCount => {
                Category.find({}).then(category => {
                    res.render("site/home", {
                        posts: posts,
                        category: category,
                        current: parseInt(page),
                        pages: Math.ceil(postCount / postPerPage)

                    })
                })
            })
        })
})




router.get("/admin", (req, res) => {
    res.render("admin/posts")
})



module.exports = router