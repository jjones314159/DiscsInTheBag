if(!filterString){
	var filterString = {
	brand_filter: "All",
	category_filter: "All"
	}
}



if (document.querySelector('.discs-index-container')){
	var discsContainer = document.querySelector('.discs-index-container');

	var mixer = mixitup(discsContainer, {
		selectors: {
			control: '.mixitup-control'
	}});

	// brand dropdown menu for filter controls on discs show page
	 $(function(){

		$(".brand-dropdown button").click(function(){
		
		  // set text and value of button to selection
		  $(".brand-filter:first-child").text($(this).text());
		  $(".brand-filter:first-child").val($(this).text());
		
		  // update filter string with the value of the pressed button
		  filterString.brand_filter = this.value;
		  filterDiscs();
		  updateSessionStorage();
	   });
	});

	// category dropdown menu for filter controls on discs show page
	 $(function(){

		$(".category-dropdown button").click(function(){

		  // set text and value of button to selection
		  $(".category-filter:first-child").text($(this).text());
		  $(".category-filter:first-child").val($(this).text());
			
		  // update filter string with the value of the pressed button
		  filterString.category_filter = this.value;
		  filterDiscs();
		  updateSessionStorage();
	   });
	});
	
	// set filters on load to whatever the person was using
	$(function(){
		var str1 = "[value='" + sessionStorage.getItem('brandFilter') + "']";
		var str2 = "[value='" + sessionStorage.getItem('categoryFilter') + "']";
		$('div.brand-dropdown button').filter(str1).click();
		$('div.category-dropdown button').filter(str2).click();	
	})
	
}


// Nav bar active link mgmt
$(document).ready(function() {
  
	// nav bar active link
	$('li.active').removeClass('active');
  	$('a[href="/' + location.pathname.split("/")[1] + '"]').closest('li').addClass("active");	
  
	// card hover effect - pros
	  $('.pro-card a div.card' ).hover(
	  function() {
		$(this).addClass('shadow').css('cursor', 'pointer'); 
	  }, function() {
		$(this).removeClass('shadow');
	  }
	);
  	
	// card hover effect - discs
	  $('.disc-card a div.card' ).hover(
	  function() {
		$(this).find('div h5.card-title').addClass('disc-hover').css('cursor', 'pointer'); 
	  }, function() {
		$(this).find('div h5.card-title').removeClass('disc-hover');
	  }
	);
	

  
});

function filterDiscs() {
	
	var allDiscs = document.querySelectorAll('.mix');
	
	// show all discs
	allDiscs.forEach(function (disc){
		disc.classList.remove('hidden');
	})
	
	// hide discs based on brand filter
	var brandFilterString = filterString.brand_filter;
	if (brandFilterString != "All") {
		allDiscs.forEach(function (disc){
			if (!disc.classList.contains(brandFilterString)){
				disc.classList.add('hidden');
			}
		})
	}
	
	// hide discs based on category filter	
	var categoryFilterString = filterString.category_filter;
	if (categoryFilterString != "All") {
		allDiscs.forEach(function (disc){
			if (!disc.classList.contains(categoryFilterString)){
				disc.classList.add('hidden');
			}
		})
	}
}

// for keeping track of filter settings even when leaving the page
function updateSessionStorage(){
	sessionStorage.setItem("brandFilter",filterString.brand_filter);
	sessionStorage.setItem("categoryFilter",filterString.category_filter);
}




