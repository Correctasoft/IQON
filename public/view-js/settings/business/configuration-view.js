$(function () {
});

UpdateConfigurationButtonClicked = function () {
  PostObject = {
    OrganizationName: document.getElementById("OrganizationName").value,
    OrganizationAddress: document.getElementById("OrganizationAddress").value,
    OrganizationPhone: document.getElementById("OrganizationPhone").value,
    directprintinvoice: document.getElementById("direct-print-invoice").checked,
    showdiscounttk: document.getElementById("show-discount-tk").checked,
    showdiscountpercentage: document.getElementById("show-discount-percentage").checked,
    allownegativestock: document.getElementById("allow-negative-stock").checked,
    showdeliverycharge: document.getElementById("show-delivery-charge").checked,
    calculationincluded: document.getElementById("is-calculation-included")
      .checked,
    workdurationwisecalculation: document.getElementById(
      "work-duration-wise-calculation"
    ).checked,
    activateunitconversion : document.getElementById("activate-unit-conversion").checked,
  };
  showLoader();
  $.post("/api/configuration/", PostObject, function (data, status) {
    console.log(PostObject);
    hideLoader();
    showSnackBar("Configuration Saved Successfully...");
  });
};

$("#UpdateConfigurationButton").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});
