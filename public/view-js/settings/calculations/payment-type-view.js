$(function () {
  var PaymentTypedataManager = ej.DataManager({
    url: "/api/paymenttypes",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#PaymentTypeGrid").ejGrid({
    dataSource: PaymentTypedataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completePaymentType",
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
  $("#PaymentTypeGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#PaymentTypeTemplate",
    },
  });
});
function completePaymentType(args) {
  if (args.requestType == "beginedit" || args.requestType == "add") {
  }
  if (args.requestType == "save") {
    $("#PaymentTypeGrid").ejGrid("refreshContent");
  }
}
