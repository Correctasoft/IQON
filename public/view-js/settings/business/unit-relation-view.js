let global_units = [];
$(function () {
  loadUnits();
  var UnitRelationdataManager = ej.DataManager({
    url: "/api/unitrelations",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#UnitRelationGrid").ejGrid({
    dataSource: UnitRelationdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completeUnitRelation",
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
    ],
  });
  $("#UnitRelationGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#UnitRelationTemplate",
    },
  });
});
function completeUnitRelation(args) {
  if (args.requestType == "beginedit" || args.requestType == "add") {
    $("#baseunit").ejDropDownList({
      dataSource: global_unit_relations,
      watermarkText: "Select Calculation types",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
      change: function (args) {
        $("#baseunitname").val(args.selectedText);
      },
    });
    $("#baseunit").ejDropDownList({ width: 300 });
    var obj = $("#baseunit").data("ejDropDownList");
    if (args.rowData.BaseUnit) {
      obj.selectItemByValue(args.rowData.BaseUnit);
    }

    $("#transactionunit").ejDropDownList({
      dataSource: global_unit_relations,
      watermarkText: "Select Calculation types",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
      change: function (args) {
        $("#transactionunitname").val(args.selectedText);
      },
    });
    $("#transactionunit").ejDropDownList({ width: 300 });
    var obj = $("#transactionunit").data("ejDropDownList");
    if (args.rowData.TransactionUnit) {
      obj.selectItemByValue(args.rowData.TransactionUnit);
    }
  }
  if (args.requestType == "save") {
    $("#UnitRelationGrid").ejGrid("refreshContent");
  }
}

let loadUnits = function () {
  $.ajax({
    url: "/api/measurementunits",
    type: "GET",
    success: function (data) {
      global_unit_relations = data.Items;
    },
    error: function (error) {
      console.log(error);
    },
  });
};
