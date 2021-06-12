var global_SaleCategory_data = null;
function gertSaleCategory_image() {
  var reader = new FileReader();
  var f = document.getElementById("file-select").files;
  reader.onloadend = function () {
    document.getElementById("SaleCategory_image").src = reader.result;
    document.getElementById("SaleCategoryImage").value = reader.result;
  }
  reader.readAsDataURL(f[0]);
}

let populateParentSaleCategoryDropDown = function (data) {
  $("#SaleCategoryParent").ejDropDownList({
    dataSource: data.Items,
    watermarkText: "Select Parent SaleCategory",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
  });
  // $("#SaleCategoryParent").ejDropDownList({width: 100});
};
//#region grid populate
$(function () {
  var SaleCategorydataManager = ej.DataManager({
    url: "/admin/api/salecategories",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#SaleCategoryGrid").ejGrid({
    dataSource: SaleCategorydataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: completeSaleCategory,
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
        template: "<img class='SaleCategory-image' src='\{{: Image }}'>",
        validationRules: { required: true, number: false },
        width: 40,
      },
      {
        field: "Name",
        headerText: "Name",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
      {
        field: "IsFeatured",
        headerText: "Is Featured",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
    ],
  });

  $("#SaleCategoryGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#SaleCategoryTemplate",
    },
  });
  
});
//#endregion
let completeSaleCategory = function (args) {
  if (args.requestType == "beginedit") {
    document.getElementById("SaleCategoryIsFeatured").checked = args.rowData.IsFeatured;
    populateParentSaleCategoryDropDown(global_SaleCategory_data);
    console.log(args.rowData);
    var obj = $("#SaleCategoryParent").data("ejDropDownList");
    if (args.rowData.Parent) {
      obj.selectItemByValue(args.rowData.Parent._id);
    }
  }
  else if (args.requestType == "add") {
    document.getElementById("SaleCategoryIsFeatured").checked = false;
    populateParentSaleCategoryDropDown(global_SaleCategory_data);
  }
  if (args.requestType == "save") {
    $("#SaleCategoryGrid").ejGrid("refreshContent");
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



