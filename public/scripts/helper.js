var helper = {};


// for adding ordinal suffix to pop ranks
helper.ordinal_suffix_of = function(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

// categorizes stability for discs index stability filter
helper.categorizeStability = function(disc) {
	var stability = disc.turn + disc.fade;
	if (stability > 1) {
		return "Overstable";
	}	
	if (stability == 0 || (stability > -1 && stability < 1)) {
		return "Stable";
	}
	if (stability == -1) {
		return "Stable Understable";
	}	
	if (stability == 1) {
		return "Stable Overstable";
	}	
	if (stability < -1) {
		return "Understable";
	}
}

module.exports = helper;