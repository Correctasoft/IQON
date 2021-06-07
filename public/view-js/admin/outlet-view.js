var global_outlet_data = null;

//#region grid populate
$(function () {
  var OutletdataManager = ej.DataManager({
    url: "/admin/api/outlets",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#OutletGrid").ejGrid({
    dataSource: OutletdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: completeOutlet,
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
        field: "City",
        headerText: "City",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
      {
        field: "Address",
        headerText: "Address",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
      {
        field: "Phone",
        headerText: "Phone",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
      {
        field: "Timing",
        headerText: "Timing",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
      {
        field: "GoogleMapUrl",
        headerText: "Google Map Url",
        textAlign: ej.TextAlign.Left,
        width: 90,
      },
    ],
  });

  $("#OutletGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#OutletTemplate",
    },
  });
  
});
//#endregion
let completeOutlet = function (args) {
  if (args.requestType == "beginedit") {
    $('#outletAddress').html(args.rowData.Address);
  }
  else if (args.requestType == "add") {
    
  }
  if (args.requestType == "save") {
    $("#OutletGrid").ejGrid("refreshContent");
  }
}
//#region upon edit or save grid

//#endregion

//#region hide overlay+s
function hidebackdrop() {
  setTimeout(function () {
    $(".modal-backdrop").hide();
  }, 200);
}
//#endregion



