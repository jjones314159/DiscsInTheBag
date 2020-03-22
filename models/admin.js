var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AdminSchema = new mongoose.Schema({
	username: String,
	password: String,
	admin: Boolean
});

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", AdminSchema)