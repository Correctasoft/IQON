$(function () {
  var MeasurementUnitdataManager = ej.DataManager({
    url: "/api/measurementunits",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#MeasurementUnitGrid").ejGrid({
    dataSource: MeasurementUnitdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completeMeasurementUnit",
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
  $("#MeasurementUnitGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#MeasurementUnitTemplate",
    },
  });
});
function completeMeasurementUnit(args) {
  if (args.requestType == "beginedit" || args.requestType == "add") {
  }
  if (args.requestType == "save") {
    $("#MeasurementUnitGrid").ejGrid("refreshContent");
  }
}
