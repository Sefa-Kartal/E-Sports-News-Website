const express = require("express")
const User = require("../models/User")
const router = express.Router()


router.get("/register", (req, res) => {
    res.render("site/register")
})

router.post("/register", (req, res) => {
    if(req.body.password === req.body.passwordRepeat) {
        User.create(req.body, (error, user) => {
        res.redirect("/users/login")
        })
    } else {
        res.redirect("/users/register")
    }
})


router.get("/login", (req, res) => {
    res.render("site/login")
})

router.post("/login", (req, res) => {
    const {username, password} = req.body

    User.findOne({username}, (error,user) => {
        if(user) {
            if(user.password == password) {
                //user session
                req.session.userId = user._id
                req.session.userName = user.name
                req.session.userSurname = user.surname
                req.session.userEmail = user.email
                req.session.userUsername = user.username
                req.session.userPassword = user.password
                res.redirect("/")
            } else {
                res.redirect("/users/login")
            }
        } else {
            res.redirect("/users/register")
        }
    })
})


router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })

})

router.get("/profil/:id", (req, res) => {
    User.findById(req.params.id).then(user => {
            res.render("site/profil", {user:user})
        })
})

router.put("/profil/:id", (req, res) => {
    User.findById(req.params.id).then(user => {
        user.name = req.body.name
        user.surname = req.body.surname
        user.email = req.body.email
        user.username = req.body.username
        user.password = req.body.password
        user.passwordRepeat = req.body.passwordRepeat

        user.save().then(user => {
            res.redirect("/")
        })
    })
})



module.exports = router