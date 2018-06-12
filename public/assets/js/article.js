// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  console.log('pagejs run');
  $("#btnNote").on("click", function(event){
    console.log('click');
    
    let title = $("#TitleData").text();
    let datanote = $("#innote").val();
    
    $("#innote").val('');
    
    // Send the POST request.
    $.ajax({
      type: "POST",
      url:"/api/note/save",
      data:{Title: title,
            DataNote: datanote}
    }).then(
      function() {
        console.log("SAVED");
        // Reload the page to get the updated list
        location.reload();
      }
    );

  });
    
    
  });
  
 
