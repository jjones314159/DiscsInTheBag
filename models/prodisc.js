var mongoose = require("mongoose");

var prodiscSchema = mongoose.Schema({
	disc: {
        id: {
			type: mongoose.Schema.Types.ObjectId,
         	ref: "Disc"
		}
    },
	plastic: String,
	weight: Number,
	buy_url: String
})

module.exports = mongoose.model("ProDisc", prodiscSchema);