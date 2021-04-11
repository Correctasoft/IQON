window.onload = function () {
  $.ajax({
    url: '/admin/api/products/mini-products',
    type: 'GET',
    beforeSend: function (xhr) { //Include the bearer token in header
      xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
    },
    success: function (data) {
      data.Items = data.Items.map((x)=>{
        x.NameCode = x.Name+ " - " +x.Code;
        return x;
      });
      $('#product').ejDropDownList({
        dataSource: data.Items,
        watermarkText: "Select Product",
        fields: {
          text: "NameCode",
          value: "_id"
        },
        width: "100%",
        enableFilterSearch: true,
        itemsCount: 10,
        allowVirtualScrolling: true,
        change: function (args) {
          
          $.ajax({
            url: '/admin/api/reviews/' + args.selectedValue,
            type: 'GET',
            success: function (data) {
              let context ="";
              if(data.Count > 0){
                data= data.Items;
                for(let i=0; i<data.length; i++){
                context+=`
                  <tr>
                      <td class="fixdate">${dateFormat(data[i].InsertionDate)}</td>
                      <td>${data[i].Customer_name}</td>
                      <td>${data[i].Customer_phone}</td>
                      <td>${data[i].Review}</td>
                      <td>
                          <a class="btn btn-danger" onclick="deleteReview('${data[i]._id}')"><i class="fa fa-trash"></i></a>
                      </td>
                  </tr>
                `;
                }

              }
              else{
                context += "<tr><td colspan='5' class='text-center'>No Reviews Found</td></tr>";
              }

              $('#review-table-body').html(context);
            },
            error: function (error) {
              console.log(error)
            },
          });
        }
      });
    },
    error: function (error) {
      console.log(error)
    },
  });
}

function deleteImage(imgId){
  $.post('/admin/api/productimages/delete',
    { id: imgId}, 
    function(response){
      if(response.status == 200){
        //image deleted
        $(`#img-div-${imgId}`).remove();
      }
    }       
  );
}

function deleteReview(id){
  $('#review_to_be_deleted').val(id);
  $("#delete-review-button").click();
}