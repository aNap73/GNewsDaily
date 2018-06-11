// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  console.log('pagejs run');
   $(".remove-log").on("click", function(event) {    
    //var id = $(this).data("id");
     
    
    // Send the PUT request.
    $.ajax("/api/burgers/", {
      type: "DELETE"
    }).then(
      function() {
        console.log("DELETED");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
  
  $(".remove-eaten").on("click", function(event) {    
    var id = $(this).data("id");
     
    
    // Send the PUT request.
    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("DELETED");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });


  $(".change-eaten").on("click", function(event) {    
    var id = $(this).data("id");
    var newDEVOURED = $(this).data("neweaten");   
    var newDEVOUREDSTATE = {
      DEVOURED: 1
    };

 
    
    // Send the PUT request.
    $.ajax("/api/burgers/" + id, {
      type: "PUT",
      data: newDEVOUREDSTATE
    }).then(
      function() {
        console.log("changed DEVOURED to", newDEVOURED);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = {
      BURGER_NAME: $("#burg").val().trim(),
      DEVOURED: $("[name=DEVOURED]:checked").val().trim()
    };
  
    // Send the POST request.
    $.ajax("/api/burgers", {
      type: "POST",
      data: newBurger
    }).then(
      function() {
        console.log("created new burger");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
 });
