var mongoose = require("mongoose");

var discSchema = mongoose.Schema({
	mold: String,
	brand: String,
	image: String,
	category: String,
	speed: Number,
	glide: Number,
	turn: Number,
	fade: Number,
	popularity_score: Number,
	popularity_rank: Number,
	buy_url: String
})

module.exports = mongoose.model("Disc", discSchema);