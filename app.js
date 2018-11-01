const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
var session = require('express-session')
const PORT = 3010
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')
app.use(express.static('css'))
app.use(express.static('js'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'cat',
  resave: false,
  saveUninitialized: false
}))
//------------------------------------------------------------
let authenticateLogin = function(req,res,next) {

  // check if the user is authenticated
  if(req.session.username) {
    next()
  } else {
    res.redirect("/")
  }

}
app.all("/user/*",authenticateLogin,function(req,res,next){
    next()
})
//-----------------------------------------------------------
let userList = []
app.get('/', function(req,res){
  res.render('login')
})

app.post("/registerUser",function(req,res){
  let username = req.body.username
  let password = req.body.password
  let user = {username: username, userPassword:password}
  userList.push(user)
  res.redirect('/')
})

app.post('/login', function(req, res){
  let username = req.body.username
  let password = req.body.password
   let loggedInUser = userList.find(function(user){
     return user.username == username && user.userPassword == password
  })
  if(loggedInUser != null && req.session){
    console.log('session started')

    req.session.username = username
  }
  console.log(userList)
  console.log(loggedInUser)
  res.redirect('/user/mytrips')
})
app.get('/user/add_trips',function(req,res){
  res.render('add_trips')
})

app.get('/user/mytrips',function(req,res){
  let getTripforUser = userListwithTrip.filter(function(trip){
    return req.session.username == trip.username
  })
  console.log(getTripforUser)
  res.render('mytrips',{userTrips : getTripforUser})
})
let userListwithTrip = []
app.post('/user/add_trips',function(req,res){
  let tripLocation = req.body.tripLocation
  let tripReturnDate = req.body.tripReturnDate
  let tripDepartureDate = req.body.tripDepartureDate
  let imageUrl = req.body.imageUrl
  let username = req.session.username
  let userWithTrip = {username:username, tripLocation:tripLocation, tripReturnDate:tripReturnDate, tripDepartureDate:tripDepartureDate, imageUrl:imageUrl}
  userListwithTrip.push(userWithTrip)
  res.redirect('/user/mytrips')
})

app.get('/user/logout',function(req,res){
  req.session.destroy()
  res.redirect('/')
})
app.post('/user/delete_trip', function(req,res){
  let tripLocation = req.body.tripLocation
  let username = req.body.username
  userListwithTrip = userListwithTrip.filter(function(trip){
    return !(trip.username == username && trip.tripLocation == tripLocation)
  })
  console.log(userListwithTrip)
  res.redirect('/user/mytrips')
})






app.listen(PORT, function(){
  console.log('Surver is running...')
})
