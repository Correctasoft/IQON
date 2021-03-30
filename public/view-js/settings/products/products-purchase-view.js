let global_productPurchaseData = [];

let selected_productPurchaseData = [];
let global_purchase_selected_rowIndex = 0;
let flag = true;
let global_invoice_template = {};
let global_vendor_data = [];

$(function () {
  populateReportTemplate();
  var checkvariantDataExist = setInterval(function () {
    console.log(global_autoComplete_variant_data.productvariants.length);
    if (global_autoComplete_variant_data.productvariants.length) {
      $("#autocomplete").ejAutocomplete({
        dataSource: global_autoComplete_variant_data.productvariants,
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
          createGridForPurchase(argument);
        },
      });
      clearInterval(checkvariantDataExist);
    }
  }, 1000); // check every 100ms
});

populateReportTemplate = function () {
  showLoader();
  $.ajax({
    url: "/api/report-templates/getReportTemplate/ProductPurchase",
    type: "GET",
    success: function (data) {
      hideLoader();
      global_invoice_template = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
  $.ajax({
    url: "/api/report-templates/getReportTemplate/ReprintProductPurchase",
    type: "GET",
    success: function (data) {
      hideLoader();
      global_reprint_template = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};

$.ajax({
  url: "/api/vendors",
  type: "GET",
  success: function (data) {
    global_vendor_data = data;
    $("#productpurchasevendor").ejDropDownList({
      dataSource: data.Items,
      watermarkText: "Select Calculation types",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
    });
    $("#productpurchasevendor").ejDropDownList({ width: "100%" });
  },
  error: function (error) {
    console.log(error);
  },
});

createGridForPurchase = function (argument) {
  if (argument) {
    if (document.getElementById("ProductPurchaseGrid").innerHTML === "") {
      $("#ProductPurchaseGrid").ejGrid({
        dataSource: selected_productPurchaseData,
        allowTextWrap: true,
        textWrapSettings: { wrapMode: "both" },
        editSettings: {
          allowEditing: true,
          allowDeleting: true,
          editMode: "batch",
        },
        rowSelected: "rowSelected",
        showSummary: true,
        summaryRows: [
          {
            title: "Total =",
            summaryColumns: [
              {
                summaryType: ej.Grid.SummaryType.Sum,
                displayColumn: "PurchaseValue",
                dataMember: "PurchaseValue",
              },
            ],
          },
        ],
        toolbarSettings: {
          showToolbar: true,
          toolbarItems: [
            ej.Grid.ToolBarItems.Edit,
            ej.Grid.ToolBarItems.Delete,
          ],
        },
        columns: [
          {
            field: "_id",
            isPrimaryKey: true,
            headerText: "Variant ID",
            visible: false,
            textAlign: ej.TextAlign.Right,
            validationRules: { required: true },
            width: 90,
          },
          {
            field: "Name",
            headerText: "Variant Name",
            allowEditing: false,
            width: 90,
          },
          {
            field: "Product.Name",
            headerText: "Product Name",
            allowEditing: false,
            textAlign: ej.TextAlign.Right,
            width: 80,
          },
          {
            field: "Product.Category.Name",
            headerText: "Category",
            textAlign: ej.TextAlign.Right,
            allowEditing: false,
            width: 80,
          },
          {
            field: "CostPrice",
            headerText: "Unit Price",
            editType: ej.Grid.EditingType.Numeric,
            editParams: { decimalPlaces: 2 },
            width: 80,
          },
          {
            field: "StockCount",
            headerText: "Current Stock",
            width: 150,
            editType: ej.Grid.EditingType.Numeric,
            allowEditing: false,
            editParams: { decimalPlaces: 2 },
            validationRules: { range: [0, 1000] },
            width: 80,
          },
          {
            headerText: "Current Stock Value",
            width: 150,
            editType: ej.Grid.EditingType.Numeric,
            allowEditing: false,
            editParams: { decimalPlaces: 2 },
            width: 80,
            template: "<span>{{:StockCount * CostPrice}}</span>",
          },
          {
            field: "Product.UnitRelation.BaseUnitName",
            headerText: "Base Unit",
            allowEditing: false,
            textAlign: ej.TextAlign.Right,
            width: 80,
          },
          {
            field: "PurchaseInBaseUnit",
            headerText: "Purchase In Baseunit",
            defaultValue: 0,
            editType: ej.Grid.EditingType.Numeric,
            editParams: { decimalPlaces: 2 },
            validationRules: { range: [0, 900000] },
            width: 80,
          },
          {
            field: "Product.UnitRelation.TransactionUnitName",
            headerText: "Transaction Unit",
            allowEditing: false,
            textAlign: ej.TextAlign.Right,
            width: 80,
          },
          {
            field: "Purchase",
            headerText: "Purchase Qty",
            defaultValue: 0,
            editType: ej.Grid.EditingType.Numeric,
            editParams: { decimalPlaces: 2 },
            validationRules: { range: [0, 900000] },
            // template:
            //   "<span>{{:PurchaseInBaseUnit / Product.UnitRelation.Multiplier }}</span>",
            width: 80,
          },
          {
            field: "PurchaseValue",
            headerText: "Purchase Value",
            allowEditing: false,
            width: 80,
            template: "<span>{{:Purchase * CostPrice}}</span>",
          },
        ],
        cellEdit: "cellEdit",
        cellSave: "cellSave",
      });
    }
    let obj = $("#ProductPurchaseGrid")
      .data("ejGrid")
      .model.dataSource.filter((m) => m._id == argument.item._id);
    if (obj.length < 1) {
      selected_productPurchaseData.push(argument.item);
      $("#ProductPurchaseGrid").data("ejGrid").batchSave();
      $("#ProductPurchaseGrid")
        .data("ejGrid")
        .model.dataSource.push(argument.item);
      $("#ProductPurchaseGrid").ejGrid("refreshContent");
    }
  } else {
    selected_productPurchaseData = [];
  }
};

cellSave = function (args) {
  if (flag) {
    args.cancel = true;
    this.batchChanges.changed.push(args.rowData);
    var batchData = this.getBatchChanges();
    if (
      batchData.changed.length > 0 &&
      !$(args.cell).closest("tr").hasClass("e-insertedrow")
    ) {
      flag = false;
      $("#ProductPurchaseGrid").data("ejGrid").batchSave();
      $("#ProductPurchaseGrid").ejGrid("refreshContent");
      console.log(args.columnName);
      console.log(args.rowData.PurchaseInBaseUnit);
      if (args.columnName === "Purchase") {
        console.log(parseFloat(args.rowData.Purchase), args.rowData.Purchase);
        args.rowData.PurchaseInBaseUnit =
          parseFloat(args.rowData.Purchase) *
          args.rowData.Product.UnitRelation.Multiplier;
      }
      if (args.columnName === "PurchaseInBaseUnit") {
        console.log(
          parseFloat(
            args.rowData.PurchaseInBaseUnit /
              args.rowData.Product.UnitRelation.Multiplier
          ) * args.rowData.CostPrice,
          args.rowData.PurchaseInBaseUnit
        );
        args.rowData.Purchase = parseFloat(
          args.rowData.PurchaseInBaseUnit /
            args.rowData.Product.UnitRelation.Multiplier
        );
      }
      this.batchChanges.changed.push(args.rowData);
      var batchData = this.getBatchChanges();
      $("#ProductPurchaseGrid").data("ejGrid").batchSave();
      $("#ProductPurchaseGrid").ejGrid("refreshContent");
      recalculateSummaryRows();
      $("#ProductPurchaseGrid")
        .ejGrid("instance")
        .editCell(global_purchase_selected_rowIndex[0] + 1, args.columnName);
    } else flag = false;
  } else flag = true;
};

cellEdit = function (args) {
  if (flag) {
    args.cancel = true;
    this.batchChanges.changed.push(args.rowData);
    var batchData = this.getBatchChanges();
    if (
      batchData.changed.length > 0 &&
      !$(args.cell).closest("tr").hasClass("e-insertedrow")
    ) {
      flag = false;
    } else flag = false;
  } else flag = true;
};

draftPurchaseButtonClicked = function () {
  let DataSource = $("#ProductPurchaseGrid").data("ejGrid").model.dataSource;
  let sum = 0;
  for (let i = 0; i < DataSource.length; i++) {
    sum += DataSource[i].CostPrice * DataSource[i].Purchase;
  }
  let postObject = {
    Vendor: document.getElementById("productpurchasevendor").value,
    Data: JSON.stringify(
      $("#ProductPurchaseGrid").data("ejGrid").model.dataSource
    ),
    TotalAmount: sum,
  };
  if (ValidatePurchasePostObject(postObject)) {
    $.post(
      "/api/purchase/savedraftpurchase",
      postObject,
      function (data, status) {
        showTab("tab-draft-purchases");
        document.getElementById("ProductPurchaseGrid").innerHTML = "";
        document.getElementById("ProductPurchaseGrid").className = "";
        populateDraftPurchaseList();
        createGridForPurchase(null);
        console.log("done");
      }
    );
  }
};

recalculateSummaryRows = function () {
  let DataSource = $("#ProductPurchaseGrid").data("ejGrid").model.dataSource;
  let sum = 0;
  for (let i = 0; i < DataSource.length; i++) {
    sum += DataSource[i].CostPrice * DataSource[i].Purchase;
  }
  for (
    var i = 0;
    i < $("#ProductPurchaseGrid").data("ejGrid").model.summaryRows.length;
    i++
  )
    for (
      var j = 0;
      j <
      $("#ProductPurchaseGrid").data("ejGrid").model.summaryRows[i]
        .summaryColumns.length;
      j++
    ) {
      if (
        $("#ProductPurchaseGrid").data("ejGrid").model.summaryRows[i]
          .summaryColumns[j].dataMember == "PurchaseValue" &&
        $("#ProductPurchaseGrid").data("ejGrid").model.summaryRows[i]
          .summaryColumns[j].summaryType == "sum"
      ) {
        format = !ej.isNullOrUndefined(
          $("#ProductPurchaseGrid").data("ejGrid").model.summaryRows[i]
            .summaryColumns[j].format
        )
          ? $("#ProductPurchaseGrid").data("ejGrid").model.summaryRows[i]
              .summaryColumns[j].format
          : "{0:N}"; //getting the format of the summaryColumn
        j = i; // finding the summaryRow to be modified
        break;
      }
    }
  $(".e-gridSummaryRows:eq(" + j + ")").find(
    "td.e-summaryrow"
  )[11].innerHTML = sum;
};

savePurchaseButtonClicked = function () {
  let DataSource = $("#ProductPurchaseGrid").data("ejGrid").model.dataSource;
  let sum = 0;
  let totalQuantity = 0;
  for (let i = 0; i < DataSource.length; i++) {
    sum += DataSource[i].CostPrice * DataSource[i].Purchase;
    totalQuantity += DataSource[i].Purchase;
  }
  let TempDataSource = $("#ProductPurchaseGrid").data("ejGrid").model
    .dataSource;
  let ProductGridData = [];
  for (let i = 0; i < TempDataSource.length; i++) {
    let tempData = TempDataSource[i];
    tempData.Category = JSON.stringify(TempDataSource[i].Category);
    tempData.Vendor = JSON.stringify(TempDataSource[i].Vendor);
    ProductGridData.push(tempData);
  }
  let postObject = {
    Vendor: document.getElementById("productpurchasevendor").value,
    Data: ProductGridData,
    TotalAmount: sum,
    TotalQuantity: totalQuantity,
  };
  if (ValidatePurchasePostObject(postObject)) {
    $.post("/api/purchase/", postObject, function (data, status) {
      
      PrintInvoice(data);
      document.getElementById("ProductPurchaseGrid").innerHTML = "";
      document.getElementById("ProductPurchaseGrid").className = "";
      createGridForPurchase(null);
      console.log("done");
    });
  }
};

PrintInvoice = function (data) {
  data.purchase.CreationDate = dateFormat(data.purchase.CreationDate);
  printData = {
    OrganizationName,
    Address,
    Phone,
    selectedPurchase: data.purchase,
    selectedPurchaseData: data.details,
    vendor: data.purchase.Vendor,
  };
  console.log(JSON.stringify(printData));
  setGiveReport(global_invoice_template.Content, printData);
  hidebackdrop();
};

rowSelected = function (args) {
  global_purchase_selected_rowIndex = this.selectedRowsIndexes; // get selected row indexes
};

$("#savePurchaseButton").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});

$("#draftPurchaseButton").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});

ValidatePurchasePostObject = function (postObject) {
  console.log(postObject.TotalAmount);
  if (postObject.Vendor === "") {
    alert("Please Select a vendor");
    return false;
  }
  if (isNaN(postObject.TotalAmount) || postObject.TotalAmount === 0) {
    alert("Please Enter Valid Quanitty");
    return false;
  }
  if (postObject.Data.length < 1) {
    alert("Please Select Products");
    return false;
  }
  return true;
};
