var mongoose = require("mongoose");

var proSchema = mongoose.Schema({
	name: String,
	url_name: String,
	image: String,
	image_credit: String,
	rank: Number,
	gender: String,
	sponsor: String,
	last_bag_update: String,
	pro_discs: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "ProDisc"
      }
   ]
})

module.exports = mongoose.model("Pro", proSchema);