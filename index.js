const express = require('express');
const app = express();
const port = 8000
const session = require('express-session')
const db = require('./config/mongoose');

const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport');
const passportJWT = require('./config/passport-jwt-strategy');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(bodyParser.urlencoded() );
app.use(bodyParser.json());

app.use(session({
    name: 'uniworks',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100),
    },
    store: new MongoStore(
        {
       
            mongooseConnection: db,
            autoRemove: 'disabled'
        
    },
    function(err){
        console.log(err)
    }
    )
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());
app.use(customMware.setFlash);


app.use('/', require('./routes'))


app.listen(port, function(err) {
    if(err) {
        console.log('Error in running the server:', err)
    }
  console.log('Server is running on port', port)
    
})