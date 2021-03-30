var global_BranchGrid=null;
$(function () {
    var BranchsdataManager = ej.DataManager({
        url: "/api/branches",
        adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
    });

    global_BranchGrid= $("#BranchGrid").ejGrid({
        dataSource: BranchsdataManager, //window.gridData,
        allowPaging: true,
        enablelAltRow: true,
        allowSorting: true,
        actionComplete: "completeBranchs",
        allowFiltering: true,
        allowSorting: true,
        isResponsive: true,
        filterSettings: { filterType: "menu" },
        enableResponsiveRow: false,
        editSettings: {
            allowEditing: true,
            allowAdding: true,
            allowDeleting: true,
            editMode: ej.Grid.EditMode.Dialog,
        },
        toolbarSettings: {
            showToolbar: true,
            toolbarItems: [
                ej.Grid.ToolBarItems.Add,
                ej.Grid.ToolBarItems.Edit,
                ej.Grid.ToolBarItems.Delete,
                ej.Grid.ToolBarItems.Update,
                ej.Grid.ToolBarItems.Cancel,
                ej.Grid.ToolBarItems.Search,
            ],
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
                field: "ParentBranch.Name",
                headerText: "Parent",
                textAlign: ej.TextAlign.Left,
                validationRules: { required: true, number: false },
                width: 90,
            },
            {
                field: "Address",
                headerText: "Address",
                textAlign: ej.TextAlign.Left,
                validationRules: { required: true, number: false },
                width: 90,
            },
        ],
    });
    $("#BranchGrid").ejGrid("option", {
        editSettings: {
            editMode: "dialogtemplate",
            dialogEditorTemplateID: "#BranchTemplate",
        },
    });
});
function completeBranchs(args) {
    if (args.requestType == "beginedit" || args.requestType == "add") {
        $('#set-pass-checkbox').change(function () {
            if (this.checked)
                $('#password-div').show();
            else
                $('#password-div').hide();
        });

        //getting permission list
        $.ajax({
            url: '/api/branches',
            type: 'GET',
            success: function (data) {
                $('#parentbranch').ejDropDownList({
                    dataSource: data.Items,
                    watermarkText: "Select Parent",
                    fields: { text: "Name", value: "_id" },
                    enableFilterSearch: true
                });
                $("#parentbranch").ejDropDownList({ width: '100%' });
                var obj = $("#parentbranch").data("ejDropDownList");
                if (args.rowData.parentbranch)
                    obj.selectItemByValue(args.rowData.parentbranch._id);
            },
            error: function (error) {
                console.log(error)
            },
        });
    }

    if(args.requestType == "beginedit"){
        document.getElementById('is-active').checked=args.rowData.IsActive;
    }
    if(args.requestType == "add"){
        document.getElementById('set-pass-checkbox').checked=true;
        $('#password-div').show();
    }
    if(args.requestType == "save"){
        $("#BranchGrid").ejGrid("refreshContent"); 
    }
}


function gertprofile_image() {
    var reader = new FileReader();
    var f = document.getElementById("file-select").files;
    reader.onloadend = function () {
        document.getElementById("profile_image").src = reader.result;
        document.getElementById("ProfilePicture").value = reader.result;
    }
    reader.readAsDataURL(f[0]);
}
$('#password-div').hide();
