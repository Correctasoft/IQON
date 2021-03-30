let globalPackageProductLength = 1;
$(function () {
  var ProductPackagesdataManager = ej.DataManager({
    url: "/api/products/Packages",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#ProductPackageGrid").ejGrid({
    dataSource: ProductPackagesdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completeProductPackages",
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
        validationRules: {
          required: true,
          number: false,
          value: [customFn, "Enter a unique value"],
        },
        width: 90,
      },
      {
        field: "Category.Name",
        headerText: "Category",
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
  $("#ProductPackageGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#ProductPackageTemplate",
    },
  });
});

 customFn = function(args) {
  console.log(args);
  var grid = $("#ProductPackageGrid").ejGrid();
  for (i = 0; i < grid.dataSource.length; i++) {
    if (args["value"] === grid.dataSource[i].Name.toString()) {
      return false;
    } else {
      return true;
    }
  }
}

function completeProductPackages(args) {
  if (args.requestType == "add") {
    //getting permission list
    globalPackageProductLength = 1;
    PopulateProductListForPackage(global_autoComplete_variant_data);
    PopulateCategoryForPackage(global_category_data, args);
  }

  if (args.requestType == "beginedit") {
    document.getElementById("is-active-package").checked =
      args.rowData.VisibleOnMenu;
    PopulateProductListForPackage(global_autoComplete_variant_data);
    PopulateCategoryForPackage(global_category_data, args);
    var obj1 = $("#productpackagecategory").data("ejDropDownList");
    if (args.rowData.Category) {
      obj1.selectItemByValue(args.rowData.Category._id);
    }
    globalPackageProductLength =
      args.rowData.ProductVariants.length === 0
        ? 1
        : args.rowData.ProductVariants.length;
    $("#numberofelements").val(globalPackageProductLength);
    for (let i = 0; i < args.rowData.ProductVariants.length; i++) {
      data = args.rowData.ProductVariants[i];
      var newlement = `<tr class="productvariants" id="variantsinpackage${
        i + 1
      }">
                            <td>
                                <div class="form-row">
                                <div class="form-group col-md-2 fl-4" style="display: none;">
                                        <label for="productvariantsidforpackage${
                                          i + 1
                                        }">Id</label>
                                        <input id="productvariantsidforpackage${
                                          i + 1
                                        }" 
                                        name="productvariantsidforpackage${
                                          i + 1
                                        }" value="${
        data.Variant._id
      }" class="form-control" type="text" />
                                    </div>
                                <div class="form-group col-md-2 fl-4">
                                        <label for="packagevarientproductName${
                                          i + 1
                                        }">Product</label>
                                        <input id="packagevarientproductName${
                                          i + 1
                                        }"
                                            name="packagevarientproductName${
                                              i + 1
                                            }"
                                            value="${
                                              data.Variant.Product.Name
                                            }" class="form-control"
                                            type="text" style="text-align: center;height: 38.5px;"/>
                                    </div>
                                    <div class="form-group col-md-2 fl-4">
                                        <label for="packagevarientName${
                                          i + 1
                                        }">Barcode</label>
                                        <input id="packagevarientName${i + 1}"
                                            name="packagevarientName${i + 1}"
                                            value="${
                                              data.Variant.Name
                                            }" class="form-control"
                                            type="text" style="text-align: center;height: 38.5px;" />
                                    </div>
                                    <div class="form-group col-md-2 fl-4">
                                        <label for="productvariantsPrice${
                                          i + 1
                                        }">Cost Price</label>
                                        <input id="productvariantsPrice${
                                          i + 1
                                        }" name="productvariantsPrice${i + 1}"
                                            value="${
                                              data.SellingPrice
                                            }" class="form-control"
                                            type="text" style="text-align: center;height: 38.5px;"/>
                                    </div>
                                    <div class="form-group col-md-2 fl-4">
                                    <label>&nbsp;</label>
                                    <button type="button" class="btn btn-danger" style="display: block;" onclick="deletePackageVariantFromList('variantsinpackage${
                                      i + 1
                                    }')">X</button>
                                </div>
                                </div>
                                </div>
                            </td>
                        </tr>`;

      $("#product-variants-package tr:last").after(newlement);
    }
  }
  if (args.requestType == "save") {
    $("#ProductPackageGrid").ejGrid("refreshContent");
  }
}

function gertprofile_image() {
  var reader = new FileReader();
  var f = document.getElementById("file-select").files;
  reader.onloadend = function () {
    document.getElementById("profile_image").src = reader.result;
    document.getElementById("ProductPackagePicture").value = reader.result;
  };
  reader.readAsDataURL(f[0]);
}
$("#password-div").hide();

newVariantForPakcageAdd = function (data) {
  var number_of_lelements = globalPackageProductLength + 1;
  var newlement = `<tr class="productvariants" id="variantsinpackage${number_of_lelements}">
                            <td>
                                <div class="form-row">
                                <div class="form-group col-md-2 fl-4" style="display: none;">
                                        <label for="productvariantsidforpackage${number_of_lelements}">Id</label>
                                        <input id="productvariantsidforpackage${number_of_lelements}" name="productvariantsidforpackage${number_of_lelements}"
                                            value="${data._id}" class="form-control" type="text" />
                                    </div>
                                <div class="form-group col-md-2 fl-4">
                                        <label for="packagevarientproductName${number_of_lelements}">Product</label>
                                        <input id="packagevarientproductName${number_of_lelements}"
                                            name="packagevarientproductName${number_of_lelements}"
                                            value="${data.Product.Name}" class="form-control"
                                            type="text" style="text-align: center;height: 38.5px;"/>
                                    </div>
                                    <div class="form-group col-md-2 fl-4">
                                        <label for="packagevarientName${number_of_lelements}">Barcode</label>
                                        <input id="packagevarientName${number_of_lelements}"
                                            name="packagevarientName${number_of_lelements}"
                                            value="${data.Name}" class="form-control"
                                            type="text" style="text-align: center;height: 38.5px;" />
                                    </div>
                                    <div class="form-group col-md-2 fl-4">
                                        <label for="productvariantsPrice${number_of_lelements}">Cost Price</label>
                                        <input id="productvariantsPrice${number_of_lelements}" name="productvariantsPrice${number_of_lelements}"
                                            value="${data.SellingPrice}" class="form-control"
                                            type="text" style="text-align: center;height: 38.5px;"/>
                                    </div>
                                    <div class="form-group col-md-2 fl-4">
                                    <label>&nbsp;</label>
                                    <button type="button" class="btn btn-danger" style="display: block;" onclick="deletePackageVariantFromList('variantsinpackage${number_of_lelements}')">X</button>
                                </div>
                                </div>
                                </div>
                            </td>
                        </tr>`;

  $("#product-variants-package tr:last").after(newlement);
  $("#numberofelements").val(number_of_lelements);
  globalPackageProductLength++;
};

PopulateProductListForPackage = function (data) {
  $("#productvariantsforpackage").ejAutocomplete({
    dataSource: data.productvariants,
    width: 400,
    popupHeight: "500px",
    multiColumnSettings: {
      enable: true,
      showHeader: true,
      stringFormat: "{0}",
      searchColumnIndices: [0, 1, 2, 3],
      columns: [
        { field: "Name", headerText: "Variant Name" },
        { field: "Product.Name", headerText: "Product Name" },
        { field: "Product.Category.Name", headerText: "Category" },
        { field: "Product.Vendor.Name", headerText: "Vendor" },
      ],
    },
    select: function (argument) {
      console.log(argument);
      newVariantForPakcageAdd(argument.item);
    },
  });
};

deletePackageVariantFromList = function (id) {
  console.log(id);
  $("#" + id).remove();
};

PopulateCategoryForPackage = function (data, args) {
  $("#productpackagecategory").ejDropDownList({
    dataSource: data.Items,
    watermarkText: "Select Calculation types",
    fields: { text: "Name", value: "_id" },
    enableFilterSearch: true,
  });
  $("#productpackagecategory").ejDropDownList({ width: "100%" });
  var obj = $("#productpackagecategory").data("ejDropDownList");
  if (args.rowData.Category) {
    obj.selectItemByValue(args.rowData.Category);
  }
};
