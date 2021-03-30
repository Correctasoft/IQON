let GeneralLedgerDataForPrint = [];

$(function () {
  populateGeneralLedgerTemplate();
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  $("#fromdatepicker").ejDateTimePicker({
    width: "100%",
    value: d,
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "MMM yyyy",
  });

  $("#tilldatepicker").ejDateTimePicker({
    width: "100%",
    value: new Date(),
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "MMM yyyy",
  });
  populateGeneralLedger();
});
populateGeneralLedger = function () {
  let PostObject = {
    startDate: new Date(document.getElementById("fromdatepicker").value),
    endDate: new Date(document.getElementById("tilldatepicker").value),
    accountid: document.getElementById("accountsforgeneralledger").value,
  };
  showLoader();
  $.post("api/journalvoucher/getjournalentries", PostObject, function (
    data,
    status
  ) {
    if (data.length > 0) {
      var dateFormatejgrid =
          "{0:" +
          ej.preferredCulture()["calendars"]["standard"]["patterns"]["d"] +
          "}",
        columnWidth = window.theme == "material" ? 70 : 60;
      //console.log(JSON.stringify(data));
      GeneralLedgerDataForPrint = data;
      var data = ej.parseJSON(data);
      $("#TreeGridContainer").ejTreeGrid({
        showTotalSummary: true,
        //showSummaryRow: true,
        summaryRows: [
          {
            title: "Total",
            summaryColumns: [
              {
                summaryType: ej.TreeGrid.SummaryType.Custom,
                customSummaryValue: CreditSummaryGeneralLedger,
                displayColumn: "Credit",
              },
              {
                summaryType: ej.TreeGrid.SummaryType.Custom,
                customSummaryValue: DebitSummaryGeneralLedger,
                displayColumn: "Debit",
              },
            ],
          },
        ],
        toolbarSettings: {
          showToolbar: true,
          toolbarItems: [ej.TreeGrid.ToolbarItems.Search],
        },
        searchSettings: {
          searchHierarchyMode: ej.TreeGrid.SearchHierarchyMode.Child,
        },
        dataSource: data,
        childMapping: "Details",
        enableCollapseAll: true,
        sizeSettings: { height: "66vh" },
        scrollSettings: {
          frozenRows: 2,
          height:
            $(window).height() -
            ($(window).height() * ((37 * $(window).height()) / 937)) / 100,
        },
        treeColumnIndex: 1,
        allowColumnResize: true,
        isResponsive: true,
        rowHeight:
          window.theme == "material"
            ? 48
            : window.theme == "office-365"
            ? 36
            : 30,
        load: function () {
          if (window.theme == "material") this.treeIndentLevelWidth = 16;
        },
        columns: [
          {
            field: "CreationDate",
            headerText: "Creation Date",
            width: 100,
            type: "datetime",
            format: "{0:dd-MMM-yyyy hh:mm:ss tt}",
          },
          { field: "Name", headerText: "Tran No:", width: 100 },
          { field: "Debit", headerText: "Debit", width: columnWidth },
          { field: "Credit", headerText: "Credit", width: columnWidth },
          { field: "Balance", headerText: "Balance", width: columnWidth },
          { field: "Remarks", headerText: "Remarks" },
        ],
      });
      $("#TreeGridContainer").show();
      hideLoader();
    } else {
      $("#TreeGridContainer").hide();
    }
    hideLoader();
  });
};
$("#loadGeneralLedgerData").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});
$("#printGeneralLedgerData").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});
function CreditSummaryGeneralLedger(args, data) {
  //ej.sum is aggregate to add data of total costs from datasource
  return ej.sum(data, "Credit");
}
function DebitSummaryGeneralLedger(args, data) {
  //ej.sum is aggregate to add data of total costs from datasource
  return ej.sum(data, "Debit");
}
 
printGeneralLedger = function () {
  let printData = { Data: [] };
  printData.OrganizationName = OrganizationName;
  printData.Address = Address;
  printData.Phone = Phone;
  printData.FromDate = dateFormat(new Date(document.getElementById("fromdatepicker").value));
  printData.ToDate = dateFormat(new Date(document.getElementById("tilldatepicker").value));
  let tempData = JSON.parse(JSON.stringify(GeneralLedgerDataForPrint));
  for (let i = 0; i < tempData.length; i++) {
    tempData[i].CreationDate = dateFormat(tempData[i].CreationDate);
    printData.Data.push(tempData[i]);
    for (let j = 0; j < tempData[i].Details.length; j++) {
      tempData[i].Details[j].CreationDate = dateFormat(tempData[i].Details[j].CreationDate);
      printData.Data.push(tempData[i].Details[j]);
    }
    delete tempData[i].Details;
  }
  setGiveReport(global_general_ledger_template.Content, printData);
  hidebackdrop();
};


let global_general_ledger_template = {};
populateGeneralLedgerTemplate = function () {
  $.ajax({
    url: "/api/report-templates/getReportTemplate/GeneralLedger",
    type: "GET",
    success: function (data) {
      hideLoader();
      global_general_ledger_template = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};
