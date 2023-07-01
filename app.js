const express = require("express")
const exphbs = require("express-handlebars")
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const port = 3000
const hostname = "127.0.0.1"
const path = require("path")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const fileUpload = require("express-fileupload")
const {generateDate, limit, truncate, paginate} = require("./helpers/hbs")
const expressSession = require("express-session")
const mongoStore = require("connect-mongo")
const methodOverride = require("method-override")

mongoose.connect("mongodb://127.0.0.1/intprogsite_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(expressSession({
    store: mongoStore.create({ mongoUrl: "mongodb://127.0.0.1/intprogsite_db"}),
    secret: "testtest",
    resave: false,
    saveUninitialized: true
}))



app.use(fileUpload())

app.use(express.static("public"))

app.use(methodOverride("_method"))

//handlebars helpers


app.engine('handlebars', exphbs.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers:{
        generateDate: generateDate,
        limit: limit,
        truncate: truncate,
        paginate: paginate
    }
}))
app.set('view engine', 'handlebars')

app.use(bodyparser.urlencoded({extended: false}))

app.use(bodyparser.json())

app.use((req, res, next) => {
    const {userId} = req.session
    if(userId){
        res.locals = {
            displayLink: true
            }
        } else {
            res.locals = {
                displayLink: false
                }
            }
        next()
    }
)

//Paragrafları ayırma fonksiyonu

function ex() {
    const text = document.getElementById("content").value;
    const ss = document.getElementById("add");
    ss.textContent = text;
  }



const main = require("./routes/main")
const posts = require("./routes/posts")
const users = require("./routes/users")
const admin = require("./routes/admin")
app.use("/", main)
app.use("/posts", posts)
app.use("/users", users)
app.use("/admin", admin)



app.listen(port, hostname, () => {
    console.log(`Server Çalışıyor, http://${hostname}:${port}/`)
})
