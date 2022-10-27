const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

// добавление USER LOGIN & PASS

let data = fs.readFileSync("./dataModels.json", "utf8");
let dataModels = JSON.parse(data);

dataModels.forEach((element) => {
  element.articles.forEach((item) => {
    if (item.frame === undefined) {
      item.frame = "";
    }
    if (item.surfaces === undefined) {
      item.surfaces = {};
      item.surfaces.p2 = [];
      item.surfaces.p4 = [];
      item.surfaces.p2.push({
        job: "",
        current: "",
        date: "",
      });
      item.surfaces.p4.push({
        job: "",
        current: "",
        date: "",
      });
    }
  });
});

dataModels.forEach((element) => {
  element.articles.forEach((item) => {
    console.log(item);
    item.surfaces.p2.forEach((obj) => {
      if (obj.net === undefined) {
        obj.net = "";
      }
    });
    item.surfaces.p4.forEach((obj) => {
      if (obj.net === undefined) {
        obj.net = "";
      }
    });
  });
});

dataModels.forEach((element) => {
  element.articles.forEach((item) => {
    if (item.frame === "") {
      item.frame = ["", ""];
    }
  });
});

data = JSON.stringify(dataModels);
fs.writeFileSync("./dataModels.json", data, "utf8");
