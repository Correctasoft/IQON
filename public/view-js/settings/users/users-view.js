var global_UserGrid=null;
$(function () {
    var UsersdataManager = ej.DataManager({
        url: "/api/users",
        adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
    });

    global_UserGrid= $("#UserGrid").ejGrid({
        dataSource: UsersdataManager, //window.gridData,
        allowPaging: true,
        enablelAltRow: true,
        allowSorting: true,
        actionComplete: "completeUsers",
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
                field: "ProfilePicture",
                headerText: "Image",
                textAlign: ej.TextAlign.Left,
                template: "<img class='profile-pic' src='\{{: ProfilePicture }}'>",
                validationRules: { required: true, number: false },
                width: 90,
            },
            {
                field: "Name",
                headerText: "Name",
                textAlign: ej.TextAlign.Left,
                validationRules: { required: true, number: false },
                width: 90,
            },
            {
                field: "Permission.Name",
                headerText: "Permission",
                textAlign: ej.TextAlign.Left,
                validationRules: { required: true, number: false },
                width: 90,
            },
            {
                field: "Phone",
                headerText: "Phone",
                textAlign: ej.TextAlign.Left,
                validationRules: { required: true, number: false },
                width: 90,
            },
            {
                field: "IsActive",
                headerText: "Is Active",
                textAlign: ej.TextAlign.Left,
                validationRules: { required: true, number: false },
                width: 90,
            },
        ],
    });
    $("#UserGrid").ejGrid("option", {
        editSettings: {
            editMode: "dialogtemplate",
            dialogEditorTemplateID: "#UserTemplate",
        },
    });
});
function completeUsers(args) {
    if (args.requestType == "beginedit" || args.requestType == "add") {
        $('#set-pass-checkbox').change(function () {
            if (this.checked)
                $('#password-div').show();
            else
                $('#password-div').hide();
        });

        //getting permission list
        $.ajax({
            url: '/api/permissions',
            type: 'GET',
            success: function (data) {
                $('#Permission').ejDropDownList({
                    dataSource: data.Items,
                    watermarkText: "Select Permission",
                    fields: { text: "Name", value: "_id" },
                    enableFilterSearch: true
                });
                $("#Permission").ejDropDownList({ width: '100%' });
                var obj = $("#Permission").data("ejDropDownList");
                if (args.rowData.Permission)
                    obj.selectItemByValue(args.rowData.Permission._id);
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
        $("#UserGrid").ejGrid("refreshContent"); 
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
