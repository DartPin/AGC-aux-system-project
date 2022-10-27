const port = 8000;
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const XLSX = require("xlsx");
app.use(cors());

//random string
function pass_gen(len) {
  chrs = "abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789";
  var str = "";
  for (var i = 0; i < len; i++) {
    var pos = Math.floor(Math.random() * chrs.length);
    str += chrs.substring(pos, pos + 1);
  }
  return str;
}

let authArr = [];

function checkAuth() {
  console.log(authArr);
  authArr.forEach((element) => {
    let dateNow = new Date();
    if (dateNow - element.time > 300000) {
      console.log("вы давно не совершали действий");
    }
  });
}

setTimeout(function run() {
  checkAuth(), setTimeout(run, 60000);
});

// СОХРАНЕНИЕ ИЗОБРАЖЕНИЯ НА СЕРВЕРЕ
const multer = require("multer");
const { request } = require("http");
const { response } = require("express");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // '/files' это директория в которую будут сохранятся файлы
    cb(null, "files/temporary/");
  },
  filename: (req, file, cb) => {
    // Возьмем оригинальное название файла, и под этим же названием сохраним его на сервере
    const { originalname } = file;
    cb(null, originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/api/single-file", upload.single("file"), (req, res) => {
  res.json({ status: "Saved" });
});

//JSON с данными
app.get("/api/Models", (request, response) => {
  fs.readFile("dataModels.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка

    response.send(data); // выводим считанные данные
  });
});
app.get("/api/Users", (request, response) => {
  fs.readFile("./data/users.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка

    response.send(data); // выводим считанные данные
  });
});

// ПОИСК МОДЕЛИ ПО АРТИКЛЮ

app.post("/api/FindModels", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  let obj = request.body;
  let data = fs.readFileSync("./dataModels.json", "utf8");
  let dataStr = JSON.parse(data);
  let model = "";
  dataStr.forEach((element) => {
    element.articles.forEach((item) => {
      if (item.art === Number(obj.article)) {
        model = element;
      }
    });
  });
  response.send(model);
  console.log(model);
});

// СОХРАНЕНИЕ ИЗМЕНЕНИЙ ИНФОРМАЦИИ ПО МОДЕЛЯМ
app.post(
  "/api/Production/SaveModelInfo",
  jsonParser,
  function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let obj = request.body;
    let data = fs.readFileSync("./dataModels.json", "utf8");
    let dataStr = JSON.parse(data);
    console.log(obj);
    dataStr.forEach((element) => {
      element.articles.forEach((item) => {
        if (item.art === Number(obj.article)) {
          item.frame = obj.frame;
          item.surfaces = obj.surfaces;
        }
      });
    });

    data = JSON.stringify(dataStr);
    fs.writeFileSync("./dataModels1.json", data, "utf8");
  }
);

// ОТПРАВКА СПИСКА QRCI

app.get("/api/Quality/qrciList", (request, response) => {
  fs.readFile("./data/qrciList.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка
    let arr = JSON.parse(data);
    dateNow = new Date();
    arr.forEach((element) => {
      element.qrciList.forEach((item) => {
        item.qrciRows.forEach((action) => {
          let checkDate = new Date(action.date);
          if (checkDate < dateNow) {
            console.log(action.date + " < " + dateNow);
            action.status = {
              title: "Просрочен",
              index: 1,
            };
            item.status = {
              title: "Просрочен",
              index: 1,
            };
          }
        });
      });
    });

    response.send(arr);
  });
});

// ОТПРАВКА QRCI по департаменту и номеру
app.get("/api/Quality/Department/:depart/QRCI/:id", (request, responce) => {
  fs.readFile("./data/qrciList.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка
    let arr = JSON.parse(data);
    arr[request.params["depart"]].qrciList.forEach((elem) => {
      if (Number(request.params["id"]) === elem.number) {
        elem.department = request.params["depart"];
        responce.send(elem);
      }
    });
  });
});

// СОХРАНЕНИЕ РЕДАКТИРОВАНИЯ QRCI
app.post(
  "/api/Quality/Department/:depart/QRCI/:id",
  jsonParser,
  function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let obj = request.body;
    let data = fs.readFileSync("./data/qrciList.json", "utf8");
    let dataStr = JSON.parse(data);
    const department = obj.department;
    delete obj.department;

    obj.qrciRows.forEach((row) => {
      if (row.newPhotos.length != undefined) {
        let counterPhoto = 0;
        if (row.photos.length != undefined) {
          counterPhoto = row.photos.length;
        }

        row.newPhotos.forEach((photo) => {
          fs.rename(
            "./files/temporary/" + photo.title,
            "./files/qrci/dep" +
              department +
              "qrci" +
              obj.number +
              "r" +
              photo.row +
              "n" +
              counterPhoto +
              ".jpg",
            (err) => {
              if (err) throw err; // не удалось переименовать файл
              console.log("Файл успешно переименован");
            }
          );
          photo.title =
            "dep" +
            department +
            "qrci" +
            obj.number +
            "r" +
            photo.row +
            "n" +
            counterPhoto +
            ".jpg";
          row.photos.push(photo);
          counterPhoto++;
        });
        row.newPhotos = [];
      }
    });

    dataStr[department].qrciList.splice(obj.number - 1, 1, obj);
    data = JSON.stringify(dataStr);
    fs.writeFileSync("./data/qrciList.json", data, "utf8");
  }
);

app.post("/api/Quality/NewQrci", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  let obj = request.body;
  console.log(obj);
  let data = fs.readFileSync("./data/qrciList.json", "utf8");
  let dataStr = JSON.parse(data);
  const department = obj.department;
  delete obj.department;
  obj.number = dataStr[department].qrciList.length + 1;

  obj.qrciRows.forEach((row) => {
    if (row.photos.length > 0) {
      let counterPhoto = 0;
      row.photos.forEach((photo) => {
        fs.rename(
          "./files/temporary/" + photo.title,
          "./files/qrci/dep" +
            department +
            "qrci" +
            obj.number +
            "r" +
            photo.row +
            "n" +
            counterPhoto +
            ".jpg",
          (err) => {
            if (err) throw err; // не удалось переименовать файл
            console.log("Файл успешно переименован");
          }
        );
        photo.title =
          "dep" +
          department +
          "qrci" +
          obj.number +
          "r" +
          photo.row +
          "n" +
          counterPhoto +
          ".jpg";
        counterPhoto++;
      });
    }
  });

  dataStr[department].qrciList.push(obj);
  data = JSON.stringify(dataStr);
  fs.writeFileSync("./data/qrciList.json", data, "utf8");
});

app.get("/api/getImage/:img", (req, res) => {
  res.setHeader("Content-Type", "image/jpeg");
  fs.readFile("./files/qrci/" + req.params["img"] + ".jpg", (err, image) => {
    res.end(image);
  });
});

// ПОЛУЧЕНИЕ ИЗОБРАЖЕНИЙ
app.post("/api/getImage/:imageTitle", function (request, responce) {
  let obj = request.params["imageTitle"];
  console.log(obj);

  fs.readdir("./files/qrci/", { withFileTypes: true }, (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
      if (file.name === obj) {
        responce.send(file.name);
        console.log(file.name);
      }
    });
  });
});

app.post("/api", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  let obj = request.body.body;
  let data = fs.readFileSync("./qrciList.json", "utf8");
  let dataStr = JSON.parse(data);
  let arrdate = obj.date.split(".");
  obj.date = Date.UTC(arrdate[2], arrdate[1] - 1, arrdate[0], 3, 0, 0, 0);

  for (let el = 0; el < obj.qrciRows.length; el++) {
    let rowDate = obj.qrciRows[el].date.split(".");
    obj.qrciRows[el].date = Date.UTC(
      rowDate[2],
      rowDate[1] - 1,
      rowDate[0],
      0,
      0,
      0,
      0
    );
  }

  if (obj.number === 0) {
    if (dataStr[request.body.index].qrciList.length > 0) {
      obj.id = dataStr[request.body.index].qrciList.length;
      obj.number =
        dataStr[request.body.index].qrciList[
          dataStr[request.body.index].qrciList.length - 1
        ].number + 1;
    } else {
      obj.id = 0;
      obj.number = 1;
    }

    dataStr[request.body.index].qrciList.push(obj);
  } else {
    dataStr[request.body.index].qrciList[obj.id] = obj;
  }

  data = JSON.stringify(dataStr);
  fs.writeFileSync("./qrciList.json", data, "utf8");
});

// ПЛАНИРОВАНИЕ РАБОТ AVO
app.post("/api/AVOPlaning", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  let obj = request.body;
  console.log("sadfsdf");
  let data = fs.readFileSync("./data/planingAVO.json", "utf8");
  let dataStr = JSON.parse(data);
  let checked = true;

  dataStr.forEach((elem) => {
    if (elem.date === obj.date) {
      checked = false;
      let item = {};

      item.model = obj.modelId;
      item.article = obj.article;
      item.quantityK = obj.quantityK;
      item.quantityG = obj.quantityG;
      item.productionTime = obj.productionTime;
      item.nextStep = obj.nextStep;
      if (
        elem.productionPlan[obj.productionArea].flows[obj.productionFlow][
          elem.productionPlan[obj.productionArea].flows[obj.productionFlow]
            .length - 1
        ].model === "---"
      ) {
        elem.productionPlan[obj.productionArea].flows[obj.productionFlow][
          elem.productionPlan[obj.productionArea].flows[obj.productionFlow]
            .length - 1
        ] = item;
      } else {
        elem.productionPlan[obj.productionArea].flows[obj.productionFlow].push(
          item
        );
      }
    }
  });

  if (checked === true) {
    let item = {};
    item.date = obj.date;
    item.productionPlan = [
      {
        productionArea: "Опции",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Линза",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Экструзия",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Пайка",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Manual",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Кировец",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Kostal",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
    ];

    let i = {
      model: obj.modelId,
      article: obj.article,
      quantityK: obj.quantityK,
      quantityG: obj.quantityG,
      productionTime: obj.productionTime,
      nextStep: obj.nextStep,
    };
    item.productionPlan[obj.productionArea].flows[obj.productionFlow][
      item.productionPlan[obj.productionArea].flows[obj.productionFlow].length -
        1
    ] = i;

    dataStr.push(item);
  }

  let dateToday = new Date(obj.date);
  dateToday.setHours(3, 0, 0, 0);
  console.log(obj.date + "---" + dateToday);
  dataStr.forEach((elem) => {
    let newDate = new Date(elem.date);
    let count = newDate - dateToday;
    if (count === 0) {
      response.send(elem.productionPlan);
    }
  });

  data = JSON.stringify(dataStr);
  fs.writeFileSync("./data/planingAVO.json", data, "utf8");
});

app.get("/api/AVOPlaning", (request, response) => {
  fs.readFile("./data/planingAVO.json", "utf8", function (error, data) {
    if (error) throw error;

    let arr = JSON.parse(data);
    let dateToday = new Date();
    dateToday.setHours(3, 0, 0, 0);
    arr.forEach((elem) => {
      let newDate = new Date(elem.date);
      let count = newDate - dateToday;
      if (count === 0) {
        response.send(elem.productionPlan);
      }
    });
  });
});

app.post("/api/AVOPlaningDate", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  let newDate = request.body.date;
  dateToday = new Date(newDate);
  dateToday.setHours(3, 0, 0, 0);
  let data = fs.readFileSync("./data/planingAVO.json", "utf8");
  let dataStr = JSON.parse(data);
  let checked = true;
  dataStr.forEach((elem) => {
    let newDate = new Date(elem.date);
    let count = newDate - dateToday;
    if (count === 0) {
      checked = false;
      console.log(elem.productionPlan);
      response.send(elem.productionPlan);
    }
  });
  if (checked === true) {
    let arr = [
      {
        productionArea: "Опции",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Линза",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Экструзия",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Пайка",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Manual",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Кировец",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
      {
        productionArea: "Kostal",
        flows: [
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
          [
            {
              model: "---",
              productionTime: "---",
            },
          ],
        ],
      },
    ];
    response.send(arr);
  }
});

//ПЕРЕЧЕНЬ ОБОРУДОВАНИЯ
app.get("/api/Maitanence/equipment", (request, response) => {
  fs.readFile("./data/equipment.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка
    let arr = JSON.parse(data);
    response.send(arr);
  });
});

//ПЕРЕЧЕНЬ РАБОТ ДЕЖУРНОЙ СЛУЖБЫ
app.get("/api/Maitanence/workList", (request, response) => {
  fs.readFile("./data/maitanenceWorkList.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка
    let arr = JSON.parse(data);
    response.send(arr);
  });
});

app.post("/api/Maitanence/workList", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  let obj = request.body;
  console.log(obj);
  let data = fs.readFileSync("./data/maitanenceWorkList.json", "utf8");
  let dataStr = JSON.parse(data);
  let dateReq = new Date(request.body.date);
  dateReq.setHours(3, 0, 0, 0);
  let checked = true;
  let id = 1;

  dataStr.forEach((elem) => {
    elem.work.forEach((item) => {
      if (id <= item.id) {
        id = item.id + 1;
      }
    });
  });

  dataStr.forEach((elem) => {
    let newDate = new Date(elem.date);
    let count = newDate - dateReq;
    if (obj.status === "edit") {
      elem.work.forEach((item) => {
        if (obj.id === item.id) {
          item.id = obj.id;
          item.production = obj.production;
          item.line = obj.line;
          item.prodArea = obj.prodArea;
          item.prodUnit = obj.prodUnit;
          item.equipment = obj.equipment;
          item.time = obj.time;
          item.rootCause = obj.rootCause;
          item.comment = obj.comment;
          item.timeSave = obj.timeSave;
          item.worker = obj.worker;
          item.ind = obj.ind;
          item.status = obj.status;
          checked = false;
        }
      });
    } else {
      if (count === 0) {
        checked = false;
        let item = {
          id: id,
          productionShift: request.body.productionShift,
          production: request.body.production,
          line: request.body.line,
          prodArea: request.body.prodArea,
          prodUnit: request.body.prodUnit,
          equipment: request.body.equipment,
          time: request.body.time,
          rootCause: request.body.rootCause,
          comment: request.body.comment,
          timeSave: request.body.timeSave,
          worker: request.body.worker,
          ind: request.body.ind,
          status: request.body.status,
        };
        elem.work.push(item);
      }
    }
  });
  if (checked === true) {
    dataStr.push({
      date: request.body.date,
      work: [
        {
          id: id,
          productionShift: request.body.productionShift,
          production: request.body.production,
          line: request.body.line,
          prodArea: request.body.prodArea,
          prodUnit: request.body.prodUnit,
          equipment: request.body.equipment,
          time: request.body.time,
          rootCause: request.body.rootCause,
          comment: request.body.comment,
          timeSave: request.body.timeSave,
          worker: request.body.worker,
          ind: request.body.ind,
          status: request.body.status,
        },
      ],
    });
  }
  response.send(dataStr);

  data = JSON.stringify(dataStr);
  fs.writeFileSync("./data/maitanenceWorkList.json", data, "utf8");
});

app.post(
  "/api/Maitanence/workListPeriod",
  jsonParser,
  function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let obj = request.body;
    let data = fs.readFileSync("./data/maitanenceWorkList.json", "utf8");
    let dataStr = JSON.parse(data);

    let periodWorkList = [];
    dataStr.forEach((elem) => {
      if (elem.date >= obj[0] && elem.date <= obj[1]) {
        periodWorkList.push(elem);
      }
    });
    console.log(periodWorkList);
    response.send(periodWorkList);
  }
);

app.post(
  "/api/Maitanence/workListPeriodReport",
  jsonParser,
  function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let obj = request.body;
    let data = fs.readFileSync("./data/maitanenceWorkList.json", "utf8");
    let dataStr = JSON.parse(data);

    let periodWorkList = [];
    dataStr.forEach((elem) => {
      if (elem.date >= obj[0] && elem.date <= obj[1]) {
        periodWorkList.push(elem);
      }
    });

    let report = [];
    periodWorkList.forEach((item) => {
      item.work.forEach((element) => {
        let reportObj = {
          производство: element.production,
          линия: element.line,
          зона: element.equipment,
          смена: element.productionShift,
          прим: "",
          дата: item.date,
          "время 2": "",
          "время простоя": "",
          "Время ремонта": "",
          выходные: "",
          ночь: "",
          "время 1": "",
          узел: element.place,
          проблема: "",
          причина: element.rootCause,
          действие: element.comment,
        };
        report.push(reportObj);
      });
    });

    const ws = XLSX.utils.json_to_sheet(report);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Исходные данные");
    XLSX.writeFile(wb, "sampleData.export.xlsx");

    response.send(periodWorkList);
  }
);

app.get("/api/Develop/devList", (request, response) => {
  fs.readFile("./data/developModels.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка
    let arr = JSON.parse(data);
    response.send(arr);
  });
});

app.post(
  "/api/Development/DevReportModel",
  jsonParser,
  function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let obj = request.body;
    let data = fs.readFileSync("./data/developModels.json", "utf8");
    let dataStr = JSON.parse(data);
    let id = 0;
    dataStr.forEach((element) => {
      if (element.id >= id) {
        id = element.id + 1;
      }
    });
    obj.id = id;
    dataStr.push(obj);
    data = JSON.stringify(dataStr);
    fs.writeFileSync("./data/developModels.json", data, "utf8");
  }
);

// ОТПРАВКА МОДЕЛИ РАЗВИТИЯ по номеру
app.get("/api/Development/DevReportModel/:id", (request, responce) => {
  fs.readFile("./data/developModels.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка
    let arr = JSON.parse(data);
    console.log("получено");
    arr.forEach((elem) => {
      if (Number(request.params["id"]) === elem.id) {
        responce.send(elem);
        console.log("отправлено");
      }
    });
  });
});

// ОТПРАВКА МОДЕЛИ РАЗВИТИЯ по номеру модели и номеру строки
app.get("/api/Development/DevPlanTest/:modelId/:rowId", (request, responce) => {
  fs.readFile("./data/developModels.json", "utf8", function (error, data) {
    if (error) throw error; // если возникла ошибка
    let arr = JSON.parse(data);
    console.log("получено");
    arr.forEach((elem) => {
      if (Number(request.params["modelId"]) === elem.id) {
        let obj = elem.rowTests[request.params["rowId"]];
        obj.model = elem.model;

        responce.send(obj);
        console.log("отправлено");
      }
    });
  });
});

// СОХРАНЕНИЕ МОДЕЛИ РАЗВИТИЯ ПОСЛЕ РЕДАКТИРОВАНИЯ

app.post(
  "/api/Development/DevReportModel/:id",
  jsonParser,
  function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let obj = request.body;
    let data = fs.readFileSync("./data/developModels.json", "utf8");
    let dataStr = JSON.parse(data);
    let ind = 0;
    dataStr.forEach((element) => {
      if (element.id === obj.id) {
        dataStr.splice(ind, 1, obj);
      }
      ind++;
    });
    data = JSON.stringify(dataStr);
    fs.writeFileSync("./data/developModels.json", data, "utf8");
  }
);

//СОХРАНЕНИЕ ЗАЯВКИ НА ЭКРАН
app.post("/api/newScreen", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  let obj = request.body;
  console.log(obj);
  let data = fs.readFileSync("./data/screenTaskList.json", "utf8");
  let dataStr = JSON.parse(data);
  let checkingDate = false;

  dataStr.forEach((element) => {
    if (obj.date === element.date) {
      checkingDate = true;
      let checkingLine = false;
      console.log("Совпала дата");
      element.list.forEach((item) => {
        if (item != null) {
          if (item.prodLine.id === obj.choosenLine.id) {
            console.log("Совпала линия");
            checkingLine = true;
            let screen = {
              id: item.list.length,
              model: obj.model,
              article: obj.article,
              comment: obj.comment,
              screenJob: obj.screenJob,
              number: obj.number,
              net: obj.net,
              surface: obj.surface,
              frame: obj.frame,
              status: { text: "планирование", ind: 0, line: "" },
            };
            item.list.push(screen);
          }
        }
      });
      if (!checkingLine) {
        console.log("Новая линия");
        element.list[obj.choosenLine.id] = {
          prodLine: obj.choosenLine,
          list: [
            {
              id: 0,
              model: obj.model,
              article: obj.article,
              comment: obj.comment,
              screenJob: obj.screenJob,
              number: obj.number,
              net: obj.net,
              surface: obj.surface,
              frame: obj.frame,
              status: { text: "планирование", ind: 0, line: "" },
            },
          ],
        };
      }
    }
  });
  if (checkingDate === false) {
    console.log("Новая дата");
    dataStr.push({
      id: dataStr.length,
      date: obj.date,
      list: [],
    });
    dataStr[dataStr.length - 1].list[obj.choosenLine.id] = {
      prodLine: obj.choosenLine,
      list: [
        {
          id: obj.id,
          model: obj.model,
          article: obj.article,
          screenJob: obj.screenJob,
          comment: obj.comment,
          number: obj.number,
          net: obj.net,
          surface: obj.surface,
          frame: obj.frame,
          status: { text: "планирование", ind: 0, line: "" },
        },
      ],
    };
  }
  response.send(dataStr[obj.screensListId]);
  data = JSON.stringify(dataStr);
  fs.writeFileSync("./data/screenTaskList.json", data, "utf8");
});

// ПОЛУЧЕНИЕ СПИСКА ЭКРАНОВ ПО ДАТЕ
app.post(
  "/api/Production/DateListScreen",
  jsonParser,
  function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let obj = request.body;
    let data = fs.readFileSync("./data/screenTaskList.json", "utf8");
    let dataStr = JSON.parse(data);
    let dateWeb = new Date(obj.date);
    dateWeb = dateWeb.setHours(3, 0, 0, 0);
    let sendData = "";
    dataStr.forEach((elem) => {
      let x = new Date(elem.date) - dateWeb;
      console.log(x);
      if (x === 0) {
        sendData = elem;
        console.log(elem);
      }
    });
    response.send(sendData);
  }
);

//УДАЛЕНИЕ ЭКРАНА ИЗ СПИСКА

app.post(
  "/api/Production/DeleteScreen",
  jsonParser,
  function (request, response) {
    if (!request.body) return response.sendStatus(400);

    let obj = request.body;
    let data = fs.readFileSync("./data/screenTaskList.json", "utf8");
    let dataStr = JSON.parse(data);
    console.log(obj);
    dataStr.forEach((element) => {
      if (element.id === obj.dateId) {
        console.log(element);
        element.list[obj.prodLineId].list.forEach((item, index) => {
          if (item.id === obj.rowId) {
            element.list[obj.prodLineId].list.splice(index, 1);
          }
        });
      }
    });

    response.send(dataStr[obj.dateId]);
    data = JSON.stringify(dataStr);
    fs.writeFileSync("./data/screenTaskList.json", data, "utf8");
  }
);

app.post("/api/Login", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  let obj = request.body;
  console.log(obj);
  let data = fs.readFileSync("./data/users.json", "utf8");
  let dataStr = JSON.parse(data);
  let check = false;

  dataStr.forEach((element) => {
    if (obj.login === element.login) {
      if (obj.password === element.password) {
        let code = pass_gen(16);
        let userData = {
          code: code,
          userId: element.id,
          time: new Date(),
        };
        let n = false;
        authArr.forEach((item) => {
          if (item.userId === userData.userId) {
            n = true;
            item.code = userData.code;
            item.userId = userData.userId;
            item.time = new Date();
            console.log(item);
          }
        });
        if (n === false) {
          authArr.push(userData);
        }

        element.auth = code;
        check = true;
      }
    }
  });
  response.send(check);

  data = JSON.stringify(dataStr);
  fs.writeFileSync("./data/users.json", data, "utf8");
});

app.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});
