var express 		= require("express"),
	app 			= express(),
	bodyParser  	= require("body-parser"),
	mongoose    	= require("mongoose"),
	flash      		= require("connect-flash"),
	passport    	= require("passport"),
    LocalStrategy 	= require("passport-local"),
	methodOverride  = require("method-override"),
	Movie  			= require("./models/movie"),
	Comment  		= require("./models/comment"),
	User        	= require("./models/user"),
	seedDB      	= require("./seed");




var movieRoutes    = require("./routes/movies"),
	commentRoutes  = require("./routes/comments"),
	reviewRoutes   = require("./routes/reviews"),
	indexRoutes    = require("./routes/index");


mongoose.connect("mongodb+srv://moviedb:password!1@cluster0-keozz.mongodb.net/test?retryWrites=true&w=majority",{ useNewUrlParser: true ,useCreateIndex:true, useUnifiedTopology: true,useFindAndModify: false });
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();//seeding the db

// PASSPORT CONFIGURATION
app.use(require("cookie-session")({
    secret: "This is a website",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   next();
});


app.use("/", movieRoutes);
app.use("/", commentRoutes);
app.use("/", indexRoutes);
app.use("/movies/:id/reviews", reviewRoutes);

app.listen(process.env.PORT || 3000,process.env.IP,function(){
	console.log("listening to the port 3000");
});