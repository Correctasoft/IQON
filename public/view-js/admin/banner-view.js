var global_banner_data = null;
function gertbanner_image() {
  var reader = new FileReader();
  var f = document.getElementById("file-select").files;
  reader.onloadend = function () {
    document.getElementById("banner_image").src = reader.result;
    document.getElementById("bannerImage").value = reader.result;
  }
  reader.readAsDataURL(f[0]);
}

//#region grid populate
$(function () {
  var BannerdataManager = ej.DataManager({
    url: "/admin/api/banners",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#BannerGrid").ejGrid({
    dataSource: BannerdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: completeBanner,
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
        field: "Image",
        headerText: "Image",
        textAlign: ej.TextAlign.Center,
        template: "<img class='banner-image' src='\{{: Image }}'>",
        validationRules: { required: true, number: false },
        width: 60,
      },
      {
        field: "Title",
        headerText: "Title",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
      {
        field: "Url",
        headerText: "Redirect Url",
        textAlign: ej.TextAlign.Left,
        width: 90,
      },
      {
        field: "Order",
        headerText: "Order",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
    ],
  });

  $("#BannerGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#BannerTemplate",
    },
  });
  
});
//#endregion
let completeBanner = function (args) {
  if (args.requestType == "beginedit") {
   
  }
  else if (args.requestType == "add") {
    
  }
  if (args.requestType == "save") {
    $("#BannerGrid").ejGrid("refreshContent");
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



