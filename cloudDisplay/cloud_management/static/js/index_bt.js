$("#button").mousedown(function() {
  $("#top").addClass("top-click");
  $("#body").addClass("body-click");
  $("body").addClass("pulse-bg");
  $.ajax({
    url: "attackStart",
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data[0]);
    }
  })

  setTimeout(function(){
    $.ajax({
      url:'defenceStart',
      type:"GET",
      dataType:"json",
      success: function (data) {
        console.log("5s later")
      }
    })  
  }, 5000)
});

$("#button").mouseup (function() {
  $("#top").removeClass("top-click");
  $("#body").removeClass("body-click");
  $("body").removeClass("pulse-bg");
});