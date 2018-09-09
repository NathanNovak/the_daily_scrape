$(document).ready(function() {

	function updateArticles(){
		$.getJSON("/articles").then(function(data) {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				var link = "http://www.tucson.com"+ data[i].link
				// Display the apropos information on the page
				$("#articles").append("<p class='card' data-id='" + data[i]._id + "'><a href="+link+" target='blank'>" + data[i].title + "</a><span><button id='"+data[i]._id+"' class='save'>Save</button><span></p>");
			}
		})
	}

	// function savedArticles(){
	// 	$.getJSON("/saved").then(function(data) {
	// 		console.log(data);
	// 		for (var i = 0; i < data.length; i++) {
	// 			var link = "http://www.tucson.com"+ data[i].link
	// 			// Display the apropos information on the page
	// 			$("#saved-articles").append("<p class='card' data-id='" + data[i]._id + "'><a href="+link+" target='blank'>" + data[i].title + "</a><span><button id='"+data[i]._id+"' class='save'>Save</button><span></p>");
	// 		}
	// 		// var hbsObject = {
	// 		// 	articles: data
	// 		// };
	// 		// console.log("Articles fron DB", hbsObject);
	// 		// $("#articles").text(hbsObject);
	// // 		// })
	// // 		// });
	// 	})
	// }

	$('body').on('click', '.save', function(evt){
		console.log("clicked", evt.target.id);

		$.ajax({
			method: 'GET',
			url: "/saved/"+ evt.target.id
		}).then(function(){
			console.log("Saved")
			location.reload();
		})
	})

	$('body').on('click', '.delete', function(evt){
		console.log("clicked", evt.target.id);

		$.ajax({
			method: 'GET',
			url: "/delete/"+ evt.target.id
		}).then(function(){
			console.log("Deleted")
			location.reload();
		})
	})

	// $('.save-note').on('click', function(evt){
	// 	console.log("clicked", evt);

	// 	$.ajax({
	// 		method: 'POST',
	// 		url: "/articles/"+ evt.target.id
	// 	}).then(function(){
	// 		console.log("Note Added")
	// 		// location.reload();
	// 	})
	// })

	$('#scrape').on('click', function() {
		console.log("Befire")

		$.ajax({
			method: 'GET',
			url: "/scrape"
		}).then(function() {
			console.log("HAHAHA")
			window.location.reload(true);			
		}).catch(function (err) {
			console.log(err);
		})
	})

	$('#note').on('shown.bs.modal', function () {
		$('.save-note').on('click', function(evt){
			// console.log(evt)
			$.ajax({
				method: 'GET',
				url: "/articles/" 
			}).then(function(data){
				// console.log("Note Added", data)
				// location.reload();
			})
		})

		$('')
	})

	$('.addNote').on('click', function (){
		var id = $(this).attr('id');
		$.ajax({
			method: 'GET',
			url: "/articles/" + id 
		}).then(function(data){
			console.log("Note Added", data)
			$('#note-title').html(data.title);
			$('#modal-save').attr('data-id', id)
			$('#modal-title').html(data.note)
			// location.reload();
		})
	})

	$('#modal-save').on('click', function(){
		
		var thisId = $(this).attr("data-id");
		console.log("This Id", thisId);

		$.ajax ({
			method: "POST",
			url: "/articles/" +thisId,
			data: {
				title: $('#note-add-title').val(),
				body: $('#note-body').val()
			}
		}).then(function(data){
			console.log("Saved Note", data);
			$('#note').empty();
			$('#note-add-title').val("")
			$('#note-body').val("")
			location.reload();
		})
	})

	$('.viewNote').on('click', function(){
		var id = $(this).attr('id');
		console.log("VIEW ID", id)
		$.ajax({
			method: 'GET',
			url: "/articles/" +id
		}).then(function(note){
			console.log("NOTES DATA", note.note);
			$('#delete-note').attr('data-id', id)
			$('#view-note-title').html(note.note.title)
			$('#view-note-body').html(note.note.body)
		})
	})


	// having trouble deleting the note
	$('#delete-note').on('click', function (evt){
		// console.log("clicked", evt.target.id);
		var id = $(this).attr('data-id');
		console.log(id);
		$.ajax({
			method: 'GET',
			url: "/articles/"+ id
		}).then(function(data){

			console.log("Note deleted!", data)
			// location.reload();
		})
		
	})

})

