const express = require('express');
const path=require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
    secret: 'd7xtdz8t8ft76d767g',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next();
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.log(err));


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const ideas=require('./routes/ideas');
const users=require('./routes/users');

require('./config/passport')(passport);

app.use('/ideas',ideas);
app.use('/users',users);

app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});


app.get('/about', (req, res) => {
    res.render('about');
});

const port = 5000;

app.listen(5000, () => {
    console.log(`Server started on ${port}`);
});