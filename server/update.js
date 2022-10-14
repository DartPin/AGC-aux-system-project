const fs = require("fs");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

// добавление USER LOGIN & PASS

let data = fs.readFileSync("./data/users.json", "utf8");
let dataStr = JSON.parse(data);

dataStr.forEach((element) => {
  element.auth = "";
});

console.log(dataStr);
data = JSON.stringify(dataStr);
fs.writeFileSync("./data/users.json", data, "utf8");
