var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Review = require("../models/review");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkMovieOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Movie.findById(req.params.id, function(err, foundMovie){
           if(err || !foundMovie){
			   req.flash("error", "Movie not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundMovie.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
			   req.flash("error", "Comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}


middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
				
                res.redirect("back");
            }  else {

                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Movie.findById(req.params.id).populate("reviews").exec(function (err, foundMovie) {
            if (err || !foundMovie) {
                req.flash("error", "Movie not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundMovie.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/movies/" + foundMovie._id);
                }
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;