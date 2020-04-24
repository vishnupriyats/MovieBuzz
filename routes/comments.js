var express = require("express");
var router  = express.Router({mergeParams: true});
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new routes

router.get("/movies/:id/comments/new",middleware.isLoggedIn,function(req,res){
	
	Movie.findById(req.params.id,function(err,foundMovie){
		if (err){
			res.redirect("back");
		}
		else{
			res.render("comments/new", {movie: foundMovie});
		}
	})
})

//create routes

router.post("/movies/:id/comments",middleware.isLoggedIn,function(req,res){
	Movie.findById(req.params.id, function(err,foundMovie){
       if(err){
           console.log(err);
           res.redirect("back");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               foundMovie.comments.push(comment);
               foundMovie.save();
			   req.flash("success", "Successfully added comment");
               res.redirect('/movies/'+foundMovie._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/movies/:id/comments/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {movie_id: req.params.id, comment: foundComment});
      }
   });
});


// COMMENT UPDATE
router.put("/movies/:id/comments/:comment_id",  middleware.checkCommentOwnership,function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/movies/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/movies/:id/comments/:comment_id",  middleware.checkCommentOwnership,function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
		    req.flash("success", "Comment deleted");
           res.redirect("/movies/" + req.params.id);
       }
    });
});



module.exports = router;
