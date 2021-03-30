function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//document.getElementById("{{active_tab}}").classList.add('menu-active');

$(".tab-item").click(function () {
  $(".menu-active").removeClass("menu-active");
  this.classList.add("menu-active");
});

function showTab(id) {
  $(".tab-view").hide();
  $("#" + id).show();
}
$(document).ready(function () {
  showTab("tab-vendor");
});
