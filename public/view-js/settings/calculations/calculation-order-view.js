let calculationOrder = [];
CalculationOrderSaveButtonClicked = async () => {
  var target = $("#selectskills").data("ejListBox");
  var newdata = target.element.children("li:not('.e-ghead')");
  var items = [];

  for (let i = 0; i < newdata.length; i++) {
    var item = { Order: i + 1, Name: newdata[i].innerText };
    await items.push(item);
  }
  let PostObject = {
    OrderRegister: items,
  };
  $.post(
    "/api/calculationorders/" +
      document.getElementById("calculationorderimpactmodule").value,
    PostObject,
    function (data, status) {}
  );
};
$("#button11").ejButton({
  size: "normal",
  click: "Moveup",
  width: "107px",
  showRoundedCorner: true,
});
$("#button12").ejButton({
  size: "normal",
  click: "Movedown",
  width: "107px",
  showRoundedCorner: true,
});
$("#CalculationOrderSaveButton").ejButton({
  size: "normal",
  click: "CalculationOrderSaveButtonClicked",
  width: "107px",
  showRoundedCorner: true,
});
function datsourcechange() {
  var target = $("#selectskills").data("ejListBox");
  var newdata = target.element.children("li:not('.e-ghead')");
  var items = [];
  $(newdata).each(function () {
    var item = { Name: $(this).text() };
    items.push(item);
  });
  target.setModel({ dataSource: items });
  return target.model.dataSource;
}
function Moveup(e) {
  var target = $("#selectskills").data("ejListBox");
  target.moveUp();
  datsourcechange();
}
function Movedown(e) {
  var target = $("#selectskills").data("ejListBox");
  target.moveDown();
  datsourcechange();
}
$("#calculationorderimpactmodule").ejDropDownList({
  dataSource: [{ name: "Sales" }, { name: "Inventory" }],
  watermarkText: "Select Impact Module",
  fields: { text: "name", value: "name" },
  enableFilterSearch: true,
  change: function (args) {
    showLoader();
    $.ajax({
      url:
        "/api/calculationtypes/getcalculationsforimpacttype/" +
        args.selectedValue,
      type: "GET",
      success: function (data) {
        $("#selectskills").ejListBox({
          dataSource: data.Items,
          fields: { text: "Name" },
        });
        document.getElementById("CalculationOrderSaveButton").style.display =
          "block";
        hideLoader();
      },
      error: function (error) {
        console.log(error);
      },
    });
  },
});
$("#calculationorderimpactmodule").ejDropDownList({ width: "200" });
$("#sampleProperties").ejPropertiesPanel();
