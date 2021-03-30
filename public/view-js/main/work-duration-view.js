let global_Draft_purchase_selected_rowIndex = 0;
let selectedDraftId = 0,
  selectedDraftCode = "";
let flagDraft = true;
var CurrentWorkPeriod = null;

$(function () {
  populateSalesInvoiceList();
});

//#region populate draft purchase lists
populateSalesInvoiceList = function () {
  $.ajax({
    url: "/api/workduration",
    type: "GET",
    success: function (data) {
      if (data.length > 0) {
        $("#templatelist").show();
        $("#templatelist").ejListView({
          dataSource: data,
          renderTemplate: true,
          width: 450,
          enableFiltering: true,
        });
      } else {
        $("#templatelist").hide();
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
  $.ajax({
    url: "/api/workduration/getCurrentWorkPeriod",
    type: "GET",
    success: function (data) {
      CurrentWorkPeriod = data;
      if (data !== null) {
        document.getElementById('Note').innerText = "Current Work period Started at "+ dateFormat(data.StartTime) +" By "+data.StartedBy.Name;
        document.getElementById('Remarks').value = data.Remarks;
        $("#End").show();
        $("#Start").hide();
      } else {
        document.getElementById('Note').innerText = "Remarks";
        $("#Start").show();
        $("#End").hide();
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

Start = function () {
  let postObject = {
    Remarks :  document.getElementById('Remarks').value,
    StartedBy :  sessionStorage.getItem("currentUserId")
  };
  $.post("/api/workduration/start", postObject, function (data, status) {
    populateSalesInvoiceList();
  });
};

End = function(){
  let postObject = CurrentWorkPeriod;
  postObject.EndedBy = sessionStorage.getItem("currentUserId");
  $.post("/api/workduration/end", postObject, function (data, status) {
    populateSalesInvoiceList();
  });
}

$("#Start").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});

$("#End").ejButton({
  showRoundedCorner: true,
  size: "medium",
  width: "200px",
});

hidebackdrop = () => {
  setTimeout(function () {
    $(".modal-backdrop").hide();
  }, 200);
};
