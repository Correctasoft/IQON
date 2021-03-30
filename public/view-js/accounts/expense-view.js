//#region grid populate
$(function () {
  var ExpensedataManager = ej.DataManager({
    url: "/api/expenses",
    adaptor: new ej.WebApiAdaptor(),
  });

  $("#ExpenseGrid").ejGrid({
    // the datasource "window.gridData" is referred from jsondata.min.js
    dataSource: ExpensedataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completeExpense",
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

  $("#ExpenseGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#ExpenseTemplate",
    },
  });
});
//#endregion
function completeExpense(args) {
  if (args.requestType == "save") {
    $("#ExpenseGrid").ejGrid("refreshContent");
    populateExpenseDropDown();
  }
}

populateExpenseDropDown = function () {
  $.ajax({
    url: "api/expenses",
    type: "GET",
    success: function (data) {
      //Expense DropDown
      $("#expense-expense").ejDropDownList({
        dataSource: data.Items,
        watermarkText: "Select Expense Account",
        fields: { text: "Name", value: "_id" },
        enableFilterSearch: true,
        width: "100%",
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
};


$("#expense-amount").ejNumericTextbox();

$("#expense-pay-button").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  click: function (args) {
    payExpense();
  },
});
populateExpenseDropDown();

function payExpense() {
  var postObject = {
    PaymentType: $("#expense-payment-type").val(),
    ExpenseAccount: $("#expense-expense").val(),
    PaymentValue: $("#expense-amount").val(),
    Date: new Date(),
  };
  showLoader();
  $.post("/api/expenses/pay", postObject, function (data, status) {
    hideLoader();
    $("#ExpenseGrid").ejGrid("refreshContent");
  });
  return 0;
}
