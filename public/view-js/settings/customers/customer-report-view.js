let global_print_object = {};
let global_invoice_template = {};
let global_memo_template = {};
populateReportTemplate = function () {
  $.ajax({
    url: "/api/report-templates/getReportTemplate/ReprintPOSInvoice",
    type: "GET",
    success: function (data) {
      hideLoader();
      global_invoice_template = data;
    },
    error: function (error) {
      console.log(error);
    },
  });

  $.ajax({
    url: "/api/report-templates/getReportTemplate/ReprintPOSMemo",
    type: "GET",
    success: function (data) {
      hideLoader();
      global_memo_template = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};

//#region populate Invoice lists
populateSalesInvoiceList = function () {
  let PostObject = {
    customer_id: $("#customerdropdown").val()
  };
  showLoader();
  $.post("api/sales/getinvoices-by-customer/", PostObject, function (data, status) {
    if (data.length > 0) {
      //console.log(data);
      $("#templatelist").show();
      $("#templatelist").ejListView({
        dataSource: data,
        renderTemplate: true,
        width: 450,
        height:
          $(window).width() < 1400
            ? $(window).height() + 100
            : $(window).height() - $(window).height() * (25 / 100),
        mouseUp: "onmouseup",
        enableFiltering: true,
      });

      //fixing date format
      var targets = document.getElementsByClassName("aboutstyle");
      for (var i = 0; i < targets.length; i++) {
        element = targets[i];
        element.innerHTML = dateFormat(element.innerText);
      }

      //inserting payment details in html
      var context;
      for (var i = 0; i < data.length; i++) {
        context = "";
        var keys = Object.keys(data[i].Payments);
        keys.forEach((key) => {
          context += `${key} : ${data[i].Payments[key]} , `;
        });
        $("#" + data[i]._id + "Payment").html(
          context.substring(0, context.length - 2)
        );
      }
    } else {
      $("#templatelist").hide();
    }
    hideLoader();
  });
};
//#endregion
function objectToArrayOfObjects(obj) {
  var Array = [];
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    Array.push({ Name: keys[i], Value: obj[keys[i]] });
  }
  return Array;
}

onmouseup = function (e) {
  if (typeof e.model !== "undefined") {
    global_print_object["SaleTransaction"] = e.model.dataSource[e.index];
    global_print_object.paymentDataForPrint = Object.entries(
      global_print_object.SaleTransaction.Payments
    ).map(([key, value]) => ({ key, value }));
    global_print_object.OtherCalculations = Object.entries(
      global_print_object.SaleTransaction.OtherCalculations
    ).map(([key, value]) => ({ key, value }));
    global_print_object.Customer = global_print_object.SaleTransaction.Customer
      ? [
          {
            Name: global_print_object.SaleTransaction.Customer.Name,
            Phone: global_print_object.SaleTransaction.Customer.Phone,
            Address: global_print_object.SaleTransaction.Customer.Address,
          },
        ]
      : [];

    global_print_object.OrganizationName = OrganizationName;
    global_print_object.Address = Address;
    global_print_object.Phone = Phone;
    global_print_object.Date= dateFormat(e.model.dataSource[e.index].SaleDate);
    global_print_object.InvoiceNo= e.model.dataSource[e.index].Name;
    global_print_object.TotalAmount= e.model.dataSource[e.index].TotalAmount;
    

    var calArray = objectToArrayOfObjects(
      e.model.dataSource[e.index].OtherCalculations
    );
    calArray.push({
      Name: "Grand Total",
      Value: e.model.dataSource[e.index].TotalAmount,
    });

    var paymentArray = objectToArrayOfObjects(
      e.model.dataSource[e.index].Payments
    );
    paymentArray.push({
      Name: "Total",
      Value: e.model.dataSource[e.index].TotalAmount,
    });
    //console.log(JSON.stringify(e.model.dataSource[e.index]));
    if (e.model.dataSource[e.index].Customer != null) {
      $("#customer-info").html(`<h2 class="bb-0">Customer Info: </h2>
      <h3 class="ml-1">Name: ${e.model.dataSource[e.index].Customer.Name}</h3>
      <h3 class="ml-1">Phone: ${
        e.model.dataSource[e.index].Customer.Phone
      }</h3>`);
      $("#customer-info").show();
    } else {
      $("#customer-info").hide();
    }

    if (e.model.dataSource[e.index].IsRefunded == true) {
      $("#refund-info").html("<h2 class='text-danger bb-0'>Refunded</h2>");
    } else {
      $("#refund-info").html("");
    }
    transactionId = e.model.dataSource[e.index]._id;
    $.ajax({
      url: "api/sales/transaction-details/" + transactionId,
      type: "GET",
      success: function (data) {
        global_print_object["SaleTransactionDetails"] =
          data.saleTransactionDetails;
        $("#transactionGrid").ejGrid({
          dataSource: data.dataToSend,
          // allowPaging: true,
          enablelAltRow: true,
          allowSorting: true,
          // actionComplete: "completeUsers",
          //allowFiltering: true,
          isResponsive: true,
          filterSettings: { filterType: "menu" },
          enableResponsiveRow: false,
        });

        $("#calculationGrid").ejGrid({
          dataSource: calArray,
          enablelAltRow: true,
          allowSorting: true,
          // actionComplete: "completeUsers",
          //allowFiltering: true,
          isResponsive: true,
          filterSettings: { filterType: "menu" },
          enableResponsiveRow: false,
        });

        $("#paymentGrid").ejGrid({
          dataSource: paymentArray,
          enablelAltRow: true,
          allowSorting: true,
          // actionComplete: "completeUsers",
          //allowFiltering: true,
          isResponsive: true,
          filterSettings: { filterType: "menu" },
          enableResponsiveRow: false,
        });
        $("#show-transaction-details-modal-button").click();
        //console.log(JSON.stringify(global_print_object));
      },
      error: function (error) {
        console.log(error);
      },
    });
    
  }
};

hidebackdrop = () => {
  setTimeout(function () {
    $(".modal-backdrop").hide();
  }, 200);
};

//#region customer populate
$(function () {
  populateReportTemplate();
  $.ajax({
    url: "/api/customers",
    type: "GET",
    success: function (data) {
      global_customer_data = data;
      $("#customerdropdown").ejDropDownList({
        dataSource: data.Items,
        watermarkText: "Select Customer",
        fields: { text: "Phone", value: "_id" },
        template: '<div>${Name} - ${Phone}</div>',
        enableFilterSearch: true,
        change: function (args) {
          populateSalesInvoiceList();
        },
      });
      $("#customerdropdown").ejDropDownList({ width: "100%" });
    },
    error: function (error) {
      console.log(error);
    },
  });
});

//#endregion

PrintInvoice = function () {
  $('#reportViewerModal').modal('show');
  global_print_object=addBanglaToPrintObj(global_print_object);
  setGiveReport(global_invoice_template.Content, global_print_object);
  hidebackdrop();
};

PrintMemo = function(){
  $('#reportViewerModal').modal('show');
  global_print_object=addBanglaToPrintObj(global_print_object);
  //console.log(JSON.stringify(global_print_object));
  setGiveReport(global_memo_template.Content, global_print_object);
  hidebackdrop();
}

function mapToBangla(input){
  var numbers = {
    0 :'০',
    1 :'১',
    2 :'২',
    3 :'৩',
    4 :'৪',
    5 :'৫',
    6 :'৬',
    7 :'৭',
    8 :'৮',
    9 :'৯'
  };
  input= input+"";
  var output = [];
  for (var i = 0; i < input.length; ++i) {
    if (numbers.hasOwnProperty(input[i])) {
      output.push(numbers[input[i]]);
    } else {
      output.push(input[i]);
    }
  }
  return output.join('');
}

function InfoToBangla(data){
  var data_to_send=[],obj;
  for(var i=0; i<data.length ; i++){
    obj= {... data[i]};
    obj.value= mapToBangla(obj.value);
    data_to_send.push(obj)
  }
  return data_to_send;
}

function changeSaleTransactoinToBangla(data){
    var bangla_data=[],obj;
    for(var i=0; i<data.length; i++){
      obj= {...data[i]};
      obj.NetTotal= mapToBangla(obj.NetTotal);
      obj.TotalAmount= mapToBangla(obj.TotalAmount);
      obj.SellingPrice= mapToBangla(obj.SellingPrice);
      obj.Quantity = mapToBangla(obj.Quantity);
      bangla_data.push(obj)
    }
    return bangla_data;
}

function addBanglaToPrintObj(data_x){
  var data= {...data_x}
  data.OtherCalculations_bangla= InfoToBangla(data.OtherCalculations)
  data.paymentDataForPrint_bangla= InfoToBangla(data.paymentDataForPrint);
  data.SaleTransactionDetails_bangla= changeSaleTransactoinToBangla(data.SaleTransactionDetails);
  data.TotalAmount_bangla= mapToBangla(data.TotalAmount);
  return data; 
}
