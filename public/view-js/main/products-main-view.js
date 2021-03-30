let global_category_data = [];
let global_autoComplete_variant_data = [];
let global_unit_relations = [];
PopulateGlobalCategory = function () {
  $.ajax({
    url: "/api/categories",
    type: "GET",
    success: function (data) {
      global_category_data = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};

PopulateGlobalProductVariantList = function () {
  $.ajax({
    url: "api/products/getproductpurchasedata",
    type: "GET",
    success: function (data) {
      global_autoComplete_variant_data = data;
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let loadUnitRelations = function () {
  $.ajax({
    url: "/api/unitrelations",
    type: "GET",
    success: function (data) {
      global_unit_relations = data.Items;
    },
    error: function (error) {
      console.log(error);
    },
  });
};

loadUnitRelations();
PopulateGlobalCategory();
PopulateGlobalProductVariantList();