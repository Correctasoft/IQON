let global_productPurchaseData = [];
let selected_productPurchaseData = [];
let global_purchase_selected_rowIndex = 0;
let flag = true;

$(function () {
  populateAccountsforVoucher();
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  $("#voucherdate").ejDatePicker({
    width: "100%",
    value: d,
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "dd MMM yyyy",
  });
  populateReportTemplate();
});
let global_voucher_receipt_template = {};
populateReportTemplate = function () {
  $.ajax({
    url: "/api/report-templates/getReportTemplate/VoucherReceipt",
    type: "GET",
    success: function (data) {
      hideLoader();
      global_voucher_receipt_template = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};
populateAccountsforVoucher = function () {
  $("#autocomplete").ejAutocomplete({
    dataSource: global_accounts.Items,
    width: 400,
    multiColumnSettings: {
      enable: true,
      showHeader: true,
      stringFormat: "{0}",
      searchColumnIndices: [0, 1, 2],
      columns: [
        { field: "Name", headerText: "Account" },
        { field: "AccountType.Name", headerText: "AccountType" },
        { field: "Balance", headerText: "Balance" },
      ],
    },
    select: function (argument) {
      if (document.getElementById("JournalVoucherGrid").innerHTML === "") {
        $("#JournalVoucherGrid").ejGrid({
          dataSource: selected_productPurchaseData,
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
              headerText: "Account ID",
              visible: false,
              textAlign: ej.TextAlign.Right,
              validationRules: { required: true, number: true },
              width: 90,
            },
            {
              field: "Name",
              headerText: "Particuler",
              allowEditing: false,
              validationRules: { required: true, minlength: 3 },
              width: 90,
            },
            {
              field: "AccountType.Name",
              headerText: "Account Type",
              allowEditing: false,
              textAlign: ej.TextAlign.Right,
              width: 80,
            },
            {
              field: "Impact",
              headerText: "Impact",
              editType: ej.Grid.EditingType.Dropdown,
              dataSource: [
                { text: "Debit", value: "Debit" },
                { text: "Credit", value: "Credit" },
              ],
              allowEditing: true,
              width: 80,
            },
            {
              field: "Amount",
              headerText: "Amount",
              editType: ej.Grid.EditingType.Numeric,
              editParams: { decimalPlaces: 2 },
              lowEditing: true,
              width: 80,
            },
          ],
          cellEdit: "cellEdit",
          cellSave: "cellSave",
        });
      }
      let obj = $("#JournalVoucherGrid")
        .data("ejGrid")
        .model.dataSource.filter((m) => m._id == argument.item._id);
      if (obj.length < 1) {
        selected_productPurchaseData.push(argument.item);
        $("#JournalVoucherGrid").data("ejGrid").batchSave();
        $("#JournalVoucherGrid")
          .data("ejGrid")
          .model.dataSource.push(argument.item);
        $("#JournalVoucherGrid").ejGrid("refreshContent");
      }
    },
  });
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
      $("#JournalVoucherGrid").data("ejGrid").batchSave();
      $("#JournalVoucherGrid").ejGrid("refreshContent");
      $("#JournalVoucherGrid")
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

SaveTransaction = function () {
  let DataSource = $("#JournalVoucherGrid").data("ejGrid").model.dataSource;
  let debit = 0,
    credit = 0;
  let debitRows = DataSource.filter((m) => m.Impact === "Debit");
  let creditRows = DataSource.filter((m) => m.Impact === "Credit");
  for (let i = 0; i < debitRows.length; i++) {
    debit += parseFloat(debitRows[i].Amount);
  }
  for (let i = 0; i < creditRows.length; i++) {
    credit += parseFloat(creditRows[i].Amount);
  }
  if (credit !== debit) {
    alert("Debit and Credit Amount is not equal");
  } else {
    let postObject = {
      Date: document.getElementById("voucherdate").value,
      Data: DataSource,
      Remarks: document.getElementById("Remarks").value,
      credit,
      debit,
      currentUserId: sessionStorage.getItem("currentUserId"),
    };
    $.post("/api/journalvoucher/", postObject, async function (
      voucherdata,
      status
    ) {
      let global_invoice_data = voucherdata;
      global_invoice_data.OrganizationName = OrganizationName;
      global_invoice_data.Address = Address;
      global_invoice_data.Phone = Phone;
      var fileName = "";
      var report = new Stimulsoft.Report.StiReport();
      report.load(global_voucher_receipt_template.Content);
      report.dictionary.databases.clear();
      report.regData("Demo", "Demo", global_invoice_data);
      report.render();
      var pdfSettings = new Stimulsoft.Report.Export.StiPdfExportSettings();
      var pdfService = new Stimulsoft.Report.Export.StiPdfExportService();
      var stream = new Stimulsoft.System.IO.MemoryStream();
      await report.renderAsync(async function () {
        await pdfService.exportToAsync(
          function () {
            var data = stream.toArray();
            var blob = new Blob([new Uint8Array(data)], {
              type: "application/pdf",
            });
            var form = new FormData();
            form.append("Files", blob, "voucher.pdf");
            var fileUrl = URL.createObjectURL(blob);
            window.open(fileUrl);
            location.reload();
            //URL.revokeObjectURL();
          },
          report,
          stream,
          pdfSettings
        );
      }, false);
    });
  }
};

rowSelected = function (args) {
  global_purchase_selected_rowIndex = this.selectedRowsIndexes; // get selected row indexes
};

$("#SaveTransaction").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});
