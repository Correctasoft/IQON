//#region grid populate

$(function () {
  var AccountTypedataManager = ej.DataManager({
    url: "/api/accounttypes",
    adaptor: new ej.WebApiAdaptor(),
  });

  $("#AccountTypeGrid").ejGrid({
    // the datasource "window.gridData" is referred from jsondata.min.js
    dataSource: AccountTypedataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    actionComplete: "completeAccountType",
    allowFiltering: true,
    allowSorting: true,
    isResponsive: true,
    filterSettings: { filterType: "menu" },
    enableResponsiveRow: false,
    allowScrolling: true,
    scrollSettings: { height: $(window).width() < 1400 ? ($(window).height()-($(window).height()*(15/100))) :($( window ).height()-($( window ).height()*((37*$( window ).height())/937)/100)) },
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
        field: "ParentAccountType.Name",
        headerText: "Parent",
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

  $("#AccountTypeGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#AccountTypeTemplate",
    },
  });
});
//#endregion

//#region upon edit or save grid
function completeAccountType(args) {
  if (args.requestType == "beginedit") {
    populateAccountTypeForAccountType(global_account_types);
  } else if (args.requestType == "add") {
    console.log("dhukse");
    populateAccountTypeForAccountType(global_account_types);
  }
  if (args.requestType == "save") {
    $("#AccountTypeGrid").ejGrid("refreshContent");
  }
}
//#endregion

//#region hide overlay+s
function hidebackdrop() {
  setTimeout(function () {
    $(".modal-backdrop").hide();
  }, 200);
}
//#endregion
populateAccountTypeForAccountType = function (data) {
  $("#parentaccounttype").ejDropDownList({
    dataSource: data.Items,
    watermarkText: "Select Parent Account types",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
  });
  $("#parentaccounttype").ejDropDownList({ width: 200 });
};
