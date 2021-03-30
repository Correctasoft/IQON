let global_Draft_purchase_selected_rowIndex = 0;
let selectedDraftId = 0,
  selectedDraftCode = "";
let flagDraft = true;

$(function () {
  populateDraftPurchaseList();
});

//#region populate vendors
$.ajax({
  url: "/api/vendors",
  type: "GET",
  success: function (data) {
    $("#draftpurchasevendor").ejDropDownList({
      dataSource: data.Items,
      watermarkText: "Select Calculation types",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
    });
    $("#draftpurchasevendor").ejDropDownList({ width: "100%" });
  },
  error: function (error) {
    console.log(error);
  },
});
//#endregion

//#region populate draft purchase lists
populateDraftPurchaseList = function () {
  $.ajax({
    url: "/api/purchase/getdraftpurchases",
    type: "GET",
    success: function (data) {
      if (data.length > 0) {
        $("#templatelist").show();
        $("#templatelist").ejListView({
          dataSource: data,
          renderTemplate: true,
          width: 450,
          mouseUp: "onmouseup",
          enableFiltering: true,
        });
      } else {
        $("#templatelist").hide();
      }
    },

    error: function (error) {
      console.log(error);
    },
  });
};
//#endregion

//#region populate product dropdown

$("#draftautocomplete").ejAutocomplete({
  dataSource: global_autoComplete_variant_data,
  width: 400,
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
    let obj = $("#DraftPurchaseGrid")
      .data("ejGrid")
      .model.dataSource.filter((m) => m._id == argument.item._id);
    if (obj.length < 1) {
      selected_productPurchaseData.push(argument.item);
      $("#DraftPurchaseGrid").data("ejGrid").batchSave();
      $("#DraftPurchaseGrid")
        .data("ejGrid")
        .model.dataSource.push(argument.item);
      $("#DraftPurchaseGrid").ejGrid("refreshContent");
    }
  },
});
//#endregion

onmouseup = function (e) {
  if (
    document.getElementById("DraftPurchaseList").style.display === "block" &&
    typeof e.model !== "undefined"
  ) {
    console.log(e);
    document.getElementById("DraftPurchaseList").style.display = "none";
    document.getElementById("draftPurchaseGridContainer").style.display =
      "block";
    $("#draftpurchasevendor").ejDropDownList({ width: "100%" });
    var obj = $("#draftpurchasevendor").data("ejDropDownList");
    obj.selectItemByValue(e.model.dataSource[e.index].Vendor);
    $("#DraftPurchaseGrid").ejGrid({
      dataSource: e.model.dataSource[e.index].Data,
      editSettings: {
        allowEditing: true,
        allowDeleting: true,
        editMode: "batch",
      },
      rowSelected: "rowSelectedDraft",
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
        toolbarItems: [ej.Grid.ToolBarItems.Edit, ej.Grid.ToolBarItems.Delete],
      },
      columns: [
        {
          field: "_id",
          isPrimaryKey: true,
          headerText: "Variant ID",
          visible: false,
          textAlign: ej.TextAlign.Right,
          validationRules: { required: true, number: true },
          width: 90,
        },
        {
          field: "Name",
          headerText: "Variant Name",
          allowEditing: false,
          validationRules: { required: true, minlength: 3 },
          width: 90,
        },
        {
          field: "Product.Name",
          headerText: "Product Name",
          allowEditing: false,
          textAlign: ej.TextAlign.Right,
          width: 80,
          validationRules: { number: true, range: [0, 1000] },
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
          validationRules: { range: [0, 1000] },
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
          validationRules: { range: [0, 1000] },
          width: 80,
          template: "<span>{{:StockCount * CostPrice}}</span>",
        },
        {
          field: "Product.UnitRelation.TransactionUnitName",
          headerText: "Unit",
          allowEditing: false,
          textAlign: ej.TextAlign.Right,
          width: 80,
        },
        {
          field: "Purchase",
          headerText: "Purchase Qty",
          defaultValue: 1,
          editType: ej.Grid.EditingType.Numeric,
          editParams: { decimalPlaces: 2 },
          validationRules: { range: [0, 1000] },
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
      cellEdit: "cellDraftEdit",
      cellSave: "cellDraftSave",
    });
    selectedDraftId = e.model.dataSource[e.index]._id;
    document.getElementById("DraftCode").value =
      e.model.dataSource[e.index].Name;
    recalculateDraftSummary();
  }
};

backToDraftList = function () {
  populateDraftPurchaseList();
  document.getElementById("DraftPurchaseList").style.display = "block";
  document.getElementById("draftPurchaseGridContainer").style.display = "none";
  document.getElementById("DraftPurchaseGrid").innerHTML = "";
  document.getElementById("DraftPurchaseGrid").className = "";
};

cellDraftSave = function (args) {
  if (flagDraft) {
    args.cancel = true;
    this.batchChanges.changed.push(args.rowData);
    var batchData = this.getBatchChanges();
    if (
      batchData.changed.length > 0 &&
      !$(args.cell).closest("tr").hasClass("e-insertedrow")
    ) {
      flagDraft = false;
      $("#DraftPurchaseGrid").data("ejGrid").batchSave();
      $("#DraftPurchaseGrid").ejGrid("refreshContent");
      recalculateDraftSummary();
      $("#DraftPurchaseGrid")
        .ejGrid("instance")
        .editCell(
          global_Draft_purchase_selected_rowIndex[0] + 1,
          args.columnName
        );
    } else flagDraft = false;
  } else flagDraft = true;
};

cellDraftEdit = function (args) {
  if (flagDraft) {
    args.cancel = true;
    this.batchChanges.changed.push(args.rowData);
    var batchData = this.getBatchChanges();
    if (
      batchData.changed.length > 0 &&
      !$(args.cell).closest("tr").hasClass("e-insertedrow")
    ) {
      flagDraft = false;
    } else flagDraft = false;
  } else flagDraft = true;
};

rowSelectedDraft = function (args) {
  global_Draft_purchase_selected_rowIndex = this.selectedRowsIndexes; // get selected row indexes
};

recalculateDraftSummary = function () {
  let DataSource = $("#DraftPurchaseGrid").data("ejGrid").model.dataSource;
  let sum = 0;
  for (let i = 0; i < DataSource.length; i++) {
    sum += DataSource[i].CostPrice * DataSource[i].Purchase;
  }
  for (
    var i = 0;
    i < $("#DraftPurchaseGrid").data("ejGrid").model.summaryRows.length;
    i++
  )
    for (
      var j = 0;
      j <
      $("#DraftPurchaseGrid").data("ejGrid").model.summaryRows[i].summaryColumns
        .length;
      j++
    ) {
      if (
        $("#DraftPurchaseGrid").data("ejGrid").model.summaryRows[i]
          .summaryColumns[j].dataMember == "PurchaseValue" &&
        $("#DraftPurchaseGrid").data("ejGrid").model.summaryRows[i]
          .summaryColumns[j].summaryType == "sum"
      ) {
        format = !ej.isNullOrUndefined(
          $("#DraftPurchaseGrid").data("ejGrid").model.summaryRows[i]
            .summaryColumns[j].format
        )
          ? $("#DraftPurchaseGrid").data("ejGrid").model.summaryRows[i]
              .summaryColumns[j].format
          : "{0:N}"; //getting the format of the summaryColumn
        j = i; // finding the summaryRow to be modified
        break;
      }
    }
  $(".e-gridSummaryRows:eq(" + j + ")").find(
    "td.e-summaryrow"
  )[8].innerHTML = sum;
};

draftPurchaseUpdateButtonClicked = function () {
  let DataSource = $("#DraftPurchaseGrid").data("ejGrid").model.dataSource;
  let sum = 0;
  for (let i = 0; i < DataSource.length; i++) {
    sum += DataSource[i].CostPrice * DataSource[i].Purchase;
  }
  let postObject = {
    Vendor: document.getElementById("draftpurchasevendor").value,
    Data: JSON.stringify(
      $("#DraftPurchaseGrid").data("ejGrid").model.dataSource
    ),
    TotalAmount: sum,
  };
  if (ValidatePurchasePostObject(postObject)) {
    $.post(
      "/api/purchase/updatedraftpurchase/" + selectedDraftId,
      postObject,
      function (data, status) {
        populateDraftPurchaseList();
        document.getElementById("DraftPurchaseList").style.display = "block";
        document.getElementById("draftPurchaseGridContainer").style.display =
          "none";
        document.getElementById("DraftPurchaseGrid").innerHTML = "";
        document.getElementById("DraftPurchaseGrid").className = "";
        console.log("done");
      }
    );
  }
};

savePurchasefromDraftButtonClicked = function () {
  let DataSource = $("#DraftPurchaseGrid").data("ejGrid").model.dataSource;
  let sum = 0;
  let totalQuantity = 0;
  for (let i = 0; i < DataSource.length; i++) {
    sum += DataSource[i].CostPrice * DataSource[i].Purchase;
    totalQuantity += DataSource[i].Purchase;
  }

  let postObject = {
    Vendor: document.getElementById("draftpurchasevendor").value,
    Data: $("#DraftPurchaseGrid").data("ejGrid").model.dataSource,
    TotalAmount: sum,
    TotalQuantity: totalQuantity,
    selectedDraftId,
  };
  if (ValidatePurchasePostObject(postObject)) {
    $.post("/api/purchase", postObject, function (data, status) {
      populateDraftPurchaseList();
      document.getElementById("DraftPurchaseList").style.display = "block";
      document.getElementById("draftPurchaseGridContainer").style.display =
        "none";
      document.getElementById("DraftPurchaseGrid").innerHTML = "";
      document.getElementById("DraftPurchaseGrid").className = "";
      console.log("done");
    });
  }
};

$("#savePurchasefromDraftButton").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});

$("#draftPurchaseUpdateButton").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});
