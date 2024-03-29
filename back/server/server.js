require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 8871;
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

/// //////// SESSIONS ////////////
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const knex = require('knex')({
  client: 'better-sqlite3',
  connection: {
    filename: './db/images.db',
  },
  useNullAsDefault: true,
});
const { signinHandler, authHandler, logoutHandler } = require('./authHandlers');

// CORS rules
const whitelist = `${process.env.HOST_URL}`;
const corsOptions = {
  origin: whitelist,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))


app.use(cookieParser());
app.use(session({
  genid() {
    return uuidv4();
  },
  secret: 'anangaranga',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: false,
  },
  store: new KnexSessionStore({
    knex,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
}));

if (app.get('env') === 'production') {
//  app.set('trust proxy', 1);
}

app.get('/api/hello', () => console.log('test'));
app.post('/api/signin', signinHandler);
app.get('/api/auth', authHandler);
app.get('/api/logout', logoutHandler);

require('./routes')(app);

app.listen(port, () => {
  // console.log(`Working on port ${port}`);
});
