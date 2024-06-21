const express = require("express");
const sequelize = require("./utils/database");
const cors = require("cors");
const bodyParser = require("body-parser");

//models
const User = require('./models/user')
const Post = require("./models/post");
const Tag = require("./models/tag");

//routes
const adminRoutes = require('./routes/admin')
const postRoutes = require('./routes/post')

//middlewares
const userAuthentication = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/',(req, res)=>{
    res.sendFile('signup.html', {root: 'views'});
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', {root:'views'});
});

app.get('/blogs', (req, res) => {
    res.sendFile('blogs.html', {root:'views'});
});

app.use(adminRoutes)

app.get('/authenticate-user', userAuthentication.auth, (req, res) => {
    res.status(201).json({success: true});
});

app.use(postRoutes)

User.hasMany(Post);
Post.belongsTo(User);

Post.belongsToMany(Tag, {through: 'PostTag'})
Tag.belongsToMany(Post, {through: 'PostTag'})
const PORT = process.env.PORT;
sequelize.sync().then(()=>{
    app.listen(PORT)
}).catch(err=>console.log(err))