var express 		= require("express"),
	app				= express(),
	request			= require("request"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	methodOverride 	= require("method-override"),
	passport 		= require("passport"),
	LocalStrategy	= require("passport-local"),
	Pro 			= require("./models/pro"),
	ProDisc 		= require("./models/prodisc"),
	Disc			= require("./models/disc"),
	Admin			= require("./models/admin");

// APP CONFIG
//mongoose.connect("mongodb://localhost/discsinthebag", { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://admin:Cf6ibPTGKtpAHvK3@cluster0-uywm1.mongodb.net/discsinthebag?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
}).then(() => {
		console.log("Database connected!");
}).catch(err => {
	console.log("Error: ", err.message);
})
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Lilies in the growler",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// pass user data to every template, rather than adding {currentUser: req.user} to every render line
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// Seed admin user
// var newUser = new Admin({
// 	username: "admin",
// 	password: "i8w6FpvA^rbt",
// 	admin: true
// });
// Admin.register(newUser, newUser.password, function(err, user){
// 	if(err) {
// 		console.log(err.message);
// 	}
// 	passport.authenticate("local")(req,res, function(){
// 		console.log("User added and authenticated: " + user);
// 	})
// })
				
//==============					
// PROS ROUTES
//==============
// Pros Index Route
app.get("/", function(req, res){
	res.redirect("/pros");
})

app.get("/pros", function(req, res){
	//get all pros
	Pro.find({}, function(err, allPros){
		if(err){
			console.log(err);
		} else {
			res.render("pros/index", {pros:allPros});
		}
	})
})

// Pros New Route
app.get("/pros/new", isLoggedIn, function(req,res) {
	res.render("pros/new");
})

// Pros Show Route
app.get("/pros/:url_name", function (req,res){
	Pro.findOne({url_name: req.params.url_name}).populate({path : 'pro_discs', populate : {path : 'disc.id'}}).exec(function(err, foundPro){
		if (err) {
			console.log(err);
		} else {
			res.render("pros/show", {pro: foundPro});
		}
	})
})

// Pros Create Route
app.post("/pros", isLoggedIn, function(req, res) {
	var name = req.body.name;
	var url_name = req.body.url_name;
	var image = req.body.image;
	var rank = req.body.rank;
	var gender = req.body.gender;
	var sponsor = req.body.sponsor;
	var last_bag_update = req.body.last_bag_update;

	var newPro = {name: name, url_name: url_name, image: image, rank: rank, gender: gender, sponsor: sponsor, last_bag_update: last_bag_update};
	
	Pro.create(newPro, function(err, pro){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/pros");
		}
	})
})

// Pros Edit & Update Routes 
app.get("/pros/:url_name/edit", isLoggedIn, function(req, res){
	Pro.findOne({url_name: req.params.url_name}, function(err, foundPro){
		res.render("pros/edit", {pro: foundPro});
	})
})

app.put("/pros/:url_name", isLoggedIn, function(req, res) {
	Pro.findOneAndUpdate({url_name: req.params.url_name}, req.body.pro, function(err, updatedPro){
		if (err) {
			res.redirect("/pros");
		}
		res.redirect("/pros/" + req.params.url_name)
	})
})

//============
// PRO DISC ROUTES
//============
// Prodisc new & create routes - accessible from pro show page
app.get("/pros/:url_name/prodiscs/new", isLoggedIn, function(req,res) {
	Pro.findOne({url_name: req.params.url_name}, function(err, foundPro){
		Disc.find({}, function(err, foundDiscs){
			res.render("prodiscs/new", {pro: foundPro, discs: foundDiscs});
		})
	})
})

app.post("/pros/:url_name/prodiscs", isLoggedIn, function(req, res){
	var plastic = req.body.plastic;
	var weight = req.body.weight;
	var buy_url = req.body.buy_url;
	var newProDisc = {plastic: plastic, weight: weight, buy_url: buy_url}
	ProDisc.create(newProDisc, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
			// find discid of created disc and add it to prodisc object
			Disc.findById(req.body.disc_id, function(err, foundDisc) {
				if(err){
					console.log(err);
				} else {
					newlyCreated.disc.id = foundDisc._id;
					newlyCreated.save();
					//find pro and push to their record
					Pro.findOne({url_name: req.params.url_name}, function(err, foundPro) {
						if(err){
							console.log(err);
						} else {
							foundPro.pro_discs.push(newlyCreated);
							foundPro.save();
							res.redirect("/pros/"+req.params.url_name);
						}
					});
				}
			});
		}
	});
});
	
// Prodisc destroy route
app.delete("/pros/:url_name/prodiscs/:id", isLoggedIn, function(req,res) {
	ProDisc.deleteOne({_id: req.params.id}, function(err){
		res.redirect("/pros/" + req.params.url_name);
	})
})



//============
// DISC ROUTES
//============
// Disc Index Route
app.get("/discs", function(req, res){
	updateAllPopScores();
	//get all discs
	Disc.find({}, function(err, allDiscs){
		if(err){
			console.log(err);
		} else {
			res.render("discs/index", {discs:allDiscs});
		}
	})
})

// Discs New Route
app.get("/discs/new", isLoggedIn, function(req,res) {
	res.render("discs/new");
})

// Disc Show Route
app.get("/discs/:mold", function(req, res){
	
	updateAllPopScores();

	Disc.findOne({mold: req.params.mold}, function(err, foundDisc){
		if (err) {
			console.log(err);
		} else {	
			// find pros
			Pro.find({}).populate({path : 'pro_discs', populate : {path : 'disc.id'}}).exec(function(err, allPros){				
				// render show page and pass through pros and disc
				res.render("discs/show", {disc: foundDisc, pros: allPros});
			})
		}
	})
})

// Discs Create Route
app.post("/discs", isLoggedIn, function(req, res) {
	var mold = req.body.mold;
	var brand = req.body.brand;
	var image = req.body.image;
	var category = req.body.category;
	var speed = req.body.speed;
	var glide = req.body.glide;
	var turn = req.body.turn;
	var fade = req.body.fade;
	var popularity_score = req.body.popularity_score;
	var buy_url = req.body.buy_url;

	var newDisc = {mold: mold, brand: brand, image: image, category: category, speed: speed, glide: glide, turn: turn, fade: fade, popularity_score: popularity_score, buy_url: buy_url};
	
	Disc.create(newDisc, function(err, disc){
		if(err) {
			console.log(err);
		} else {
			console.log("New disc created:");
			console.log(disc);
			res.redirect("/discs");
		}
	})
})

// Discs Edit & Update Routes 
app.get("/discs/:mold/edit", isLoggedIn, function(req, res){
	Disc.findOne({mold: req.params.mold}, function(err, foundDisc){
		res.render("discs/edit", {disc: foundDisc});
	})
})

app.put("/discs/:mold", isLoggedIn, function(req, res) {
	Disc.findOneAndUpdate({mold: req.params.mold}, req.body.disc, function(err, updatedDisc){
		if (err) {
			res.redirect("/discs");
		}
		res.redirect("/discs/" + req.params.mold)
	})
})

//============
// ABOUT ROUTES
//============
app.get("/about", function(req, res){
	res.render("about");
})

//============
// AUTH ROUTES
//============

// SHOW LOGIN FORM
app.get("/login", function(req, res){
	res.render("login");
})

// HANDLE LOGIN
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/pros",
		failureRedirect: "/login"
	}), function(req, res){
})

// HANDLE LOGOUT
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/pros");
})

// LOGIN MIDDLEWARE
function isLoggedIn(req, res, next){
	if(req.isAuthenticated() && req.user.admin){
		console.log("there is a logged in admin user")
		return next();
	}
	res.redirect("/login");
}

//============
// OTHER FUNCTIONS
//============

function calculatePopScore(proRank) {
	var popScore = 0;
	switch (proRank) {
		case 1: popScore = 20;
		break;

		case 2: popScore = 15;
		break;

		case 3: popScore = 12;
		break;

		case 4: popScore = 10;
		break;

		case 5: popScore = 8;
		break;

		case 6: popScore = 6;
		break;

		case 7: popScore = 5;
		break;

		case 8: popScore = 4;
		break;

		case 9: popScore = 3;
		break;

		case 10: popScore = 2;
		break;
			
		default: popScore = 1;
	}
	return popScore;
}

async function updateAllPopScores(){
	try {
		//reset disc popularity scores
		await Disc.find({}, function(err, allDiscs){
			if(err){
				console.log(err);
			} else {
				allDiscs.forEach(function(disc){
					disc.popularity_score = 0;
					disc.save();
				})
			}
		})
		
		//find all pros, prodiscs, discs, and update disc pop scores
		await Pro.find({}).populate({path : 'pro_discs', populate : {path : 'disc.id'}}).exec(function(err, foundPros){
			if(err){
				console.log(err);
			} else {
				//for each pro, find all pro discs
				foundPros.forEach(function(pro){
					// for each prodisc, find the disc and add a number to its pop score based on pro ranking
					pro.pro_discs.forEach(function(proDisc){
						proDisc.disc.id.popularity_score += calculatePopScore(pro.rank);
						proDisc.disc.id.save();
					})			  
				})
			}
		})
	} catch (err) {
		console.log(err);
	}
}

// RUN SERVER
app.listen(process.env.PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
// app.listen(3000, function() {
// 	console.log("Discsinthebag server is running...")
// })