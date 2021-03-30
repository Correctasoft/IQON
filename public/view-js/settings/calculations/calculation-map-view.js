var global_calctype_selected_value; 
function getCalculationTypes() {
    showLoader();
    $.ajax({
        url: "/api/calculationtypes",
        type: "GET",
        success: function (data) {
            hideLoader();
            $("#calctype").ejDropDownList({
                dataSource: data.Items,
                watermarkText: "Select Calculation Type",
                fields: { text: "Name", value: "_id" },
                enableFilterSearch: true,
                change: function (args) {
                    //change function args.selectedValue
                    global_calctype_selected_value= args.selectedValue;
                    $.ajax({
                        url: "/api/calculationmap/" + args.selectedValue,
                        type: "GET",
                        success: function (data) {
                            hideLoader();
                            
                            checkedNodes = data.Items;
                            //refreshing tree
                            $("#treeView").ejTreeView({
                                allowKeyboardNavigation: true,
                                cssClass: "gradient-lime",
                                showCheckbox: true,
                                fields: {
                                    id: "id",
                                    parentId: "pid",
                                    text: "name",
                                    hasChild: "hasChild",
                                    dataSource: global_treedata,
                                    expanded: "expanded",
                                },
                            });
                            treeObj = $("#treeView").ejTreeView('instance');
                            treeObj.checkNode(checkedNodes);

                        },
                        error: function (error) {
                            console.log(error);
                        },
                    });
                },
            });
            $("#calctype").ejDropDownList({ width: "200" });

        },
        error: function (error) {
            console.log(error);
        },
    });
}
function checkAllUnderThis(ele) {
    ele = ele.nextElementSibling.nextElementSibling;
    ele = ele.children;
    for (var i = 0; i < ele.length; i++) {
        ele[i].firstElementChild.checked = true;
    }
}
var global_treedata = null;
function creatTree() {
    showLoader();
    $.ajax({
        url: "/api/calculationmap/get-all-products",
        type: "GET",
        success: function (data) {
            global_treedata = data.items;
            hideLoader();
            $("#treeView").ejTreeView({
                allowKeyboardNavigation: true,
                cssClass: "gradient-lime",
                showCheckbox: true,
                fields: {
                    id: "id",
                    parentId: "pid",
                    text: "name",
                    hasChild: "hasChild",
                    dataSource: data.items,
                    expanded: "expanded",
                },
            });

        },
        error: function (error) {
            console.log(error);
        },
    });
}

function getPorductIds(nodeList){
    var idList=[];
    for (var i = 0; i < nodeList.length; i++) {
        var x = nodeList[i];
        if (x.id[0] == 'p')
            idList.push(x.id.substring(4, x.id.length));
    }
    return idList;
}

function saveCalc() {
    var treeObj = $("#treeView").data("ejTreeView");
    var allnodes= treeObj.getVisibleNodes();
    var selectedNodeList = treeObj.getCheckedNodes();
    
    //removing selected nodes from allnodes
    for (var i = 0; i < selectedNodeList.length; i++) {
        var x = selectedNodeList[i];
        allnodes= allnodes.filter(node=>{
            if(allnodes[node].id!=x.id)
            return true;
            else
            return false;
        });
    }
    let PostObject = {
        selected_products: getPorductIds(selectedNodeList),
        unselected_products: getPorductIds(allnodes),
        calctype: global_calctype_selected_value
    };
    showLoader();
    $.post(
        "/api/calculationmap/set-calculation-type" ,
        PostObject,
        function (data, status) { 
            hideLoader();
        }
    );
}
$(document).ready(function () {
    getCalculationTypes();
    creatTree();

});
