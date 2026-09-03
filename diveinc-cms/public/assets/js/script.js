function inputDataWithFile(tipe, data) {
  $.ajax({
    url: `/api/${tipe}`,
    method: `POST`,
    contentType: false,
    processData: false,
    data: data,
    success: function(result) {
      if (result.meta.success) {
        location.href = `/master/${tipe}`;
      } else {
        console.log(result);
      }
    },
    error(xhr, status, error) {
      console.log(xhr.responseJSON);
    }
  });
}

function inputData(tipe, data) {
  $.ajax({
    url: `/api/${tipe}`,
    method: `POST`,
    data: data,
    success: function(result) {
      if (result.meta.success) {
        location.href = `/master/${tipe}`;
      } else {
        console.log(result);
      }
    },
    error(xhr, status, error) {
      console.log(xhr.responseJSON);
    }
  });
}

function deleteData(tipe, id) {
  $.ajax({
    url: `/api/${tipe}/${id}`,
    method: `DELETE`,
    success: function(result) {
      if (result.meta.success) {
        location.href = `/master/${tipe}`;
      } else {
        console.log(result);
      }
    },
    error(xhr, status, error) {
      console.log(xhr.responseJSON);
    }
  });
}

function updateDataWithFile(tipe, id, data) {
  $.ajax({
    url: `/api/${tipe}/${id}`,
    method: `PUT`,
    contentType: false,
    processData: false,
    data: data,
    success: function(result) {
      if (result.meta.success) {
        location.href = `/master/${tipe}`;
      } else {
        console.log(result);
      }
    },
    error(xhr, status, error) {
      console.log(xhr.responseJSON);
    }
  });
}

function updateData(tipe, id, data) {
  $.ajax({
    url: `/api/${tipe}/${id}`,
    method: `PUT`,
    data: data,
    success: function(result) {
      if (result.meta.success) {
        location.href = `/master/${tipe}`;
      } else {
        console.log(result);
      }
    },
    error(xhr, status, error) {
      console.log(xhr.responseJSON);
    }
  });
}
