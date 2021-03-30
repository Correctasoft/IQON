//#region grid populate
$(function () {
  var SalarydataManager = ej.DataManager({
    url: "/api/salarys",
    adaptor: new ej.WebApiAdaptor(),
  });

  $("#SalaryGrid").ejGrid({
    // the datasource "window.gridData" is referred from jsondata.min.js
    dataSource: SalarydataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completeSalary",
    allowFiltering: true,
    allowSorting: true,
    isResponsive: true,
    filterSettings: { filterType: "menu" },
    enableResponsiveRow: false,
    editSettings: {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      editMode: ej.Grid.EditMode.Dialog,
    },
    toolbarSettings: {
      showToolbar: true,
      toolbarItems: [
        ej.Grid.ToolBarItems.Add,
        ej.Grid.ToolBarItems.Cancel,
        ej.Grid.ToolBarItems.Search,
      ],
    },
    columns: [
      {
        field: "_id",
        isPrimaryKey: true,
        visible: false,
        headerText: "_id",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 20,
      },
      {
        field: "Name",
        headerText: "Name",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
        width: 90,
      },
      {
        field: "Balance",
        headerText: "Balance",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
        width: 90,
      },
    ],
  });

  $("#SalaryGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#SalaryTemplate",
    },
  });
});
//#endregion
function completeSalary(args) {
  if (args.requestType == "save") {
    $("#SalaryGrid").ejGrid("refreshContent");
    populateSalaryDropDown();
  }
}

populateSalaryDropDown = function () {
  $.ajax({
    url: "api/salarys",
    type: "GET",
    success: function (data) {
      //Salary DropDown
      if (data.Count!=0) {
        $("#salary-salaryaccount").ejDropDownList({
          dataSource: data.Items,
          watermarkText: "Select Salary Account",
          fields: { text: "Name", value: "_id" },
          enableFilterSearch: true,
          width: "100%"
        });
      }
      else{
        $("#salary-salaryaccount").ejDropDownList({
          watermarkText: "Select Salary Account",
          enableFilterSearch: true,
          width: "100%"
        });
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}



$("#salary-amount").ejNumericTextbox();

$("#salary-pay-button").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  click: function (args) {
    paySalary();
  },
});

$("#salary-month").ejDatePicker({
  width: "100%",
  value: new Date(),
  startLevel: ej.DatePicker.Level.Year,
  dateFormat: "dd MMM yyyy",
});
populateSalaryDropDown();

function paySalary() {
  var postObject = {
    PaymentType: $("#salary-payment-type").val(),
    SalaryAccount: $("#salary-salaryaccount").val(),
    PaymentValue: $("#salary-amount").val(),
    Date: $("#salary-month").val(),
  }
  showLoader();
  $.post("/api/salarys/pay", postObject, function (data, status) {
    hideLoader();
    $("#SalaryGrid").ejGrid("refreshContent");
  });
  return 0;
}