let CurrentAssetArray = [],
  FixedAssetArray = [],
  CurrentLiabilityArray = [],
  LongTermLiabilityArray = [],
  OwnersEquityArray = [],
  TotalAsset = 0,
  TotalLiability = 0,
  NetProfitAndLoss = 0;

$(function () {
  populateBalanceSheetReportTemplate();
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  $("#balance-sheet-to-date").ejDatePicker({
    width: "100%",
    value: new Date(),
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "dd MMM yyyy",
  });
});
var global_balancesheet_sum = 0;
function buildTableDataBalanceSheet(data, Name) {
  let ArrayForPrint = [];
  var context = "",
    i,
    sum = 0;
  for (i = 0; i < data.length; i++) {
    context += `<tr><td>${data[i]._id.AccountName}</td>
        <td class="text-right" style="width:25%">${data[i].Balance}</td>
        </tr>`;
    sum += data[i].Balance;
    ArrayForPrint.push({
      AccountName: data[i]._id.AccountName,
      Balance: data[i].Balance,
    });
  }
  context += `  <td>${Name}</td>
          <td class="text-right" style="width:25%">${sum}</td>
      </tr>`;
  global_balancesheet_sum = sum;
  ArrayForPrint.push({
    AccountName: Name,
    Balance: sum,
  });
  switch (Name) {
    case "Total Current Asset": {
      CurrentAssetArray = ArrayForPrint;
      break;
    }
    case "Total Fixed Asset": {
      FixedAssetArray = ArrayForPrint;
      break;
    }
    case "Total Current Liabilities": {
      CurrentLiabilityArray = ArrayForPrint;
      break;
    }
    case "Total Long Term Liabilities": {
      LongTermLiabilityArray = ArrayForPrint;
      break;
    }
    case "Total Owners Equity": {
      OwnersEquityArray = ArrayForPrint;
      break;
    }
    default:
      break;
  }
  return context;
}

function getBalanceSheet(to) {
  var PostObject = {
    to: to,
  };
  showLoader();
  $.post("/api/journalvoucher/balancesheet", PostObject, function (
    data,
    status
  ) {
    hideLoader();
    var context;
    var asset_total = 0,
      liability_total = 0;
    //Current Asset table bind
    context = buildTableDataBalanceSheet(
      data.CurrentAssetReport,
      "Total Current Asset"
    );
    asset_total += global_balancesheet_sum;
    $("#current-asset-table-body").html(context);

    // Fixed Asset Table bind
    context = buildTableDataBalanceSheet(
      data.FixedAssetReport,
      "Total Fixed Asset"
    );
    asset_total += global_balancesheet_sum;
    $("#fixed-asset-table-body").html(context);

    // Current Liability Table bind
    context = buildTableDataBalanceSheet(
      data.CurrentLiabilitiesReport,
      "Total Current Liabilities"
    );
    liability_total += global_balancesheet_sum;
    $("#current-liabilities-table-body").html(context);

    // Long Term Liability Table bind
    context = buildTableDataBalanceSheet(
      data.LongTermLiabilitiesReport,
      "Total Long Term Liabilities"
    );
    liability_total += global_balancesheet_sum;
    $("#long-term-liabilities-table-body").html(context);

    // Long Term Liability Table bind
    context = buildTableDataBalanceSheet(
      data.EquityReport,
      "Total Owners Equity"
    );
    liability_total += global_balancesheet_sum;
    $("#owner-equity-table-body").html(context);

    context = `<tr><td>Net Profit And Loss</td>
        <td class="text-right" style="width:25%">${data.NetProfit}</td>
        </tr>`;
    liability_total += data.NetProfit;
    $("#profit-and-loss-table-body").html(context);

    $("#balance-sheet-duration-header").html(
      `Till : ${dateFormat(PostObject.to)}`
    );
    $("#asset-total").html("Asset Total = " + asset_total);
    $("#liability-total").html("Liability Total = " + liability_total);
    $("#balance-sheet-div").show();

    TotalAsset = asset_total;
    TotalLiability = liability_total;
    NetProfitAndLoss = data.NetProfit;
  });
  return;
}

$("#loadBalanceSheet").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  click: function (args) {
    getBalanceSheet(new Date($("#balance-sheet-to-date").val()));
  },
});
let global_balance_sheet_template = {};
populateBalanceSheetReportTemplate = function () {
  $.ajax({
    url: "/api/report-templates/getReportTemplate/BalanceSheet",
    type: "GET",
    success: function (data) {
      hideLoader();
      global_balance_sheet_template = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};

$("#printBalanceSheet").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  cssClass: "e-info mt-2",
  click: function (args) {
    PrintObject = {
      OrganizationName,
      Address,
      Phone,
      CurrentAssetArray,
      FixedAssetArray,
      LongTermLiabilityArray,
      CurrentLiabilityArray,
      OwnersEquityArray,
      NetProfitAndLoss,
      TotalAsset,
      TotalLiability,
      To: $("#balance-sheet-to-date").val(),
    };
    setGiveReport(global_balance_sheet_template.Content, PrintObject);
    hidebackdrop();
    // var fileName = "";
    // var report = new Stimulsoft.Report.StiReport();
    // report.load(global_balance_sheet_template.Content);
    // report.dictionary.databases.clear();
    // report.regData("Demo", "Demo", PrintObject);
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
    //       form.append("Files", blob, "balancesheet.pdf");
    //       var fileUrl = URL.createObjectURL(blob);
    //       window.open(fileUrl);
    //      // URL.revokeObjectURL();
    //     },
    //     report,
    //     stream,
    //     pdfSettings
    //   );
    // }, false);
  },
});
