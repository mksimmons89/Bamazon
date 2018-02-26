//NPM Install
let inquirer = require("inquirer");
let mysql = require("mysql");
let colors = require("colors");
const boxen = require("boxen");
const table = require('cli-table');


// Create the connection of sql database
let connection = mysql.createConnection({
  hostname: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazonDB"
});

//Database File
connection.connect(function(err) {
  if (err) throw err;
  //[Connection Checked]
  // console.log("connected id " + connection.threadId);
  start();
});

//CRUD Methods
const database = {
  // create: function() {},

  read: function(selector= "*",place = "products") {
    //ternatary
    // selector = typeof selector !== "undefined" ? selector : "*";
    // place = typeof selector !== "undefined" ? place : "products";
    // const queryString = "SELECT" + selector + " FROM " + place;
    const queryString = `SELECT ${selector} FROM ${place}`;
    //promise will be easier
    //promise will have a value to return the function
    //database .read can be treat as a value
    return new Promise(function(resolve, reject) {
      connection.query(queryString, function(err, res) {
        if (err) {
          reject(err);
        } else if (!res) {
          console.log("No Results");
        } else {
          resolve(res);
        }
      });
    });
  },

  update: function(qty, id, column= "stock_quantity",place = "products") {
    // console.log("What is", qty, id, column, place);

    const queryString = `UPDATE ${place} SET ${column} = ${qty} WHERE item_id= ${id}`;
    return new Promise(function(resolve, reject) {
      connection.query(queryString, function(err, res) {
        if (err) reject(err);
        else if (!res) {
          console.log("No Results");
        } else {
          resolve(res);
        }
      });
    });
  }

  // delete: function() {},
  // No need to delete for customer only for manager

  // formatting: function() {}
  // No need to reformat the data only for manager
};

console.log(
  colors.yellow(
    boxen("\nBAMAZON \nPurchase Your Groceries", {
      padding: 1,
      align: "center"
    })
  )
);

//Customer File
function start() {
  inquirer
    .prompt({
      name: "start",
      type: "list",
      choices: ["yes please!", "No thanks!"],
      message: "Would you like to buy something?"
    })
    .then(function(answer) {
      if (answer.start === "yes please!") {
        queryAllProducts();
      } else {
        console.log(
          colors.yellow(
            boxen("come back again", {
              align: "center",
              padding: 1,
              margin: 0,
              borderStyle: "double"
            })
          )
        );
        connection.end();
      }
    });
}

function queryAllProducts() {
  connection.query("SELECT * FROM products", function(err, results) {
    console.log(colors.red("__________________________________"));
    console.log(colors.red("__________________________________"));

    console.log("\n" + "    AVAILABLE PRODUCTS FOR SALE:");
    console.log("__________________________________");
    for (var i = 0; i < results.length; i++) {
      console.log(
          boxen(
            "\nProduct Id: " +
              results[i].item_id +
              "\nProduct Name: " +
              results[i].product_name +
              "\nDepartment Name: " +
              results[i].department_name +
              "\nPrice: $" +
              results[i].price.toFixed(2) +
              "\n",
            { padding: 0, borderStyle: "single", align: "center" }
          )
        )
      console.log("__________________________________");
    }
    setTimeout(() => {
      purchaseProductId(results);
    }, 20);
  });
}

function purchaseProductId(products) {
  console.log("\n");
  inquirer
    .prompt([
      {
        name: "id",
        type: "list",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < products.length; i++) {
            choiceArray.push(
              `${products[i].item_id} ${products[i].product_name}`
            );
          }
          return choiceArray;
        },
        message: "Please choose the item you would like to purchase: "
      },
      {
        name: "quantity",
        type: "input",
        message: "How many of the item would you like to buy?"
      }
    ])
    .then(function(answer) {
      const ans = answer.id;
      const currentId = answer.id.split(" ");
      var updatedQuantity = parseInt(
        products[parseInt(currentId[0] - 1)].stock_quantity - answer.quantity
      );
      const total =
        answer.quantity * parseFloat(products[currentId[0] - 1].price);

      if (updatedQuantity >= 0) {
        database.update(updatedQuantity, parseInt(currentId[0]));

        console.log("**************************************");
        console.log(`\nThank you for purchasing:\n${ans.slice(2)}\n`);
        console.log("**************************************");
        console.log(
          `\nHere is the quantity you purchased:\n${answer.quantity}\n`
        );
        console.log("**************************************");
        console.log(
          `\nHere is your total cost for the item(s) you purchased:\n$${total.toFixed(
            2
          )}.\n`
        );
        console.log("**************************************");
      } else {
        console.log(
          "Unfortunately, we cannot fufill your order at this time due to insufficient item in stock.\n"
        );
        inquirer
          .prompt([
            {
              name: "newOrder",
              type: "list",
              choices: ["Yes", "No"],
              message: "Would you like to start over?"
            }
          ])
          .then(function(answer) {
            if (answer.newOrder === "Yes") {
              start();
            } else {
              connection.end();
              console.log("Please come back again!");
            }
          });
      }
    });
}
