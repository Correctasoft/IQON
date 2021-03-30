var daywisesale_for_print = null;
var global_day_wise_sale_report = null;
$(function () {
  loadDayWiseSaleReportTemplate();
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  $("#dailsummeryfromdate-daywisesale").ejDatePicker({
    width: "100%",
    value: d,
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "dd MMM yyyy",
  });

  $("#dailsummerytodate-daywisesale").ejDatePicker({
    width: "100%",
    value: new Date(),
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "dd MMM yyyy",
  });

  $("#laodDayWiseSaleData").ejButton({
    showRoundedCorner: true,
    size: "medium",
    width: "200px",
    click: function (args) {
      getDayWiseSalesReport(new Date($('#dailsummeryfromdate-daywisesale').val()), new Date($('#dailsummerytodate-daywisesale').val() + " 11:59 PM"))
    }
  });
  $("#printDayWiseSaleData").ejButton({
    showRoundedCorner: true,
    size: "medium",
    width: "200px",
    click: function (args) {
      printDayWiseSale();
    }
  });
});

function loadDayWiseSaleReportTemplate() {
  $.ajax({
    url: "/api/report-templates/getReportTemplate/DayWiseSale",
    type: "GET",
    success: function (data) {
      global_day_wise_sale_report = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function getDayWiseSalesReport(from, to) {
  var PostObject = {
    from: from,
    to: to
  };
  showLoader();
  $.post("/api/reports/day-wise-sale", PostObject, function (data, status) {
    console.log(data);
    hideLoader();
    daywisesale_for_print = data;
    var context = "", i;

    data.dataDayWiseSales = data.dataDayWiseSales.sort((a, b) => (new Date(`${a._id.month}/${a._id.day}/${a._id.year}`) > new Date(`${b._id.month}/${b._id.day}/${b._id.year}`)) ? -1 : ((new Date(`${a._id.month}/${a._id.day}/${a._id.year}`) < new Date(`${b._id.month}/${b._id.day}/${b._id.year}`)) ? 1 : 0));

    //Day wise sale info bind
    context = "";
    for (i = 0; i < data.dataDayWiseSales.length; i++) {
      context += `<tr>
            <td>${data.dataDayWiseSales[i]._id.day}/${data.dataDayWiseSales[i]._id.month}/${data.dataDayWiseSales[i]._id.year}</td>  
            <td class="text-right">${data.dataDayWiseSales[i].totalPrice}</td>
          </tr>`;
    }
    context += `<tr>
            <td>Total</td>  
            <td class="text-right">${data.grandTotal}</td>
          </tr>`;
    $('#daywisesale-table-body').html(context);

    $('#day-wise-sale-header').html(`From : ${dateFormat(PostObject.from)} -  To : ${dateFormat(PostObject.to)}`);
    $('#day-wise-sale-div').show();
  });
  return;
}

function printDayWiseSale() {
  if (global_day_wise_sale_report == null) {
    alert("Day Wise Sale Report template hasn't been loaded");
    return;
  }
  daywisesale_for_print.from = dateFormat(new Date($('#dailsummeryfromdate-daywisesale').val()));
  daywisesale_for_print.to = dateFormat(new Date($('#dailsummerytodate-daywisesale').val()));
  daywisesale_for_print.OrganizationName = organization.OrganizationName;
  daywisesale_for_print.Address = organization.Address;
  daywisesale_for_print.Phone = organization.Phone;
  let PrintObject = { Data: daywisesale_for_print };
  console.log(JSON.stringify(PrintObject));
  $('#reportViewerModal').modal('show');
  setGiveReport(global_day_wise_sale_report.Content, PrintObject);
  hidebackdrop();
}