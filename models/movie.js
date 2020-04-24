var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
	 reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
	director: String,
	actors: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Movie",movieSchema);

