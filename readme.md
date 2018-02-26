![Welcome prompt](https://github.com/mksimmons89/Bamazon/blob/master/screenshots/storeWelcome.png)
After requiring all the nmp installations and connecting our pages together
(including connecting mySQL database), we were ready to begin. I created a read
and update function that scanned the mySQL database before we could launch the
store. These functions read the stock of all items and is sure to update
quantity of the item purchased goes down.

In this beginning page, the store welcomes you and asks if you would like to buy
anything. If you say no, it tells you to come again. If you say yes, the
inquirer prompt continues...

![List of all available options](https://github.com/mksimmons89/Bamazon/blob/master/screenshots/productOptions.png))
If you say yes, in a very organized fashion, a list of products, with quantities
and price will fill the screen. This is done by a queryAllProducts function that
uses a for loop to run through all the items and push them to the screen. The
npm table installation with color makes everything look clean.



![Prompt of what you want to purchase and how much?](https://github.com/mksimmons89/Bamazon/blob/master/screenshots/productPrompt.png))
By selecting the id number associated with the mySQL data base, you can make
your product selection and then follow it with a quantity amount. If you
purchase an item that were out of, it tell you we have an insufficient quantity.
If you have the right quantity, the count on that item with go down by 1.



![Confirms your selections and gives you your
total](https://github.com/mksimmons89/Bamazon/blob/master/screenshots/SelectionandSummary.png)and_Summary.png)
Here, all the info is iterated back to you by using pre established variables in
an answer function. Also using answer as an argument in a final function, you
are asked if you would like to start over. If yes, our start over function
brings you back to the beginning.
