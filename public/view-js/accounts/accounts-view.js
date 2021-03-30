//#region grid populate
$(function () {
  var AccountdataManager = ej.DataManager({
    url: "/api/Accounts",
    adaptor: new ej.WebApiAdaptor(),
  });

  $("#AccountGrid").ejGrid({
    // the datasource "window.gridData" is referred from jsondata.min.js
    dataSource: AccountdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    actionComplete: "completeAccount",
    allowFiltering: true,
    allowSorting: true,
    isResponsive: true,
    filterSettings: { filterType: "menu" },
    enableResponsiveRow: false,
    allowScrolling : true,
		scrollSettings: { height: $(window).width() < 1400 ? ($(window).height()-($(window).height()*(15/100))) :($( window ).height()-($( window ).height()*((37*$( window ).height())/937)/100))},  
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
        field: "AccountType.Name",
        headerText: "AccountType",
        textAlign: ej.TextAlign.Left,
        width: 90,
      },
      {
        field: "Credit",
        headerText: "Credit",
        textAlign: ej.TextAlign.Left,
        width: 90,
      },
      {
        field: "Debit",
        headerText: "Debit",
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
      {
        field: "Impact",
        headerText: "DR/CR",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
        width: 90,
      },
    ],
  });

  $("#AccountGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#AccountTemplate",
    },
  });
});
//#endregion

//#region upon edit or save grid
function completeAccount(args) {
  if (args.requestType == "beginedit") {
  } else if (args.requestType == "add") {
    PopulateAccountTypesForAccounts(global_account_types);
  }
  if (args.requestType == "save") {
    $("#AccountGrid").ejGrid("refreshContent");
    PopulateGlobalAccounts();
    populateAccountsforVoucher();
  }
}
//#endregion

PopulateAccountTypesForAccounts = function (data) {
  $("#accounttypeforaccounts").ejDropDownList({
    dataSource: data.Items,
    watermarkText: "Select Account types",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
    change: function (args) {
      document.getElementById(
        "parentaccounttypeobjectforaccounts"
      ).value = JSON.stringify(
        args.model.dataSource.filter((m) => m.id === args.selectedValue)[0]
      );
    },
  });
  $("#accounttypeforaccounts").ejDropDownList({ width: 200 });
};
