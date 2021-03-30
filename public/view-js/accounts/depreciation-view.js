$(function () {
    getFicedAssets();
});
var global_fa_data=0;
function fixDate(currentdate) {
    return currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear();
    // + "  "
    // + currentdate.getHours() + ":"
    // + currentdate.getMinutes() + ":"
    // + currentdate.getSeconds();
}

function getFicedAssets() {
    $.ajax({
        url: "/api/accounts/fixed-assets",
        type: "GET",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                data[i].Percentage = (data[i].Credit / data[i].Debit) * 100;
                data[i].Percentage = data[i].Percentage + "%";
                data[i].FromDate = fixDate(new Date(data[i].InsertionDate));
                data[i].ToDateToShow = data[i].ToDate ? fixDate(new Date(data[i].ToDate)) : "";
                data[i].ExpectedDepreciationRate = "10" + "%";
            }
            $("#fixedassets").ejGrid({
                dataSource: data,
                // allowPaging: true,
                enablelAltRow: true,
                allowSorting: true,
                // actionComplete: "completeFixedAsset",
                allowFiltering: true,
                allowSorting: true,
                isResponsive: true,
                filterSettings: { filterType: "menu" },
                enableResponsiveRow: false,
                editSettings: {
                    // allowEditing: true,
                    // allowAdding: true,
                    // allowDeleting: true,
                    // editMode: ej.Grid.EditMode.Dialog,
                },
                toolbarSettings: {

                },
                columns: [
                    {
                        field: "_id",
                        isPrimaryKey: true,
                        visible: false,
                        headerText: "_id",
                        textAlign: ej.TextAlign.Left,
                        validationRules: { required: true },
                        width: 20,
                    },
                    {
                        field: "Name",
                        headerText: "Name",
                        textAlign: ej.TextAlign.Left,
                        validationRules: { required: true, number: false },
                        width: 90,
                    },
                    {
                        field: "FromDate",
                        headerText: "FromDate",
                        textAlign: ej.TextAlign.Left,
                        validationRules: { required: true, number: false },
                        width: 90,
                    },
                    {
                        field: "ToDateToShow",
                        headerText: "ToDate",
                        textAlign: ej.TextAlign.Left,
                        validationRules: { required: true, number: false },
                        width: 90,
                    },
                    {
                        field: "ProposedDepreciationRate",
                        headerText: "Proposed Depreciation Rate",
                        textAlign: ej.TextAlign.Left,
                        validationRules: { required: true, number: false },
                        width: 90,
                        template: "<span>{{:ProposedDepreciationRate}}%</spa}n>",
                    },
                    {
                        field: "Credit",
                        headerText: "Credit",
                        textAlign: ej.TextAlign.Left,
                        width: 90,
                    },
                    {
                        field: "Debit",
                        headerText: "Debit",
                        textAlign: ej.TextAlign.Left,
                        validationRules: { required: true, number: false },
                        width: 90,
                    },
                    {
                        field: "Percentage",
                        headerText: "Percentage",
                        textAlign: ej.TextAlign.Left,
                        validationRules: { required: true, number: false },
                        width: 90,
                    },
                ],
            });
            $("#fixedassets").ejGrid({
                recordClick: function (args) {
                    var fa_data = args.data;
                    global_fa_data= fa_data;
                    $('#_id').val(fa_data._id);
                    $("#depreciation-from-date").ejDatePicker({
                        width: "100%",
                        value: new Date(fa_data.InsertionDate),
                        startLevel: ej.DatePicker.Level.Year,
                        dateFormat: "dd MMM yyyy",
                        readOnly: true
                    });
                    $("#depreciation-to-date").ejDatePicker({
                        width: "100%",
                        value: fa_data.ToDate ? new Date(fa_data.ToDate) : "",
                        startLevel: ej.DatePicker.Level.Year,
                        dateFormat: "dd MMM yyyy",
                        minDate: new Date(fa_data.InsertionDate),
                        change: function (args) {
                            toDateChanged(fa_data);
                        }
                    });
                    toDateChanged(fa_data);
                    $('#fixedAssetModal').modal('show');
                    hidebackdrop();
                }
            });
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function toDateChanged(fa_data) {
    var to_date = new Date($("#depreciation-to-date").val());
    var from_date = new Date($("#depreciation-from-date").val());
    if (to_date) {
        var diff = parseInt(to_date.getFullYear()) - parseInt(from_date.getFullYear());
        var remaining = fa_data.Debit - fa_data.Credit;
        var per = Math.floor(((remaining / diff) * 100) / remaining);
        $("#depreciation-rate").ejPercentageTextbox({
            width:"100%", 
            value: per ,
            change: function (args) {
            percentageChanged();
           }
        });
    }
}

function percentageChanged(){
    var from_date = new Date($("#depreciation-from-date").val());
    var remaining = global_fa_data.Debit- global_fa_data.Credit;
    var per = $("#depreciation-rate").val();
    var amount_per_year= parseInt((parseFloat(per)*remaining)/100);
    var years= parseInt(remaining/amount_per_year);

    var newdate= from_date.getFullYear()+years;
    var to_date= new Date(from_date.getMonth()+"/"+from_date.getDate()+"/"+newdate);

    $("#depreciation-to-date").ejDatePicker({
        width: "100%",
        value: to_date,
        startLevel: ej.DatePicker.Level.Year,
        dateFormat: "dd MMM yyyy",
        minDate: new Date(global_fa_data.InsertionDate),
        change: function (args) {
            toDateChanged(global_fa_data);
        }
    });
}

function postData(){
    var PostObject={
        to_date: new Date($("#depreciation-to-date").val()),
        per: $("#depreciation-rate").val(),
        id: $('#_id').val()
    }
    if(PostObject.to_date=="" || PostObject.per==""){
        alert("Please input Data");
        return;
    }
    showLoader();
    $.post("/api/accounts/fixed-assets", PostObject, function (data, status) {
        hideLoader();
        getFicedAssets();
    });
}