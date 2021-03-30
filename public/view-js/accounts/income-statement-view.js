let RevenueArray = [],
  CostOfGoodSoldArray = [],
  ExpenseArray = [],
  GrossProfit = 0,
  NetProfit = 0;

$(function () {
  populateIncomeStatementReportTemplate();
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  $("#income-statement-from-date").ejDatePicker({
    width: "100%",
    value: d,
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "dd MMM yyyy",
  });

  $("#income-statement-to-date").ejDatePicker({
    width: "100%",
    value: new Date(),
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "dd MMM yyyy",
  });
});
var global_incomestatement_sum = 0;
function buildTableData(data, showAddLess, Name) {
  let arrayforReport = [];
  var context = "",
    i,
    sum = 0;
  for (i = 0; i < data.length; i++) {
    let objectoPush = {};
    context += "<tr>";
    if (showAddLess) {
      if (data[i].Balance < 0) {
        context += "<td>(less)</td>";
        objectoPush.Impact = "(less)";
      } else {
        context += "<td>(add)</td>";
        objectoPush.Impact = "(add)";
      }
    } else {
      objectoPush.Impact = "";
    }
    context += `<td>${data[i]._id.AccountName}</td>
        <td class="text-right">${data[i].Balance}</td>
        </tr>`;
    objectoPush.AccountName = data[i]._id.AccountName;
    objectoPush.Balance = data[i].Balance;
    sum += data[i].Balance;
    arrayforReport.push(objectoPush);
  }
  context += `<tr>`;
  if (showAddLess) {
    context += `  <td></td>`;
  }
  context += `  <td>${Name}</td>
          <td class="text-right">${sum}</td>
      </tr>`;
  global_incomestatement_sum = sum;
  arrayforReport.push({ Impact: "", AccountName: Name, Balance: sum });
  switch (Name) {
    case "Total Revenue": {
      RevenueArray = arrayforReport;
      break;
    }
    case "Cost of Good Sold": {
      CostOfGoodSoldArray = arrayforReport;
      break;
    }
    case "Total Expense": {
      ExpenseArray = arrayforReport;
      break;
    }
    default:
      break;
  }
  return context;
}

function getIncomeStatement(from, to) {
  var PostObject = {
    from: from,
    to: to,
  };
  showLoader();
  $.post("/api/journalvoucher/incomestatement", PostObject, function (
    data,
    status
  ) {
    hideLoader();
    var context;
    var sum_IncomeAccountReport,
      sum_COGSAccountReport,
      sum_ExpenseAccountReport;
    //Revenue table bind
    context = buildTableData(data.IncomeAccountReport, true, "Total Revenue");
    sum_IncomeAccountReport = global_incomestatement_sum;
    $("#revenue-table-body").html(context);

    // Cost of good sold bind
    context = buildTableData(data.COGSAccountReport, true, "Cost of Good Sold");
    sum_COGSAccountReport = global_incomestatement_sum;

    context += `<tr> <td></td>
        <td>Gross Profit</td>
        <td class="text-right">${
          sum_IncomeAccountReport - sum_COGSAccountReport
        }</td>
    </tr>`;
    $("#cost-of-good-sold-table-body").html(context);
    GrossProfit = sum_IncomeAccountReport - sum_COGSAccountReport;

    // Cost of good sold bind
    context = buildTableData(data.ExpenseAccountReport, false, "Total Expense");
    sum_ExpenseAccountReport = global_incomestatement_sum;
    context += `<tr>
        <td>Net Profit and Loss</td>
        <td class="text-right">${
          sum_IncomeAccountReport -
          sum_COGSAccountReport -
          sum_ExpenseAccountReport
        }</td>
    </tr>`;
    NetProfit =
      sum_IncomeAccountReport -
      sum_COGSAccountReport -
      sum_ExpenseAccountReport;
    $("#expense-table-body").html(context);

    $("#income-statement-duration-header").html(
      `From : ${dateFormat(PostObject.from)} -  To : ${dateFormat(
        PostObject.to
      )}`
    );
    $("#income-report-div").show();
  });
  return;
}

$("#loadIncomeStatement").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  click: function (args) {
    getIncomeStatement(
      new Date($("#income-statement-from-date").val()),
      new Date($("#income-statement-to-date").val())
    );
  },
});

$("#printIncomeStatement").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  cssClass: "e-info mt-2",
  click: function (args) {
    PrintObject = {
      OrganizationName,
      Address,
      Phone,
      RevenueArray,
      ExpenseArray,
      CostOfGoodSoldArray,
      NetProfit,
      GrossProfit,
      From: $("#income-statement-from-date").val(),
      To: $("#income-statement-to-date").val(),
    };
    setGiveReport(global_income_statement_template.Content, PrintObject);
    hidebackdrop();
    //   var fileName = "";
    //   var report = new Stimulsoft.Report.StiReport();
    //   report.load(global_income_statement_template.Content);
    //   report.dictionary.databases.clear();
    //   report.regData("Demo", "Demo", PrintObject);
    //   report.render();
    //   var pdfSettings = new Stimulsoft.Report.Export.StiPdfExportSettings();
    //   var pdfService = new Stimulsoft.Report.Export.StiPdfExportService();
    //   var stream = new Stimulsoft.System.IO.MemoryStream();
    //   report.renderAsync(function () {
    //     pdfService.exportToAsync(
    //       function () {
    //         var data = stream.toArray();
    //         var blob = new Blob([new Uint8Array(data)], {
    //           type: "application/pdf",
    //         });
    //         var form = new FormData();
    //         form.append("Files", blob, "incomestatement.pdf");
    //         var fileUrl = URL.createObjectURL(blob);
    //         window.open(fileUrl);
    // //          URL.revokeObjectURL();
    //       },
    //       report,
    //       stream,
    //       pdfSettings
    //     );
    //   }, false);
  },
});

let global_income_statement_template = {};
populateIncomeStatementReportTemplate = function () {
  $.ajax({
    url: "/api/report-templates/getReportTemplate/IncomeStatement",
    type: "GET",
    success: function (data) {
      hideLoader();
      global_income_statement_template = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};
