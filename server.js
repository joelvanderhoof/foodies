// Require dependencies
require('dotenv').config({});
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

if (process.env.NODE_ENV === 'development') {
    console.log(process.env.NODE_ENV);
    var cors = require('cors');
    
}

//Mongo/Mongoose --------------------------------------------------------------
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Configure MONGO DB
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL, {
    useMongoClient: true
});
const db = mongoose.connection;

db.on('error', (err) => {
    console.error(`Mongoose error: ${err}`);
});

db.once('openUri', () => {
    console.log(`Mongoose connected`);
});
//-------------------------------------------------------------------------------

// Initialize express app
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(cors());
    console.log('cors running');
};

const server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || process.env.DEV_PORT;



// Use body parser to parse incoming requests as json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(cookieParser());

// Serve files from the public folder
app.use(express.static(path.resolve(__dirname, 'build')));

//Sets up express routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
const secureRoutes = require('./server/routes/secure'); //future secure route
// Pass the authenticaion checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
// app.use('/api', authCheckMiddleware);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/secure', authCheckMiddleware); //future secure route
app.use('/secure', secureRoutes); //future secure route

// Passport ------------------------------------------------------------------

app.use(passport.initialize());

// Load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

//-------------------------------------------------------------------------------

// Serve home page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//Sets up express to handle 500 INTERNAL SERVER ERROR
app.use((error, req, res) => {
    res.status(500).send('500: Internal Server Error');
});

// Start server
server.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
});


//Socket IO
io.on('connection', function(socket) {
    socket.on('users', function(data) {
        if (data.message == "Store Updated") {
            io.emit(data.storeID, {
                message: data.message
            })
        }
        if (data.message == "Orders Updated") {
            io.emit(data.customerID, {
                message: data.message
            })
        }
    });
});