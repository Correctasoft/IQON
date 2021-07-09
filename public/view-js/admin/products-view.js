var global_Product_data = null;
var global_sale_category_data = null;

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

let populateCategoryDropDownOld = function (data) {
  $("#ProductCategory").ejDropDownList({
    dataSource: data.Items,
    watermarkText: "Select Parent Product",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
    width : "100%"
  });
  // $("#ProductParent").ejDropDownList({width: 100});
};

let populateCategoryDropDown = function (data) {
  $("#ProductCategory").ejDropDownList({ 
    dataSource: data.Items,
    watermarkText: "Select Parent Product",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
    width : "100%",
    multiSelectMode: "visualmode",
  });
  // $("#ProductParent").ejDropDownList({width: 100});
};

let populateSaleCategoryDropDown = function (data) {
  $("#ProductSaleCategory").ejDropDownList({
    dataSource: data.Items,
    watermarkText: "Select Sale Category",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
    width : "100%"
  });
  // $("#ProductParent").ejDropDownList({width: 100});
};
let getCategories = function () {
  $.ajax({
    url: "/admin/api/categories/mini-categories",
    type: "GET",
    success: function (data) {
      global_Product_data = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

let getSaleCategories = function () {
  $.ajax({
    url: "/admin/api/salecategories",
    type: "GET",
    success: function (data) {
      data.Items = [{Name:'None', _id: ""}].concat(data.Items);
      data.Count++;
      global_sale_category_data= data;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//#region grid populate
$(function () {
  getCategories();
  getSaleCategories();
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
        template: "<img class='Product-image' src='/admin/api/products/mainimage/\{{:_id}}?height=150&width=150&quality=70'>",
        validationRules: { required: true, number: false },
        width: 40,
      },
      {
        field: "SecondaryImage",
        headerText: "Secondary Image",
        textAlign: ej.TextAlign.Center,
        template: "<img class='Product-image' src='/admin/api/products/seondaryimage/\{{:_id}}?height=150&width=150&quality=70'>",
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
        field: "Sale Category.Name",
        headerText: "SaleCategory",
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

    document.getElementById('Product_image').src = "/admin/api/products/mainimage/"+args.rowData._id+"?height=150&width=150&quality=70";
    document.getElementById('Product_image1').src = "/admin/api/products/seondaryimage/"+args.rowData._id+"?height=150&width=150&quality=70";
    populateCategoryDropDown(global_Product_data);
    populateSaleCategoryDropDown(global_sale_category_data);
    var obj = $("#ProductCategory").data("ejDropDownList");
    var obj1 = $("#ProductSaleCategory").data("ejDropDownList");
    if (args.rowData.Category) {
      obj.selectItemByValue(args.rowData.Category._id);
    }
    if (args.rowData.SaleCategory) {
      obj1.selectItemByValue(args.rowData.SaleCategory._id);
    }
  }
  else if (args.requestType == "add") {
    $('#ProductDescription').richText();
    document.getElementById("ProductFeatured").checked = false;
    populateCategoryDropDown(global_Product_data);
    populateSaleCategoryDropDown(global_sale_category_data);
  }
  if (args.requestType == "save") {
    $("#ProductGrid").ejGrid("refreshContent");
    location.reload();
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



