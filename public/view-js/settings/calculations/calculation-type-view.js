$(function () {
  var CalculationTypedataManager = ej.DataManager({
    url: "/api/calculationTypes",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#CalculationTypeGrid").ejGrid({
    dataSource: CalculationTypedataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completeCalculationType",
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
        ej.Grid.ToolBarItems.Edit,
        ej.Grid.ToolBarItems.Delete,
        ej.Grid.ToolBarItems.Update,
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
        field: "Formula",
        headerText: "Formula",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
        width: 90,
      },
      {
        field: "CalculationImpactModule",
        headerText: "Impact Module",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
        width: 90,
      },
    ],
  });
  $("#CalculationTypeGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#CalculationTypeTemplate",
    },
  });
});
function completeCalculationType(args) {
  if (args.requestType == "beginedit" || args.requestType == "add") {
    $.ajax({
      url: "/api/calculationtypes",
      type: "GET",
      success: function (data) {
        var calculationTypeNames = data.Items.map((o) => o.Name).join("\n");
        document.getElementById(
          "calculationtypeforcopy"
        ).value = calculationTypeNames;
        $("#requiredcalculationtypes").ejDropDownList({
          dataSource: data.Items,
          watermarkText: "Select CalculationTypes",
          fields: { text: "Name", value: "_id" },
          enableFilterSearch: true,
          multiSelectMode: "visualmode",
        });
        $("#requiredcalculationtypes").ejDropDownList({ width: "200" });
        var obj = $("#requiredcalculationtypes").data("ejDropDownList");
        if (args.rowData.RequiredCalculationTypes) {
          args.rowData.RequiredCalculationTypes.forEach((element) =>
            obj.selectItemByValue(element)
          );
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
    $.ajax({
      url: "/api/accounttypes/forcalculationtype",
      type: "GET",
      success: function (data) {
        $("#calculationtype-accountype").ejDropDownList({
          dataSource: data,
          watermarkText: "Select AccountType",
          fields: { text: "Name", value: "_id" },
          enableFilterSearch: true,
        });
        $("#calculationtype-accountype").ejDropDownList({ width: "200" });
        var obj = $("#calculationtype-accountype").data("ejDropDownList");
        if (args.rowData.AccountType) {
          obj.selectItemByValue(args.rowData.AccountType);
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
    $("#calculationimpactmodule").ejDropDownList({
      dataSource: [{ name: "Sales" }, { name: "Inventory" }],
      watermarkText: "Select Impact Module",
      fields: { text: "name", value: "name" },
      enableFilterSearch: true,
    });
    $("#calculationimpactmodule").ejDropDownList({ width: "200" });
    var obj = $("#calculationimpactmodule").data("ejDropDownList");
    if (args.rowData.CalculationImpactModule)
      obj.selectItemByValue(args.rowData.CalculationImpactModule);
  }
  if (args.requestType == "save") {
    $("#CalculationTypeGrid").ejGrid("refreshContent");
  }
}
