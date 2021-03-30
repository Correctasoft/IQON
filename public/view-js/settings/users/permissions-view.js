$(function () {
  var PermissionsdataManager = ej.DataManager({
    url: "/api/permissions",
    adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
  });

  $("#PermissionsGrid").ejGrid({
    dataSource: PermissionsdataManager, //window.gridData,
    allowPaging: true,
    enablelAltRow: true,
    allowSorting: true,
    actionComplete: "completePermissions",
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
    ],
  });
  $("#PermissionsGrid").ejGrid("option", {
    editSettings: {
      editMode: "dialogtemplate",
      dialogEditorTemplateID: "#PermissionsTemplate",
    },
  });
});
var global_modules_data = null;
function completePermissions(args) {
  if (args.requestType == "beginedit" || args.requestType == "add") {
    if (global_modules_data == null) {
      $.ajax({
        url: "/api/permissions/modules",
        type: "GET",
        success: function (data) {
          global_modules_data = data;
          $("#treeView").ejTreeView({
            allowKeyboardNavigation: true,
            cssClass: "gradient-lime",
            showCheckbox: true,
            fields: {
              id: "id",
              parentId: "pid",
              text: "name",
              hasChild: "hasChild",
              dataSource: data,
              expanded: "expanded",
            },
          });
        },
        error: function (error) {
          console.log(error);
        },
      });
    } else {
      $("#treeView").ejTreeView({
        allowKeyboardNavigation: true,
        cssClass: "gradient-lime",
        showCheckbox: true,
        fields: {
          id: "id",
          parentId: "pid",
          text: "name",
          hasChild: "hasChild",
          dataSource: global_modules_data,
          expanded: "expanded",
        },
      });
    }
    showLoader();
    setTimeout(async function () {
      checkedNodes = args.rowData.AllowedModules;
      var treeObj = await $("#treeView").ejTreeView("instance");
      await treeObj.checkNode(checkedNodes);
      if (checkedNodes) {
        var checkedModulesid = checkedNodes.map((x) => {
          return parseInt(x);
        });
        var allmodulesid = global_modules_data.map((x) => x.id);
        var notpermittedmodulesid = allmodulesid.filter(
          (x) => checkedModulesid.indexOf(x) === -1
        );

        await treeObj.uncheckNode(notpermittedmodulesid);
      }
      hideLoader();
    }, 1000);

    document.getElementById("permission_modules").value = JSON.stringify(
      args.rowData.AllowedModules
    );
  }
  if (args.requestType == "save") {
    var PermissionsdataManager = ej.DataManager({
      url: "/api/permissions",
      adaptor: new ej.WebApiAdaptor(), //"UrlAdaptor"
    });

    $("#PermissionsGrid").ejGrid({
      dataSource: PermissionsdataManager, //window.gridData,
      allowPaging: true,
      enablelAltRow: true,
      allowSorting: true,
      actionComplete: "completePermissions",
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
      ],
    });
    $("#PermissionsGrid").ejGrid("option", {
      editSettings: {
        editMode: "dialogtemplate",
        dialogEditorTemplateID: "#PermissionsTemplate",
      },
    });
  }
}

function getPermittedModules() {
  var treeObj = $("#treeView").data("ejTreeView");
  var selectedModulesList = treeObj.getCheckedNodes();
  var idList = [];
  for (var i = 0; i < selectedModulesList.length; i++) {
    var x = selectedModulesList[i];
    idList.push(x.id);
    while (true) {
      if (x.parentNode && x.parentNode.parentNode.id != "treeView") {
        idList.push(x.parentNode.parentNode.id);
        x = x.parentNode.parentNode;
      } else {
        break;
      }
    }
  }
  document.getElementById("permission_modules").value = JSON.stringify([
    ...new Set(idList),
  ]);
}
