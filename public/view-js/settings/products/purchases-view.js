let selectedPurchase = {};

$(function () {
  populatePurchaseList();
  populateReportTemplate();
  $('#purchase-return-text').hide();
  $('#purchase-return-button').hide();
});

fixDate= function(){
  var targets= $('.aboutstyle');
  for(var i=0; i<targets.length; i++){
    let date= targets[i].innerHTML;
    date= new Date(date.trim());
    targets[i].innerHTML= date.getDate() + "/"
        + (date.getMonth() + 1) + "/"
        + date.getFullYear();
  }
}
//#region populate draft purchase lists
populatePurchaseList = function () {
  $.ajax({
    url: "/api/purchase",
    type: "GET",
    success: function (data) {
      if (data.length > 0) {
        data = data.reverse();
        $("#purchaseList").show();
        $("#purchaseList").ejListView({
          dataSource: data,
          renderTemplate: true,
          width: 450,
          mouseUp: "onPurchaseSelection",
          enableFiltering: true,
        });
        fixDate();
      } else {
        $("#purchaseList").hide();
      }
    },

    error: function (error) {
      console.log(error);
    },
  });
};
//#endregion

onPurchaseSelection = function (e) {
  if (
    document.getElementById("PurchaseList").style.display === "block" &&
    typeof e.model !== "undefined"
  ) {
    // console.log(e);
    document.getElementById("PurchaseList").style.display = "none";
    document.getElementById("PurchasesGridContainer").style.display = "block";
    document.getElementById("purchaseCode").value =
      e.model.dataSource[e.index].Name;
    document.getElementById("purchasesVendor").value =
      e.model.dataSource[e.index].Vendor.Name;
    document.getElementById("purchasesDate").value = dateFormat(
      e.model.dataSource[e.index].CreationDate
    );
    populateSelectedPurchaseData(e.model.dataSource[e.index]._id);
    selectedPurchase = e.model.dataSource[e.index];
    if(selectedPurchase.IsReturned){
      $('#purchase-return-button').hide();
      $('#purchase-return-text').show();
    }
    else{
      $('#purchase-return-button').show();
      $('#purchase-return-text').hide();
    }
  }
};

populateSelectedPurchaseData = function (id) {
  $.ajax({
    url: "/api/purchase/getTransactionDetails/" + id,
    type: "GET",
    success: function (data) {
      // console.log(data);
      $("#PurchaseGrid").ejGrid({
        dataSource: data,
        editSettings: {
          allowEditing: false,
          allowDeleting: false,
        },
        showSummary: true,
        summaryRows: [
          {
            title: "Total =",
            summaryColumns: [
              {
                summaryType: ej.Grid.SummaryType.Sum,
                displayColumn: "PurchaseValue",
                dataMember: "TotalAmount",
              },
            ],
          },
        ],
        toolbarSettings: {
          showToolbar: false,
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
            field: "ProductName",
            headerText: "Product Name",
            allowEditing: false,
            width: 80,
            validationRules: { number: true, range: [0, 1000] },
          },
          {
            field: "VariantName",
            headerText: "Variant Name",
            allowEditing: false,
            validationRules: { required: true, minlength: 3 },
            width: 90,
          },

          {
            field: "CategoryName",
            headerText: "Category",
            textAlign: ej.TextAlign.Right,
            allowEditing: false,
            width: 80,
          },
          {
            field: "Cost",
            headerText: "Unit Price",
            editType: ej.Grid.EditingType.Numeric,
            editParams: { decimalPlaces: 2 },
            validationRules: { range: [0, 1000] },
            width: 80,
          },
          {
            field: "TransactionQuantityWithName",
            headerText: "Quantity (TR)",
            defaultValue: 1,
            width: 80,
          },
          {
            field: "BaseQuantityWithName",
            headerText: "Quantity (Base)",
            defaultValue: 1,
            width: 80,
          },
          {
            field: "TotalAmount",
            headerText: "Purchase Value",
            allowEditing: false,
            width: 80,
          },
        ],
      });
      recalculatePurchaseSummary();
    },

    error: function (error) {
      console.log(error);
    },
  });
};

recalculatePurchaseSummary = function () {
  let DataSource = $("#PurchaseGrid").data("ejGrid").model.dataSource;
  let sum = 0;
  for (let i = 0; i < DataSource.length; i++) {
    sum += DataSource[i].TotalAmount;
  }
  for (
    var i = 0;
    i < $("#PurchaseGrid").data("ejGrid").model.summaryRows.length;
    i++
  )
    for (
      var j = 0;
      j <
      $("#PurchaseGrid").data("ejGrid").model.summaryRows[i].summaryColumns
        .length;
      j++
    ) {
      if (
        $("#PurchaseGrid").data("ejGrid").model.summaryRows[i].summaryColumns[j]
          .dataMember == "TotalAmount" &&
        $("#PurchaseGrid").data("ejGrid").model.summaryRows[i].summaryColumns[j]
          .summaryType == "sum"
      ) {
        format = !ej.isNullOrUndefined(
          $("#PurchaseGrid").data("ejGrid").model.summaryRows[i].summaryColumns[
            j
          ].format
        )
          ? $("#PurchaseGrid").data("ejGrid").model.summaryRows[i]
              .summaryColumns[j].format
          : "{0:N}"; //getting the format of the summaryColumn
        j = i; // finding the summaryRow to be modified
        break;
      }
    }
  $(".e-gridSummaryRows:eq(" + j + ")").find(
    "td.e-summaryrow"
  )[7].innerHTML = sum;
};

backToPurchaseList = function () {
  populatePurchaseList();
  document.getElementById("PurchaseList").style.display = "block";
  document.getElementById("PurchasesGridContainer").style.display = "none";
  document.getElementById("PurchaseGrid").innerHTML = "";
  document.getElementById("PurchaseGrid").className = "";
};

$("#PrintPurchaseInvoiceButton").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});

PrintPurchaseInvoice = function () {
  printData = {
    OrganizationName,
    Address,
    Phone,
    selectedPurchase,
    selectedPurchaseData: $("#PurchaseGrid").data("ejGrid").model.dataSource,
  };
  console.log(JSON.stringify(printData));
  setGiveReport(global_reprint_template.Content, printData);
  hidebackdrop();
  // var fileName = "";
  // var report = new Stimulsoft.Report.StiReport();
  // report.load();
  // report.dictionary.databases.clear();
  // report.regData("Demo", "Demo", printData);
  // report.render();
  // var pdfSettings = new Stimulsoft.Report.Export.StiPdfExportSettings();
  // var pdfService = new Stimulsoft.Report.Export.StiPdfExportService();
  // var stream = new Stimulsoft.System.IO.MemoryStream();
  // report.renderAsync(function () {
  //   pdfService.exportToAsync(
  //     function () {
  //       var data = stream.toArray();
  //       var blob = new Blob([new Uint8Array(data)], {
  //         type: "application/pdf",
  //       });
  //       var form = new FormData();
  //       form.append("Files", blob, "Invoice.pdf");

  //       var fileUrl = URL.createObjectURL(blob);
  //       window.open(fileUrl);
  //     },
  //     report,
  //     stream,
  //     pdfSettings
  //   );
  // }, false);
};

requestPurchaseReturn = function(){
  var postObject={
    purchasename : selectedPurchase.Name,
    note: $('#purchasenote').val()
  }
  showLoader();
  $.post("/api/purchase/purchasereturn", postObject, function (data, status) {
    hideLoader();
    if(data.success){
      alert("Purchase Return Successfull");
      backToPurchaseList();
    }
    else{
      alert('Oops! something went wrong');
    }
    $('#purchaseReturnModal').modal('hide');
  });
}
