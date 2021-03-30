var dailysummery_for_print = null;
var global_daily_summery_report = null;
$(function () {
  loadDailySummeryReportTemplate();
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  $("#dailsummeryfromdate").ejDateTimePicker({
    width: "100%",
    value: d,
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "MMM yyyy",
  });

  $("#dailsummerytodate").ejDateTimePicker({
    width: "100%",
    value: new Date(),
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "MMM yyyy",
  });

  $.ajax({
    url: "/api/workduration",
    type: "GET",
    success: function (data) {
      data = data.map(x => {
        return {
          Name: x.Name,
          Val: `${new Date(x.StartTime)}&${new Date(x.EndTime)}`
        }
      });
      //1 mnth
      var now = new Date(Date.now());
      var dt = new Date(Date.now());
      dt.setDate(dt.getDate() - 30);
      dt = new Date(dt.getTime());
      data.unshift({ Name: "This Month", Val: `${dt}&${now}` });
      // 1 week
      dt = new Date(Date.now());
      dt.setDate(dt.getDate() - 7);
      dt = new Date(dt.getTime());
      data.unshift({ Name: "This Week", Val: `${dt}&${now}` });
      //1 day
      dt = new Date(new Date().setHours(0, 0, 0, 0));
      data.unshift({ Name: "Today", Val: `${dt}&${now}` });
      $("#workduration").ejDropDownList({
        dataSource: data,
        width: "100%",
        watermarkText: "Select Work Duration",
        fields: { text: "Name", value: "Val" },
        enableFilterSearch: true,

        change: function (args) {
          var [from, to] = args.value.split("&");
          // getDailySummery(from,to);

          $("#dailsummeryfromdate").ejDateTimePicker({
            width: "100%",
            value: new Date(from),
            startLevel: ej.DatePicker.Level.Year,
            dateFormat: "MMM yyyy",
          });

          $("#dailsummerytodate").ejDateTimePicker({
            width: "100%",
            value: new Date(to),
            startLevel: ej.DatePicker.Level.Year,
            dateFormat: "MMM yyyy",
          });
        }
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
});

function loadDailySummeryReportTemplate() {
  $.ajax({
    url: "/api/report-templates/getReportTemplate/DailySalesSummery",
    type: "GET",
    success: function (data) {
      global_daily_summery_report = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function getDailySummery(from, to) {
  var PostObject = {
    from: from,
    to: to
  };
  showLoader();
  $.post("/api/reports/dailysummery", PostObject, function (data, status) {
    hideLoader();
    dailysummery_for_print = data;
    var context = "", i, keys;
    //console.log(data.dataCategoryWiseSales);
    //sales info bind
    keys = Object.keys(data.SalesSymmary);
    for (i = 0; i < keys.length; i++) {
      context += `<tr>
              <td>${keys[i]}</td>
              <td class="text-right">${data.SalesSymmary[keys[i]]}</td>
          </tr>`;
    }
    $('#sales-info-table-body').html(context);

    //income info bind
    context = "";
    keys = Object.keys(data.paymentSummary);
    for (i = 0; i < keys.length; i++) {
      context += `<tr>
              <td>${keys[i]}</td>
              <td class="text-right">${data.paymentSummary[keys[i]]}</td>
          </tr>`;
    }
    $('#income-info-table-body').html(context);

    //User wise sale info bind
    context = "";
    for (i = 0; i < data.dataUserWiseSales.length; i++) {
      context += `<tr>
              <td>${data.dataUserWiseSales[i].Name}</td>
              <td class="text-right">${data.dataUserWiseSales[i].TotalAmount}</td>
          </tr>`;
    }
    $('#user-wise-sale-table-body').html(context);

    //Category wise sale info bind
    context = "";
    for (i = 0; i < data.dataCategoryWiseSales.length; i++) {
      context += `<tr>
              <td>${data.dataCategoryWiseSales[i].CategoryName}</td>
              <td class="text-right">${data.dataCategoryWiseSales[i].NetTotal}</td>
          </tr>`;
    }
    $('#category-wise-sale-table-body').html(context);
    $('#daily-summery-header').html(`From : ${dateFormat(PostObject.from)} -  To : ${dateFormat(PostObject.to)}`);
    $('#daily-summery-div').show();
  });
  return;
}

$("#loadDailySummeryData").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  click: function (args) {
    getDailySummery(new Date($('#dailsummeryfromdate').val()), new Date($('#dailsummerytodate').val()))
  }
});

$("#printDailySummeryData").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  click: function (args) {
    printDailySummery();
  }
});

function printDailySummery() {
  if(global_daily_summery_report==null){
    alert("Daily Summery Report template hasn't been loaded");
    return;
  }
  dailysummery_for_print.from = dateFormat(new Date($('#dailsummeryfromdate').val()));
  dailysummery_for_print.to = dateFormat(new Date($('#dailsummerytodate').val()));
  dailysummery_for_print.OrganizationName = organization.OrganizationName;
  dailysummery_for_print.Address = organization.Address;
  dailysummery_for_print.Phone = organization.Phone;
  dailysummery_for_print.SalesSymmary = Object.entries(dailysummery_for_print.SalesSymmary).map(([key, value]) => ({ key, value }));
  dailysummery_for_print.paymentSummary = Object.entries(dailysummery_for_print.paymentSummary).map(([key, value]) => ({ key, value }));
  let PrintObject = { Data: dailysummery_for_print };
  //console.log(JSON.stringify(PrintObject));
  $('#reportViewerModal').modal('show');
  setGiveReport(global_daily_summery_report.Content, PrintObject);
  hidebackdrop();
}