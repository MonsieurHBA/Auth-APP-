const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authrout') ;  // n3ayet lel authroutes
const cookieParser = require('cookie-parser') ;
const {requireAuth , checkUser} = require('./middelware/authMiddel')
const app = express();

// middleware
app.use(cookieParser()) ;
app.use(express.static('public'));
app.use(express.json()) ; //t7awel el objet eli mawjoud f request mtaa postman l java script objet donc twali tnajem taçrah f request mtaaek f code o f console
// req.body tnajem testa3mel
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://test:test@cluster0.vyivi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' ;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }) //argument 2 taaml allow 3la les erreurs ale console
  .then((result) => app.listen(3000),
  console.log('DONE : DATA SENDED using PORT 3000 '))
  .catch((err) => console.log(err));

// routes
app.get('*' , checkUser) ;
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth , (req, res) => res.render('smoothies'));
app.use(authRoutes) ;  // na3mlelha appel