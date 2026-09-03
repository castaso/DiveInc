let listCalibration = [];
let measuringPoint = [
  {
    id: "input_1",
    name: "",
    type: "",
    unit: ""
  }
];
const fileDocumentation = [
  {
    id: "1",
    name: ""
  }
];
let imageSpareparts = [1];
let dataSpareparts = [
  {
    id: "1",
    code: "",
    name: "",
    data: [
      {
        id: "11",
        name: ""
      }
    ]
  }
];
// Form validation
$("#formAsset")
  .parsley()
  .on("field:validated", function() {
    var e = 0 === $(".parsley-error").length;
    $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e);
  })
  .on("form:submit", function() {
    let documentations = null;
    console.log(fileDocumentation);
    if (fileDocumentation.length >= 1 && $(`#inputFile1`).val() != "") {
      const dataDocumentations = fileDocumentation.map(d => {
        return {
          ...d,
          name: $(`#inputFileName${d.id}`).val()
        };
      });

      documentations = {
        id: $("#inputNameDoc").val() + new Date().getTime(),
        name: $("#inputNameDoc").val(),
        data: dataDocumentations
      };
      console.log("adad");
    }

    dataSpareparts = dataSpareparts.map(d => {
      return {
        ...d,
        code: $(`#inputCodeDocSpareparts${d.id}`).val(),
        name: $(`#inputNameDocSpareparts${d.id}`).val(),
        data: d.data.map(doc => {
          return {
            ...doc,
            name: $(`#inputFileNameSpareparts${doc.id}`).val()
          };
        })
      };
    });
    if (dataSpareparts == 1 && $(`#inputCodeDocSpareparts1`).val() == "" && $(`#docSpareparts11`).val() == "") dataSpareparts = null;
    if ($(`#imageSpareparts1`).val() != "") imageSpareparts = null;
    const data = {
      asset_id: $("#inputAssetId")[0].value,
      icon: null,
      asset_category_id: $("#selectAssetCategory")[0].value,
      location_id: $("#selectLocation")[0].value,
      asset_location_image: null,
      asset_info: {
        function: {
          range: [
            {
              max: parseInt($("#inputMaxTemp")[0].value),
              min: parseInt($("#inputMinTemp")[0].value),
              unit: $("#selectTemperature")[0].value
            },
            {
              max: parseInt($("#inputMaxAmps")[0].value),
              min: parseInt($("#inputMinAmps")[0].value),
              unit: $("#selectAmps")[0].value
            }
          ],
          function_name: $("#selectFunctionName")[0].value,
          transfer_function: $("#selectTransferFunction")[0].value
        },
        calibration_procedure: {
          due_date: $("#inputDueDateCalibration")[0].value,
          interval: {
            value: parseInt($("#inputIntervalCalibration")[0].value),
            unit: $("#selectIntervalCalibration")[0].value
          },
          adjust_to: parseInt($("#inputAdjust")[0].value),
          classification: $("#selectClassification")[0].value,
          reject_if_error: parseInt($("#inputReject")[0].value),
          calibration_strategy: $("#selectCalibrationStrategy")[0].value
        },
        inspection_procedure: {
          due_date: $("#inputDueDateInspection")[0].value,
          interval: {
            value: parseInt($("#inputIntervalInspection")[0].value),
            unit: $("#selectIntervalInspection")[0].value
          }
        },
        maintance_procedure: {
          due_date: $("#inputDueDateMaintance")[0].value,
          interval: {
            value: parseInt($("#inputIntervalMaintance")[0].value),
            unit: $("#selectIntervalMaintance")[0].value
          }
        },
        tag_information: {
          tag_name: $("#inputTagName")[0].value,
          plant_structure: $("#inputPlantStructure")[0].value,
          work_order_number: (Math.random() + 1).toString(36).substring(7)
        },
        asset_description: {
          rangeability: $("#inputRangeability")[0].value,
          serial_number: $("#inputSerialNumber")[0].value,
          operating_temp: {
            max: parseInt($("#inputMaxOperating")[0].value),
            min: parseInt($("#inputMinOperating")[0].value),
            unit: $("#selectOperating")[0].value
          },
          manufacturer_model: $("#selectManufactureModel")[0].value,
          operating_humidity: {
            max: parseInt($("#inputMaxHumidity")[0].value),
            min: parseInt($("#inputMinHumidity")[0].value),
            unit: $("#selectHumidity")[0].value
          }
        }
      },
      data_calibration: listCalibration,
      data_inspection: measuringPoint,
      documentations: documentations,
      spareparts: {
        images: imageSpareparts,
        data: dataSpareparts
      }
    };

    console.log(data);

    const dataForm = new FormData($("#formAsset")[0]);
    dataForm.append("data", JSON.stringify(data));

    if ($("#add")[0]) inputDataWithFile("asset", dataForm);
    if ($("#update")[0]) {
      const id = $("#update")[0].value;
      updateDataWithFile("asset", id, dataForm);
    }

    return false;
  });

// Slider

// slider temperature
const sliderTemp = $("#sliderTemp");

$("#inputMinTemp").change(e => {
  sliderTemp.data("ionRangeSlider").update({
    from: e.target.value
  });
});

$("#inputMaxTemp").change(e => {
  sliderTemp.data("ionRangeSlider").update({
    to: e.target.value
  });
});

$("#selectTemperature").change(e => {
  sliderTemp.data("ionRangeSlider").update({
    postfix: e.target.value
  });
});

sliderTemp.ionRangeSlider({
  type: "double",
  grid: true,
  min: -500,
  max: 500,
  from: -250,
  to: 250,
  postfix: "°C",
  onStart: data => {
    $("#inputMinTemp")[0].value = data.from;
    $("#inputMaxTemp")[0].value = data.to;
  },
  onChange: data => {
    $("#inputMinTemp")[0].value = data.from;
    $("#inputMaxTemp")[0].value = data.to;
  }
});
//end slider temperature
//slider amps
const sliderAmps = $("#sliderAmps");

$("#inputMinAmps").change(e => {
  sliderAmps.data("ionRangeSlider").update({
    from: e.target.value
  });
});

$("#inputMaxAmps").change(e => {
  sliderAmps.data("ionRangeSlider").update({
    to: e.target.value
  });
});

$("#selectAmps").change(e => {
  sliderAmps.data("ionRangeSlider").update({
    postfix: e.target.value
  });
});

sliderAmps.ionRangeSlider({
  type: "double",
  grid: true,
  min: 0,
  max: 1000,
  from: 100,
  to: 500,
  postfix: "mA",
  onStart: data => {
    $("#inputMinAmps")[0].value = data.from;
    $("#inputMaxAmps")[0].value = data.to;
  },
  onChange: data => {
    $("#inputMinAmps")[0].value = data.from;
    $("#inputMaxAmps")[0].value = data.to;
  }
});
//end sliderAmps

//slider operating
const sliderOperating = $("#sliderOperating");

$("#inputMinOperating").change(e => {
  sliderOperating.data("ionRangeSlider").update({
    from: e.target.value
  });
});

$("#inputMaxOperating").change(e => {
  sliderOperating.data("ionRangeSlider").update({
    to: e.target.value
  });
});

$("#selectOperating").change(e => {
  sliderOperating.data("ionRangeSlider").update({
    postfix: e.target.value
  });
});

sliderOperating.ionRangeSlider({
  type: "double",
  grid: true,
  min: -500,
  max: 500,
  from: -250,
  to: 250,
  postfix: "°C",
  onStart: data => {
    $("#inputMinOperating")[0].value = data.from;
    $("#inputMaxOperating")[0].value = data.to;
  },
  onChange: data => {
    $("#inputMinOperating")[0].value = data.from;
    $("#inputMaxOperating")[0].value = data.to;
  }
});
//end slider operating

//slider Humidity
const sliderHumidity = $("#sliderHumidity");

$("#inputMinHumidity").change(e => {
  sliderHumidity.data("ionRangeSlider").update({
    from: e.target.value
  });
});

$("#inputMaxHumidity").change(e => {
  sliderHumidity.data("ionRangeSlider").update({
    to: e.target.value
  });
});

$("#selectHumidity").change(e => {
  sliderHumidity.data("ionRangeSlider").update({
    postfix: e.target.value
  });
});

sliderHumidity.ionRangeSlider({
  type: "double",
  grid: true,
  min: -500,
  max: 500,
  from: -250,
  to: 250,
  postfix: "RH",
  onStart: data => {
    $("#inputMinHumidity")[0].value = data.from;
    $("#inputMaxHumidity")[0].value = data.to;
  },
  onChange: data => {
    $("#inputMinHumidity")[0].value = data.from;
    $("#inputMaxHumidity")[0].value = data.to;
  }
});
// end huidit slider

// calibration
function loadListCalibration() {
  $("#listCalibration").empty();
  for (var i = 0; i < listCalibration.length; i++) {
    $("#listCalibration").append(`
      <tr>
        <td>${listCalibration[i].nominal_input}</td>
        <td>${listCalibration[i].nominal_output}</td>
        <td>${listCalibration[i].unit}</td>
        <td><a href="#" onclick="deleteListCalibration('${listCalibration[i].id}')">delete</a></td>
      </tr>
    `);
  }
}

$("#addData").click(e => {
  e.preventDefault();

  if ($("#inputNominal").val() == "" || $("#outputNominal").val() == "" || $("#inputUnit").val() == "") return;

  var id = "ins-" + new Date().getTime();
  var vData = {
    id: id,
    nominal_input: $("#inputNominal").val(),
    nominal_output: $("#outputNominal").val(),
    unit: $("#inputUnit").val()
  };

  listCalibration.push(vData);
  loadListCalibration();
});

function deleteListCalibration(id) {
  listCalibration.forEach((data, index) => {
    if (id == data.id) listCalibration.splice(index, 1);
  });
  loadListCalibration();
}
// end calibration

// Inspection
function loadFormInspection(data, id) {
  for (var i = 0; i < data.length; i++) {
    if (!data[i].value) {
      $(`#${id}`).append(`
        <li id="${data[i].id}">
          <div style="display: inline-grid;">
            <input onchange="fillDataInspection('${data[i].id}')" class="form-control form-control-sm mb-1" id="input1${
        data[i].id
      }" type="text" placeholder="name" value="${data[i].name}"/>
            <input onchange="fillDataInspection('${data[i].id}')" class="form-control form-control-sm mb-1" id="input2${
        data[i].id
      }" type="text" placeholder="unit" value="${data[i].unit}"/>
            <select onchange="fillDataInspection('${data[i].id}')" class="custom-select" id="input3${data[i].id}">
              <option value="boolean">Checklist</option>
              <option ${data[i].type == "string" ? "selected" : ""}  value="string">Number</option>
            </select>
          </div>
          <div style="display: inline-flex;">
            <button onclick="deleteDataInspection('${
              data[i].id
            }')" type="button" class="btn btn-danger btn-xs waves-effect waves-light"><i class="mdi mdi-close"></i></button>
            <button onclick="addDataInspection('${
              data[i].id
            }')" type="button" class="btn btn-success btn-xs waves-effect waves-light"><i class="mdi mdi-plus"></i></button>
          </div>
        </li>
      `);
    } else {
      if (data[i].value.length == 0) {
        delete data[i].value;
        data[i].type == "";
        data[i].unit == "";
        $(`#${id}`).append(`
          <li id="${data[i].id}">
            <div style="display: inline-grid;">
              <input onchange="fillDataInspection('${data[i].id}')" class="form-control form-control-sm mb-1" id="input1${
          data[i].id
        }" type="text" placeholder="name" value="${data[i].name}"/>
              <input onchange="fillDataInspection('${data[i].id}')" class="form-control form-control-sm mb-1" id="input2${
          data[i].id
        }" type="text" placeholder="unit" value="${data[i].unit}"/>
              <select onchange="fillDataInspection('${data[i].id}')" class="custom-select" id="input3${data[i].id}">
                <option value="boolean">Checklist</option>
                <option ${data[i].type == "string" ? "selected" : ""}  value="string">Number</option>
              </select>
            </div>
            <div style="display: inline-flex;">
              <button onclick="deleteDataInspection('${
                data[i].id
              }')" type="button" class="btn btn-danger btn-xs waves-effect waves-light"><i class="mdi mdi-close"></i></button>
              <button onclick="addDataInspection('${
                data[i].id
              }')" type="button" class="btn btn-success btn-xs waves-effect waves-light"><i class="mdi mdi-plus"></i></button>
            </div> 
          </li>
        `);
      } else {
        $(`#${id}`).append(`
          <li id="${data[i].id}">
            <div style="display: inline-grid;">
              <input onchange="fillDataInspection('${data[i].id}')" class="form-control form-control-sm mb-1" id="input1${data[i].id}" type="text" placeholder="name" value="${data[i].name}"/>
            </div>
            <div style="display: inline-flex;">
              <button onclick="deleteDataInspection('${data[i].id}')" type="button" class="btn btn-danger btn-xs waves-effect waves-light"><i class="mdi mdi-close"></i></button>
              <button onclick="addDataInspection('${data[i].id}')" type="button" class="btn btn-success btn-xs waves-effect waves-light"><i class="mdi mdi-plus"></i></button>
            </div>
            <ol id="child${data[i].id}"></ol>
          </li>
        `);

        loadFormInspection(data[i].value, `child${data[i].id}`);
      }
    }
  }
}

async function deleteDataInspection(id) {
  await reqDeleteDataInspection(id, measuringPoint);
  $("#listData").empty();
  loadFormInspection(measuringPoint, "listData");
}

async function addDataInspection(id) {
  await reqAddDataInspection(id, measuringPoint);
  $("#listData").empty();
  loadFormInspection(measuringPoint, "listData");
}

function addMP() {
  measuringPoint.push({
    id: `input_${new Date().getTime()}`,
    name: "",
    type: "",
    unit: ""
  });
  $("#listData").empty();
  loadFormInspection(measuringPoint, "listData");
}

function reqDeleteDataInspection(id, data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].value) {
      if (id == data[i].id) {
        data.splice(i, 1);
      } else {
        reqDeleteDataInspection(id, data[i].value);
      }
    } else {
      if (id == data[i].id) {
        data.splice(i, 1);
      }
    }
  }
}

function reqAddDataInspection(id, data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].value) {
      if (id == data[i].id) {
        data[i].value.push({
          id: `input_${new Date().getTime()}`,
          name: "",
          type: "",
          unit: ""
        });
      } else {
        reqAddDataInspection(id, data[i].value);
      }
    } else {
      if (id == data[i].id) {
        data[i].value = [
          {
            id: `input_${new Date().getTime()}`,
            name: "",
            type: "",
            unit: ""
          }
        ];
        delete data[i].type;
        delete data[i].unit;
      }
    }
  }
}

function fillDataInspection(id) {
  reqFillDataInspection(id, measuringPoint);
}

function reqFillDataInspection(id, data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].value) {
      if (id == data[i].id) {
        if ($(`[id=${id}]`).children().length > 1) {
          data[i].name = $(`[id=${id}]`)
            .children()
            .children()[0].value;
          data[i].unit = $(`[id=${id}]`)
            .children()
            .children()[1].value;
          data[i].type = $(`[id=${id}]`)
            .children()
            .children()[2].value;
        } else {
          data[i].name = $(`[id=${id}]`)
            .children()
            .children()[0].value;
        }
      } else {
        reqFillDataInspection(id, data[i].value);
      }
    } else {
      if (id == data[i].id) {
        data[i].name = $(`[id=${id}]`)
          .children()
          .children()[0].value;
        data[i].unit = $(`[id=${id}]`)
          .children()
          .children()[1].value;
        data[i].type = $(`[id=${id}]`)
          .children()
          .children()[2].value;
      }
    }
  }
}
// end inspection

// Documentation
function addFileDocumentation() {
  const id = new Date().getTime();
  fileDocumentation.push({
    id: id,
    name: ""
  });

  $("#documentationFile").append(`
    <div>
      <div class="form-row">
        <div class="form-group col-md-5">
          <input name="inputFileName${id}" type="text"  class="form-control" id="inputFileName${id}" placeholder="File Name" required />
        </div>
        <div class="form-group col-md-5">
          <input name="file${id}" type="file" class="form-control-file" required />
        </div>
        <div class="form-group col-md-2">
          <span onclick="removeFileDocumentation(${id},this)" class="btn btn-danger btn-block waves-effect waves-light">-</span>
        </div>
      </div>
    </div>
  `);
}

function removeFileDocumentation(id, element) {
  fileDocumentation.forEach((e, i) => {
    if (e.id == id) fileDocumentation.splice(i, 1);
  });
  $(element)
    .parent()
    .parent()
    .remove();
}
// end documentation

// Spareparts
function addDataSpareparts() {
  const id = new Date().getTime();
  dataSpareparts.push({
    id: `${id}`,
    code: "",
    name: "",
    data: [
      {
        id: `${id + "1"}`,
        name: ""
      }
    ]
  });

  const idFile = dataSpareparts[dataSpareparts.length - 1].data[0].id;
  $("#dataSpareparts").append(`
    <div>
      <div class="form-row">
        <div class="form-group col-5">
          <label class="control-label">Code</label>
          <input name="inputCodeDocSpareparts${id}" type="text" class="form-control" id="inputCodeDocSpareparts${id}" placeholder="Code document" required />
        </div>
        <div class="form-group col-5">
          <label class="control-label">Documents Name</label>
          <input name="inputNameDocSpareparts${id}" type="text" class="form-control" id="inputNameDocSpareparts${id}" placeholder="Name document" required />
        </div>
        <div class="form-group col-md-2">
          <label class="control-label">action</label>
          <span onclick="removeDataSpareparts(${id}, this)" class="btn btn-danger btn-block waves-effect waves-light">-</span>
        </div>
      </div>
      <div id="docSpareparts${id}">
        <div>
          <div class="form-row">
            <div class="form-group col-md-5">
              <input name="inputFileNameSpareparts${idFile}" type="text" class="form-control" id="inputFileNameSpareparts${idFile}" placeholder="File Name" required />
            </div>
            <div class="form-group col-md-5">
              <input name="docSpareparts${idFile}" type="file" class="form-control-file" id="docSpareparts${idFile}" required />
            </div>
            <div class="form-group col-md-2">
              <span onclick="addDocSpareparts(${id})" class="btn btn-success btn-block waves-effect waves-light">+</span>
            </div>
          </div>
        </div>
      </div>
      <hr>
    </div>
  `);
}

function removeDataSpareparts(id, element) {
  dataSpareparts.forEach((d, i) => {
    if (d.id == id) dataSpareparts.splice(i, 1);
  });
  $(element)
    .parent()
    .parent()
    .parent()
    .remove();
}

function addDocSpareparts(idData) {
  let id = "";
  dataSpareparts.forEach(d => {
    if (d.id == idData) {
      id = `${d.id}` + new Date().getTime();
      d.data.push({
        id: id,
        name: ""
      });
    }
  });

  $(`#docSpareparts${idData}`).append(`
    <div>
      <div class="form-row">
        <div class="form-group col-md-5">
          <input name="inputFileNameSpareparts${id}" type="text" class="form-control" id="inputFileNameSpareparts${id}" placeholder="File Name" required />
        </div>
        <div class="form-group col-md-5">
          <input name="docSpareparts${id}" type="file" class="form-control-file" id="docSpareparts${id}" required />
        </div>
        <div class="form-group col-md-2">
          <span onclick="removeDocSpareparts(${idData}, ${id}, this)" class="btn btn-danger btn-block waves-effect waves-light">-</span>
        </div>
      </div>
    </div>
  `);
}

function removeDocSpareparts(idData, id, element) {
  dataSpareparts.forEach(d => {
    if (d.id == idData) {
      d.data.forEach((doc, i) => {
        if (doc.id == id) d.data.splice(i, 1);
      });
    }
  });
  $(element)
    .parent()
    .parent()
    .remove();
}

function addImageSpareparts() {
  const id = new Date().getTime();
  imageSpareparts.push(id);
  $("#imageSpareparts").append(`
    <div>
      <div class="form-row">
        <div class="form-group col-md-10">
          <input name="imageSpareparts${id}" type="file" class="form-control-file" id="imageSpareparts${id}" required />
        </div>
        <div class="form-group col-md-2">
          <span onclick="removeImageSpareParts(${id},this)" class="btn btn-danger btn-block waves-effect waves-light">-</span>
        </div>
      </div>
    </div>
  `);
}

function removeImageSpareParts(id, element) {
  imageSpareparts = imageSpareparts.filter(val => {
    return val != id;
  });
  $(element)
    .parent()
    .parent()
    .remove();
}
