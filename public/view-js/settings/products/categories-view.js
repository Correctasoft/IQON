//#region grid populate
$(function () {
  //$('#categorycoloronmenu').ejColorPicker({ value: "#278787",  modelType: "palette", columns: 5});
  var CategorydataManager = ej.DataManager({
    url: "/api/categories",
    //updateUrl : "/admin/system/create",
    //insertUrl : "/admin/system/create",
    //removeUrl : "/admin/system/delete",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#CategoryGrid").ejGrid({
    // the datasource "window.gridData" is referred from jsondata.min.js
    dataSource: CategorydataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completeCategory",
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
        field: "Width",
        headerText: "Width",
        textAlign: ej.TextAlign.Left,
        width: 90,
      },
      {
        field: "FontSize",
        headerText: "Font Size",
        textAlign: ej.TextAlign.Left,
        width: 90,
      },
      {
        field: "ColorOnMenu",
        headerText: "Color On Menu",
        template:
          "<span class='color-box' style='background: {{: ColorOnMenu }}'>&nbsp;</span>",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
        width: 90,
      },
      {
        field: "TextColorOnMenu",
        headerText: "Text Color On Menu",
        template:
          "<span class='color-box' style='background: {{: TextColorOnMenu }}'>&nbsp;</span>",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
        width: 90,
      },
      {
        field: "VisibleOnMenu",
        headerText: "Visible On Menu",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
        width: 90,
      },
    ],
  });
  
  $("#CategoryGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#CategoryTemplate",
    },
  });
});
//#endregion

//#region upon edit or save grid
function completeCategory(args) {
  if (args.requestType == "beginedit") {
    document.getElementById("is-active-category").checked = args.rowData.VisibleOnMenu;    
  }
  else if(args.requestType == "add"){
    document.getElementById("is-active-category").checked = true;
  }
  if (args.requestType == "save") {
    $("#CategoryGrid").ejGrid("refreshContent");
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