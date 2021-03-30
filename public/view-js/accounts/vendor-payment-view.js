//#region grid populate
let global_purchase_selected_for_payment = "";
$(function () {
  $.ajax({
    url: "/api/vendors",
    type: "GET",
    success: function (data) {
      global_vendor_data = data;
      $("#vendordropdown").ejDropDownList({
        dataSource: data.Items,
        watermarkText: "Select Vendor",
        fields: { text: "Name", value: "_id" },
        enableFilterSearch: true,
        change: function (args) {
          loadVendorPaymentData();
        },
      });
      $("#vendordropdown").ejDropDownList({ width: "100%" });

      // var items = $('#expense-payment-type').ejDropDownList("getListData");
      // console.log(items);
      // $("#product-purchase-payment-type").ejDropDownList({
      //   dataSource: items,
      //   watermarkText: "Select Payment Type",
      //   fields: { text: "Name", value: "_id" },
      //   enableFilterSearch: true,
      //   cssClass: "form-control",
      //   width: "100%",
      // });
    },
    error: function (error) {
      console.log(error);
    },
  });
});

function loadVendorPaymentData() {
  $.ajax({
    url:
      "api/journalvoucher/getvendorpaymentdata/" + $("#vendordropdown").val(),
    type: "GET",
    success: function (data) {
      $("#VendorPaymentGrid").ejGrid({
        dataSource: data.Items,
        allowPaging: true,
        enablelAltRow: true,
        allowSorting: true,
        allowFiltering: true,
        allowSorting: true,
        isResponsive: true,
        filterSettings: { filterType: "menu" },
        enableResponsiveRow: false,
        rowSelecting: function (args) {
          console.log(args.selectedData);
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
            field: "CreationDate",
            headerText: "Date",
            textAlign: ej.TextAlign.Left,
            template: `<span class="purchase-date">\{{: CreationDate }}</span>`,
            width: 90,
          },
          {
            field: "Name",
            headerText: "Name",
            textAlign: ej.TextAlign.Left,
            width: 90,
          },
          {
            field: "TotalAmount",
            headerText: "Total Amount",
            textAlign: ej.TextAlign.Left,
            width: 90,
          },
          {
            field: "AmountPaid",
            headerText: "Amount Paid",
            textAlign: ej.TextAlign.Left,
            width: 90,
          },
          {
            field: "_id",
            headerText: "Actions",
            template: `<a class='btn btn-primary text-white' onclick="viewPurchaseDetails('\{{: _id }}')">View</a> <a class='btn btn-success text-white' onclick="showVendorPaymentPopup('\{{:_id}}')">Pay</a>`,
            width: 50,
          },
        ],
      });
      fixdates();
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function showVendorPaymentPopup(id) {
  global_purchase_selected_for_payment = id;
  $("#vendorPaymentModal").modal("show");
  hidebackdrop();
}

function viewPurchaseDetails(id) {
  global_purchase_selected_for_payment = id;
  populateSelectedPurchaseData(id);
  $("#productPurchaseDetailsModal").modal("show");
  hidebackdrop();
}

function fixdates() {
  var dates = $(".purchase-date");
  for (var i = 0; i < dates.length; i++) {
    dates[i].innerHTML = dateFormat(dates[i].innerHTML);
  }
}
//#endregion

populateSelectedPurchaseData = function (id) {
  $.ajax({
    url: "/api/purchase/getTransactionDetails/" + id,
    type: "GET",
    success: function (data) {
      console.log(data);
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

payToVendor = function () {
  let PostObject = {
    amount: document.getElementById("product-purchase-payment-amount").value,
    purchaseid: global_purchase_selected_for_payment,
    paymentType: document.getElementById("product-purchase-payment-type").value,
    vendorid: document.getElementById("vendordropdown").value,
    currentUserId: sessionStorage.getItem("currentUserId"),
  };
  let DataSource = $("#VendorPaymentGrid").data("ejGrid").model.dataSource;
  let purchase = DataSource.filter(
    (m) => m._id === global_purchase_selected_for_payment
  )[0];
  console.log(purchase);
  if (purchase.TotalAmount - purchase.AmountPaid < PostObject.amount) {
    showSnackBar(
      "Cannot Make payment more than remaining amount ",
      purchase.TotalAmount - purchase.AmountPaid
    );
    return;
  }
  showLoader();
  $.post("/api/purchase/vendorpayment", PostObject, function (data, status) {
    hideLoader();
    loadVendorPaymentData();
  });
};
