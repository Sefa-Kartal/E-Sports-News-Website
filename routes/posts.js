const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const path = require("path")
const Category = require("../models/Category")


router.get("/new", (req, res) => {
    Category.find({}).then(categories => {
        res.render("./site/addpost", { categories: categories })
    })
})


router.get("/category/:categoryId", (req, res) => {
    const postPerPage = 4
    const page = req.query.page || 1
    Post.find({category:req.params.categoryId}).sort({ $natural: -1 }).populate({ path: "category", model: Category })
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


router.get("/:id", (req, res) => {
    Post.findById(req.params.id).then(post => {
        res.render("site/full-new", {post:post})
    })
})


router.post("/test", (req, res) => {

    let post_image = req.files.post_image

    post_image.mv(path.resolve(__dirname, "../public/images/postimages", post_image.name))

    Post.create({
        ...req.body,
        post_image:`/images/postimages/${post_image.name}`
    })

    res.redirect("/")
})



module.exports = router