$(function () {
  var ProductsdataManager = ej.DataManager({
    url: "/api/products",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#ProductGrid").ejGrid({
    dataSource: ProductsdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completeProducts",
    allowFiltering: true,
    isResponsive: true,
    filterSettings: { filterType: "menu" },
    allowScrolling: true,
    pageSettings: { pageSize: 6},
    scrollSettings: { height: ($(window).height() - ($(window).height() * ((37 * $(window).height()) / 937) / 100)) },
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
        textAlign: ej.TextAlign.Left,
        template: "<img class='profile-pic' src='{{: Image }}'>",
        validationRules: { required: true, number: false },
        width: 90,
      },
      {
        field: "Name",
        headerText: "Name",
        textAlign: ej.TextAlign.Left,
        validationRules: { required: true, number: false },
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
        field: "Vendor.Name",
        headerText: "Vendor",
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
  $("#ProductGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#ProductTemplate",
    },
  });
});
function completeProducts(args) {
  if (args.requestType == "beginedit" || args.requestType == "add") {
    $("#set-pass-checkbox").change(function () {
      if (this.checked) $("#password-div").show();
      else $("#password-div").hide();
    });

    //getting permission list
    $.ajax({
      url: "/api/calculationtypes/getcalculationsforimpacttype/Sales",
      type: "GET",
      success: function (data) {
        $("#productcalculationtypes").ejDropDownList({
          dataSource: data.Items,
          watermarkText: "Select Calculation types",
          fields: { text: "Name", value: "_id" },
          enableFilterSearch: true,
          multiSelectMode: "visualmode",
        });
        $("#productcalculationtypes").ejDropDownList({ width: "100%" });
        var obj = $("#productcalculationtypes").data("ejDropDownList");
        if (args.rowData.Caluculations) {
          args.rowData.Caluculations.forEach((element) =>
            obj.selectItemByValue(element)
          );
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
    $.ajax({
      url: "/api/vendors",
      type: "GET",
      success: function (data) {
        $("#productvendor").ejDropDownList({
          dataSource: data.Items,
          watermarkText: "Select Calculation types",
          fields: { text: "Name", value: "_id" },
          enableFilterSearch: true,
        });
        $("#productvendor").ejDropDownList({ width: "100%" });
        var obj = $("#productvendor").data("ejDropDownList");
        if (args.rowData.Vendor) {
          obj.selectItemByValue(args.rowData.Vendor);
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
    
    $("#unitrelation").ejDropDownList({
      dataSource: global_unit_relations,
      watermarkText: "Select Calculation types",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
    });
    $("#unitrelation").ejDropDownList({ width: "100%" });
    var obj = $("#unitrelation").data("ejDropDownList");
    if (args.rowData.UnitRelation) {
      obj.selectItemByValue(args.rowData.UnitRelation);
    }
    $("#productcategory").ejDropDownList({
      dataSource: global_category_data.Items,
      watermarkText: "Select Calculation types",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
    });
    $("#productcategory").ejDropDownList({ width: "100%" });
    var obj = $("#productcategory").data("ejDropDownList");
    if (args.rowData.Category) {
      obj.selectItemByValue(args.rowData.Category);
    }
  }

  if (args.requestType == "beginedit") {
    document.getElementById("is-active").checked = args.rowData.VisibleOnMenu;
    setTimeout(function () {
      //set time out er baire dile populate hoy na -_-
      var obj1 = $("#productcategory").data("ejDropDownList");
      if (args.rowData.Category) {
        obj1.selectItemByValue(args.rowData.Category._id);
      }
      var obj2 = $("#productvendor").data("ejDropDownList");
      if (args.rowData.Vendor) obj2.selectItemByValue(args.rowData.Vendor._id);
    }, 500);
    $.ajax({
      url: "/api/products/getvariantsofproduct/" + args.rowData._id,
      type: "GET",
      success: function (data) {
        for (let i = 0; i < data.productvariants.length; i++) {
          if (i == 0) {
            document.getElementById("productvariantsid1").value =
              data.productvariants[i]._id;
            document.getElementById("productvariantsName1").value =
              data.productvariants[i].Name;
            document.getElementById("productvariantsBarcode1").value =
              data.productvariants[i].Barcode;
            document.getElementById("productvariantsCostPrice1").value =
              data.productvariants[i].CostPrice;
            document.getElementById("productvariantsSellingPrice1").value =
              data.productvariants[i].SellingPrice;
            document.getElementById("productvariantsCurrentStock1").value =
              data.productvariants[i].StockCount;
            document.getElementById("productthreshold1").value =
              data.productvariants[i].Treshold;
          } else {
            var newlement = `<tr class="productvariants">
                                    <td>
                                        <div class="form-row">
                                        <div class="form-group col-md-2 fl-4"  style="display: none;">
                                          <label for="productvariantsid${i + 1
              }">Id</label>
                                          <input id="productvariantsid${i + 1
              }" name="productvariantsid${i + 1
              }" value="${data.productvariants[i]._id}"
                                              class="form-control" type="text" style="text-align: center;height: 38.5px;"/>
                                      </div>
                                        <div class="form-group col-md-2 fl-4">
                                                <label for="productvariantsName${i + 1
              }">Name</label>
                                                <input id="productvariantsName${i + 1
              }"
                                                    name="productvariantsName${i + 1
              }"
                                                    value="${data.productvariants[i]
                .Name
              }" class="form-control"
                                                    type="text" style="text-align: center;height: 38.5px;"/>
                                            </div>
                                            <div class="form-group col-md-2 fl-4">
                                                <label for="productvariantsBarcode${i + 1
              }">Barcode</label>
                                                <input id="productvariantsBarcode${i + 1
              }"
                                                    name="productvariantsBarcode${i + 1
              }"
                                                    value="${data.productvariants[i]
                .Barcode
              }" class="form-control"
                                                    type="text" style="text-align: center;height: 38.5px;" />
                                            </div>
                                            <div class="form-group col-md-2 fl-4">
                                                <label for="productvariantsCostPrice${i + 1
              }">Cost Price</label>
                                                <input id="productvariantsCostPrice${i + 1
              }" name="productvariantsCostPrice${i + 1
              }"
                                                    value="${data.productvariants[i]
                .CostPrice
              }" class="form-control"
                                                    type="text" style="text-align: center;height: 38.5px;"/>
                                            </div>
                                            <div class="form-group col-md-2 fl-4">
                                                <label for="productvariantsSellingPrice${i + 1
              }">Selling Price</label>
                                                <input id="productvariantsSellingPrice${i + 1
              }"
                                                    name="productvariantsSellingPrice${i + 1
              }"
                                                    value="${data.productvariants[i]
                .SellingPrice
              }" class="form-control"
                                                    type="text" style="text-align: center;height: 38.5px;"/>
                                            </div>
                                            <div class="form-group col-md-2 fl-4">
                                            <label for="productvariantsCurrentStock${i + 1
              }">Current Stock</label>
                                            <input id="productvariantsCurrentStock${i + 1
              }"
                                                name="productvariantsCurrentStock${i + 1
              }"
                                                value="${data.productvariants[i]
                .StockCount
              }" class="form-control"
                                                type="text" style="text-align: center;height: 38.5px;"/>
                                        </div>
                                        <div class="form-group col-md-2 fl-4">
                              <label for="productthreshold${i + 1
              }">Stock Minimum Limit</label>
                              <input id="productthreshold${i + 1
              }" name="productthreshold${i + 1}"
                                  value="${data.productvariants[i].Treshold
              }" class="form-control" type="text" />
                          </div>
                                        </div>
                                    </td>
                                </tr>`;
            $("#product-variants tr:last").after(newlement);
          }
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
  if (args.requestType == "save") {
    $("#ProductGrid").ejGrid("refreshContent");
    PopulateGlobalProductVariantList();
  }
}

function gertprofile_image() {
  var reader = new FileReader();
  var f = document.getElementById("file-select").files;
  reader.onloadend = function () {
    document.getElementById("profile_image").src = reader.result;
    document.getElementById("ProductPicture").value = reader.result;
  };
  reader.readAsDataURL(f[0]);
}
$("#password-div").hide();

newproductvariantsAdd = function () {
  var number_of_lelements = $("#product-variants tr").length;
  var newlement = `<tr class="productvariants">
                          <td>
                              <div class="form-row">
                              <div class="form-group col-md-2 fl-4">
                                      <label for="productvariantsName${number_of_lelements}">Name</label>
                                      <input id="productvariantsName${number_of_lelements}"
                                          name="productvariantsName${number_of_lelements}"
                                          value="" class="form-control"
                                          type="text" style="text-align: center;height: 38.5px;"/>
                                  </div>
                                  <div class="form-group col-md-2 fl-4">
                                      <label for="productvariantsBarcode${number_of_lelements}">Barcode</label>
                                      <input id="productvariantsBarcode${number_of_lelements}"
                                          name="productvariantsBarcode${number_of_lelements}"
                                          value="" class="form-control"
                                          type="text" style="text-align: center;height: 38.5px;" />
                                  </div>
                                  <div class="form-group col-md-2 fl-4">
                                      <label for="productvariantsCostPrice${number_of_lelements}">Cost Price</label>
                                      <input id="productvariantsCostPrice${number_of_lelements}" name="productvariantsCostPrice${number_of_lelements}"
                                          value="" class="form-control"
                                          type="text" style="text-align: center;height: 38.5px;"/>
                                  </div>
                                  <div class="form-group col-md-2 fl-4">
                                      <label for="productvariantsSellingPrice${number_of_lelements}">Selling Price</label>
                                      <input id="productvariantsSellingPrice${number_of_lelements}"
                                          name="productvariantsSellingPrice${number_of_lelements}"
                                          value="" class="form-control"
                                          type="text" style="text-align: center;height: 38.5px;"/>
                                  </div>
                                  <div class="form-group col-md-2 fl-4">
                                  <label for="productvariantsCurrentStock${number_of_lelements}">Current Stock</label>
                                  <input id="productvariantsCurrentStock${number_of_lelements}"
                                      name="productvariantsCurrentStock${number_of_lelements}"
                                      value="" class="form-control"
                                      type="text" style="text-align: center;height: 38.5px;"/>
                              </div>
                              <div class="form-group col-md-2 fl-4">
                              <label for="productthreshold${number_of_lelements}">Stock Minimum Limit</label>
                              <input id="productthreshold${number_of_lelements}" name="productthreshold${number_of_lelements}"
                                  value="" class="form-control" type="text" />
                          </div>
                              </div>
                          </td>
                      </tr>`;
  if (number_of_lelements == 1) {
    document.getElementById("product-variants").innerHTML = newlement;
  } else {
    $("#product-variants tr:last").after(newlement);
  }
};
