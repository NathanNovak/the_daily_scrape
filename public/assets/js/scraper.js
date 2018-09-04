$(document).ready(function() {

	function updateArticles(){
		$.getJSON("/articles").then(function(data) {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				var link = "http://www.tucson.com"+ data[i].link
				// Display the apropos information on the page
				$("#articles").append("<p class='card' data-id='" + data[i]._id + "'><a href="+link+" target='blank'>" + data[i].title + "</a><span><button id='"+data[i]._id+"' class='save'>Save</button><span></p>");
			}
			// var hbsObject = {
			// 	articles: data
			// };
			// console.log("Articles fron DB", hbsObject);
			// $("#articles").text(hbsObject);
	// 		// })
	// 		// });
		})
	}

	$('body').on('click', '.save', function(evt){
		console.log("clicked", evt.target.id);

		$.ajax({
			method: 'GET',
			url: "/saved/"+ evt.target.id
		}).then(function(){
			console.log("Saved")
		})
	
	})

	$('#scrape').on('click', function() {

		$.ajax({
			method: 'GET',
			url: "/scrape"
		}).then(function() {
			
			updateArticles();
			
		})
	})
})

