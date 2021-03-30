window.onload = function () {
  console.log("file loaded");
  $.ajax({
    url: '/admin/api/products',
    type: 'GET',
    beforeSend: function (xhr) { //Include the bearer token in header
      xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
    },
    success: function (data) {
      data.Items = data.Items.map((x)=>{
        x.NameCode = x.Name+ " - " +x.Code;
        return x;
      });
      $('#productsdropdown').ejDropDownList({
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
          let formContent = `<form action="/admin/api/productimages/${args.selectedValue}" enctype="multipart/form-data" method="POST">
                                  <div class="row p-4">
                                      <div class="col-md-6">
                                          <input type="file" class="form-control" name="images" id="formFile" multiple>
                                      </div>
                                      <div class="col-md-2">
                                          <input type="submit" class="btn btn-warning" value="Upload Images">
                                      </div>
                                  </div>
                              </form>`;
          document.getElementById("uploadForm").innerHTML = formContent;
          $.ajax({
            url: '/admin/api/productimages/getproductimages/' + args.selectedValue,
            type: 'GET',
            success: function (data) {
              var content = "";
              for (let i = 0; i < data.length; i++) {
                content += `<div class="col-md-2 ml-auto" id='img-div-${data[i]._id}'>
                              <div class="box">
                                <div class="box-header">
                                  <i class='fa fa-times' style='color:red; float: right; font-size: 1em' onclick="deleteImage('${data[i]._id}')"></i>
                                </div>
                                <div class="box-body">
                                  <img src='data:${data[i].Type};base64,${data[i].Content}' class="card-img-top img-fluid"
                                    alt="..." style="width: 100px; heigth: 100px">
                                </div>
                              </div>
                            </div>`;
              }
              document.getElementById("imagesForProduct").innerHTML = content;
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