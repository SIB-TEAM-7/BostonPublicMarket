function activateModal() {
    
 }

 window.onload = function(){

 	$('#myModal').modal('toggle');

 }

 function thankYouModal(){
 	console.log("Thank You Modal called");
 	$('#myModal').modal('hide');
 	$('#myModal2').modal('toggle');

 }