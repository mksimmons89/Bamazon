var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
console.log("connected!");
});

connection.query("SELECT * FROM products", function(err, data) =>{

if (error) throw err;
console.log(data);
connection.end();
