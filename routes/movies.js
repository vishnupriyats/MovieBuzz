var express = require("express");
var router  = express.Router();
var Movie = require("../models/movie");
var Review = require("../models/review");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//index route
router.get("/movies",function(req,res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Movie.find({title: regex}, function(err, allMovies){
           if(err){
               console.log(err);
           } else {
              if(allMovies.length < 1) {
                  noMatch = "No movies matched, please try again.";
              }
              res.render("movies/index",{movies:allMovies, noMatch: noMatch});
           }
        });
    } else {
	Movie.find({},function(err,movies){
		if(err){console.log(err)}
		else{
			res.render("movies/index",{movies: movies,noMatch: noMatch});
		}
	});
}
});

//new route
router.get("/movies/new", middleware.isLoggedIn,function(req, res){
   res.render("movies/new"); 
});

//create route

router.post("/movies",middleware.isLoggedIn,function(req,res){
	
	var title = req.body.title;
    var image = req.body.image;
	var dir = req.body.director;
    var desc = req.body.description;
	var actors= req.body.actors;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newMovie = {title: title, image: image, director: dir,actors: actors,description: desc, author:author}
	Movie.create(newMovie,function(err,movie){
	if(err){console.log(err);}
	else{
		 req.flash("success", "Successfully added a movie");
		res.redirect("/movies");
	}
});
		
});


//show route
router.get("/movies/:id", function(req, res){
    //find the movie with provided ID
    Movie.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            //render show template with that movie
            res.render("movies/show", {movie: foundMovie});
        }
    });
});

// EDIT ROUTE
router.get("/movies/:id/edit", middleware.checkMovieOwnership ,function(req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
		// console.log(foundMovie)
        res.render("movies/edit", {movie: foundMovie});
    });
});

//UPDATE ROUTE
router.put("/movies/:id",  middleware.checkMovieOwnership,function(req, res){
	delete req.body.movie.rating;
    // find and update the correct movie
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedCampground){
       if(err){
           res.redirect("/movies");
       } else {
           //redirect somewhere(show page)
           res.redirect("/movies/"+req.params.id);
       }
    });
});



// DESTROY ROUTE
router.delete("/movies/:id", middleware.checkMovieOwnership, function (req, res) {
    Movie.findById(req.params.id, function (err, movie) {
        if (err) {
            res.redirect("/movies");
        } else {
            // deletes all comments associated with the movie
            Comment.remove({"_id": {$in: movie.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/movies");
                }
                // deletes all reviews associated with the movie
                Review.remove({"_id": {$in: movie.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/movies");
                    }
                    //  delete the movie
                    movie.remove();
                    req.flash("success", "Movie deleted successfully!");
                    res.redirect("/movies");
                });
            });
        }
    });
});


function escapeRegex(text) 
{
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;
