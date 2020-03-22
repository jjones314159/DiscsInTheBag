$(document).ready(function() {
  
	// nav bar active link
	$('li.active').removeClass('active');
  	$('a[href="/' + location.pathname.split("/")[1] + '"]').addClass("active");
	console.log(location.pathname.split("/")[1])
	
  
	// card hover effect
	  $( ".card" ).hover(
	  function() {
		$(this).addClass('shadow-lg').css('cursor', 'pointer'); 
	  }, function() {
		$(this).removeClass('shadow-lg');
	  }
	);
  

});
