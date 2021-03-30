var itemwisesale_for_print = null;
var global_item_wise_sale_report = null;
$(function () {
    loadItemWiseSaleReportTemplate();
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
            $("#workduration-itemwisesale").ejDropDownList({
                dataSource: data,
                width: "100%",
                watermarkText: "Select Work Duration",
                fields: { text: "Name", value: "Val" },
                enableFilterSearch: true,

                change: function (args) {
                    var [from, to] = args.value.split("&");
                    //getItemSalesReport(from, to);

                    $("#dailsummeryfromdate-itemwisesale").ejDateTimePicker({
                        width: "100%",
                        value: new Date(from),
                        startLevel: ej.DatePicker.Level.Year,
                        dateFormat: "MMM yyyy",
                    });
                
                    $("#dailsummerytodate-itemwisesale").ejDateTimePicker({
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

function loadItemWiseSaleReportTemplate() {
    $.ajax({
      url: "/api/report-templates/getReportTemplate/ItemWiseSale",
      type: "GET",
      success: function (data) {
        global_item_wise_sale_report = data;
      },
      error: function (error) {
        console.log(error);
      },
    });
  }


function getItemSalesReport(from, to) {
    var PostObject = {
        from: from,
        to: to
    };
    showLoader();
    $.post("/api/reports/item-wise-sale", PostObject, function (data, status) {
        hideLoader();
        itemwisesale_for_print= data;
        var context = "", i, itemwisetotal=0;
        
        //Category wise sale info bind
        context = "";
        for (i = 0; i < data.dataCategoryWiseSales.length; i++) {
            context += `<tr>
              <td>${data.dataCategoryWiseSales[i]._id.CategoryName}</td>
              <td class="text-right">${data.dataCategoryWiseSales[i].NetTotal}</td>
          </tr>`;
          itemwisetotal+= parseFloat(data.dataCategoryWiseSales[i].NetTotal);
        }
        context += `<tr>
              <td>Total</td>
              <td class="text-right">${itemwisetotal}</td>
          </tr>`;
        $('#itemwisesale-category-wise-sale-table-body').html(context);

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
        $('#itemwisesale-item-wise-sale-table-body').html(context);


        $('#item-wise-sale-header').html(`From : ${dateFormat(PostObject.from)} -  To : ${dateFormat(PostObject.to)}`);
        $('#item-wise-sale-div').show();
    });
    return;
}

$("#laodItemWiseSaleData").ejButton({
    showRoundedCorner: true,
    size: "medium",
    width: "200px",
    click: function (args) {
        getItemSalesReport(new Date($('#dailsummeryfromdate-itemwisesale').val()), new Date($('#dailsummerytodate-itemwisesale').val()))
    }
});

$("#printItemWiseSaleData").ejButton({
    showRoundedCorner: true,
    size: "medium",
    width: "200px",
    click: function (args) {
      printItemWiseSale();
    }
  });

  function printItemWiseSale() {
    if(global_item_wise_sale_report==null){
        alert("Item Wise Sale Report template hasn't been loaded");
        return;
    }
    itemwisesale_for_print.from = dateFormat(new Date($('#dailsummeryfromdate-itemwisesale').val()));
    itemwisesale_for_print.to = dateFormat(new Date($('#dailsummerytodate-itemwisesale').val()));
    itemwisesale_for_print.OrganizationName = organization.OrganizationName;
    itemwisesale_for_print.Address = organization.Address;
    itemwisesale_for_print.Phone = organization.Phone;
    let PrintObject = { Data: itemwisesale_for_print };
    //console.log(JSON.stringify(PrintObject));
    $('#reportViewerModal').modal('show');
    setGiveReport(global_item_wise_sale_report.Content, PrintObject);
    hidebackdrop();
  }