
$(function () {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  $("#dailsummeryfromdate-itemwisesale").ejDateTimePicker({
    width: "100%",
    value: d,
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "MMM yyyy",
  });

  $("#dailsummerytodate-itemwisesale").ejDateTimePicker({
    width: "100%",
    value: new Date(),
    startLevel: ej.DatePicker.Level.Year,
    dateFormat: "MMM yyyy",
  });

  $.ajax({
    url: "/api/workduration",
    type: "GET",
    success: function (data) {
      
      data = data.map((x) => {
        return {
          Name: x.Name,
          Val: `${new Date(x.StartTime)}&${new Date(x.EndTime)}`,
        };
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
      $("#workduration-itemwisesale").ejDropDownList({
        dataSource: data,
        width: "100%",
        watermarkText: "Select Work Duration",
        fields: { text: "Name", value: "Val" },
        enableFilterSearch: true,

        change: function (args) {
          var [from, to] = args.value.split("&");
          getItemSalesReport(from, to);
        },
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
});

function getItemSalesReport(from, to) {
  var PostObject = {
    from: from,
    to: to,
  };
  showLoader();
  $.post("/api/reports/item-wise-sale", PostObject, function (data, status) {
    hideLoader();
    var context = "",
      i;
    //Category wise sale info bind
    context = "";
    for (i = 0; i < data.dataCategoryWiseSales.length; i++) {
      context += `<tr>
              <td>${data.dataCategoryWiseSales[i]._id.CategoryName}</td>
              <td class="text-right">${data.dataCategoryWiseSales[i].NetTotal}</td>
          </tr>`;
    }
    context += `<tr>
              <td>Total</td>
              <td class="text-right">${data.grandTotal}</td>
          </tr>`;
    $("#itemwisesale-category-wise-sale-table-body").html(context);

    //Item wise sale info bind
    context = "";
    for (i = 0; i < data.dataItemWiseSales.length; i++) {
      context += `<tr>
            <td>${data.dataItemWiseSales[i].ProductName}</td>  
            <td>${data.dataItemWiseSales[i].VariantName}</td>
              
              <td>${data.dataItemWiseSales[i].Quantity}</td>
              <td class="text-right">${data.dataItemWiseSales[i].TotalAmount}</td>
          </tr>`;
    }
    $("#itemwisesale-item-wise-sale-table-body").html(context);

    $("#item-wise-sale-header").html(
      `From : ${dateFormat(PostObject.from)} -  To : ${dateFormat(
        PostObject.to
      )}`
    );
    $("#item-wise-sale-div").show();
  });
  return;
}

$("#laodItemWiseSaleData").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
  click: function (args) {
    getItemSalesReport(
      new Date($("#dailsummeryfromdate-itemwisesale").val()),
      new Date($("#dailsummerytodate-itemwisesale").val())
    );
  },
});
