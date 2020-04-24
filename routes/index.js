var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


//landing page
router.get("/",function(req,res)
	   {
	res.render("landing");
});


//sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username,
						   email:req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
           req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to MovieBuzz " + user.username);
           res.redirect("/movies"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});


// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/movies",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

//middleware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("success", "Logged you out!");
    res.redirect("/login");
}

module.exports = router;
