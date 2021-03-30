let global_accounts = [];
let global_account_types = [];

PopulateGlobalAccountTypes = function () {
  $.ajax({
    url: "/api/accounttypes",
    type: "GET",
    success: function (data) {
      global_account_types = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};

PopulateGlobalAccounts = function () {
  $.ajax({
    url: "/api/accounts",
    type: "GET",
    success: function (data) {
      global_accounts = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};

PopulateGlobalAccountTypes();
PopulateGlobalAccounts();

//payment type populate
var checkAccountTypeExists = setInterval(function () {
  if (global_account_types.Items.length) {
    let currentAssetType = global_account_types.Items.filter(
      (m) => m.Name === "Current Asset"
    )[0];
    let currentAssetAccounts = global_accounts.Items.filter(
      (n) => n.AccountType._id === currentAssetType._id
    );
    $("#expense-payment-type").ejDropDownList({
      dataSource: currentAssetAccounts,
      watermarkText: "Select Payment Type",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
      width: "100%",
    });
    $("#salary-payment-type").ejDropDownList({
      dataSource: currentAssetAccounts,
      watermarkText: "Select Payment Type",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
      width: "100%",
    });
    $("#product-purchase-payment-type").ejDropDownList({
      dataSource: currentAssetAccounts,
      watermarkText: "Select Payment Type",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
      //cssClass: "form-control",
      width: "100%",
    });
    $("#accountsforgeneralledger").ejDropDownList({
      dataSource: global_accounts.Items,
      watermarkText: "Select Account",
      fields: { text: "Name", value: "_id" },
      enableFilterSearch: true,
      width: "200",
    });
    clearInterval(checkAccountTypeExists);
  }
}, 1000); // check every 100ms
