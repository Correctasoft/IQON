var global_category_data = null;
function gertcategory_image() {
  var reader = new FileReader();
  var f = document.getElementById("file-select").files;
  reader.onloadend = function () {
    document.getElementById("category_image").src = reader.result;
    document.getElementById("categoryImage").value = reader.result;
  }
  reader.readAsDataURL(f[0]);
}

let populateParentCategoryDropDown = function (data) {
  $("#categoryParent").ejDropDownList({
    dataSource: data.Items,
    watermarkText: "Select Parent Category",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
  });
  // $("#categoryParent").ejDropDownList({width: 100});
};

let getParentCategories = function () {
  $.ajax({
    url: "/admin/api/categories/parent-categories",
    type: "GET",
    success: function (data) {
      global_category_data = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//#region grid populate
$(function () {
  getParentCategories();
  var CategorydataManager = ej.DataManager({
    url: "/admin/api/categories",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#CategoryGrid").ejGrid({
    dataSource: CategorydataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: completeCategory,
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
      // {
      //   field: "_id",
      //   headerText: "_id",
      //   textAlign: ej.TextAlign.Center,
      //   template: "<img class='category-image' src='/category/api/image/\{{: _id }}?height=500&width=500&quality=70'>",
      //   validationRules: { required: true, number: false },
      //   width: 40,
      // },
      {
        field: "Image",
        headerText: "Image",
        textAlign: ej.TextAlign.Center,
        template: "<img class='category-image' src='/admin/api/categories/image/\{{:_id}}?height=150&width=150&quality=70'>",
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
        field: "Parent.Name",
        headerText: "Parent",
        textAlign: ej.TextAlign.Left,
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

  $("#CategoryGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#CategoryTemplate",
    },
  });
  
});
//#endregion
let completeCategory = function (args) {
  if (args.requestType == "beginedit") {
    document.getElementById("categoryIsFeatured").checked = args.rowData.IsFeatured;
    populateParentCategoryDropDown(global_category_data);
    
    document.getElementById('category_image').src = "/admin/api/categories/image/"+args.rowData._id+"?height=150&width=150&quality=70";
    var obj = $("#categoryParent").data("ejDropDownList");
    if (args.rowData.Parent) {
      obj.selectItemByValue(args.rowData.Parent._id);
    }
  }
  else if (args.requestType == "add") {
    document.getElementById("categoryIsFeatured").checked = false;
    populateParentCategoryDropDown(global_category_data);
  }
  if (args.requestType == "save") {
    $("#CategoryGrid").ejGrid("refreshContent");
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



