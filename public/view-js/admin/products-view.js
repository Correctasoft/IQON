var global_Product_data = null;

function gertProduct_image() {
  var reader = new FileReader();
  var f = document.getElementById("file-select").files;
  reader.onloadend = function () {
    document.getElementById("Product_image").src = reader.result;
    document.getElementById("ProductImage").value = reader.result;
  }
  reader.readAsDataURL(f[0]);
}

function gertProduct_image1() {
  var reader = new FileReader();
  var f = document.getElementById("file-select1").files;
  reader.onloadend = function () {
    document.getElementById("Product_image1").src = reader.result;
    document.getElementById("ProductImage1").value = reader.result;
  }
  reader.readAsDataURL(f[0]);
}

let populateParentProductDropDown = function (data) {
  $("#ProductCategory").ejDropDownList({
    dataSource: data.Items,
    watermarkText: "Select Parent Product",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
    width : "100%"
  });
  // $("#ProductParent").ejDropDownList({width: 100});
};

let getCategories = function () {
  $.ajax({
    url: "/admin/api/categories/",
    type: "GET",
    success: function (data) {
      global_Product_data = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//#region grid populate
$(function () {
  getCategories();

  var ProductdataManager = ej.DataManager({
    url: "/admin/api/products",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
    headers: [{ 'Authenticcation': 'bearer123' }]
  });

  $("#ProductGrid").ejGrid({
    dataSource: ProductdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: completeProduct,
    allowFiltering: true,
    allowSorting: true,
    isResponsive: true,
    filterSettings: { filterType: "menu" },
    enableResponsiveRow: false,
    pageSettings: { pageSize: 6},
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
        field: "MainImage",
        headerText: "Main Image",
        textAlign: ej.TextAlign.Center,
        template: "<img class='Product-image' src='\{{: MainImage }}'>",
        validationRules: { required: true, number: false },
        width: 40,
      },
      {
        field: "SecondaryImage",
        headerText: "Secondary Image",
        textAlign: ej.TextAlign.Center,
        template: "<img class='Product-image' src='\{{: SecondaryImage }}'>",
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
        field: "Code",
        headerText: "Code",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true },
        width: 90,
      },
      {
        field: "Category.Name",
        headerText: "Category",
        textAlign: ej.TextAlign.Left,
        width: 90,
      },
      {
        field: "SellingPrice",
        headerText: "Selling Price",
        textAlign: ej.TextAlign.Right,
        validationRules: { required: true },
        width: 90,
      },
      {
        field: "DiscountedPrice",
        headerText: "Discounted Price",
        textAlign: ej.TextAlign.Right,
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

  $("#ProductGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#ProductTemplate",
    },
  });
  
});
//#endregion
let completeProduct = function (args) {
  
  if (args.requestType == "beginedit") {
    $('#ProductDescription').richText();
    document.getElementById("ProductFeatured").checked = args.rowData.IsFeatured;
    document.getElementById("ProductStockAvailable").checked = args.rowData.StockAvailable;
    document.getElementById("ProductActive").checked = args.rowData.Active;
    populateParentProductDropDown(global_Product_data);
    var obj = $("#ProductCategory").data("ejDropDownList");
    if (args.rowData.Category) {
      obj.selectItemByValue(args.rowData.Category._id);
    }
  }
  else if (args.requestType == "add") {
    $('#ProductDescription').richText();
    document.getElementById("ProductFeatured").checked = false;
    populateParentProductDropDown(global_Product_data);
  }
  if (args.requestType == "save") {
    $("#ProductGrid").ejGrid("refreshContent");
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



