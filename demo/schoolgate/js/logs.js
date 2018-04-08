//--------------清空出入校记录--------------
$("#clear").on("click",function(){
	$("tbody").empty();
});

$("#sata").on("click", function(){
	var success = $('tbody').children('.success').length;
	var danger = $('tbody').children('.danger').length;
	$('#in').html('入校: ' + success);
	$('#out').html('出校: ' + danger);
	console.log(success, danger);
});
