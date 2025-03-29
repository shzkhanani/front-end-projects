// Add all your JS code here

// References :
// Username Regex : https://www.w3schools.com/jsref/jsref_regexp_test.asp,
//          https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
// Password regex : https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
// Email regex : https://www.w3resource.com/javascript/form/email-validation.php
// Phone regex : https://stackoverflow.com/questions/6960596/example-of-a-regular-expression-for-phone-numbers

// https://www.w3schools.com/jsref/prop_text_value.asp
// https://www.w3schools.com/jsref/jsref_regexp_test.asp
// https://www.w3schools.com/jsref/prop_style_background.asp

// ================================================================================================================  Q1

$(document).ready(function(){
    function validate_username(){
        let username = document.getElementById("username").value;
        if(username.length === 0){
            document.getElementById("username").style.backgroundColor = "red";
            document.getElementById("username_notification").innerHTML = "Username is invalid";
            return false;
        }
        else{
            let username_pattern = /^[a-zA-Z0-9_]{6,}$/;
            let valid = username_pattern.test(username)
             if(!valid){
                    document.getElementById("username").style.backgroundColor = "red";
                    document.getElementById("username_notification").innerHTML = "Username is invalid";
                    return false;
             }
            else {
                document.getElementById("username_notification").innerHTML = "";
                document.getElementById("username").style.backgroundColor = "transparent";
                return true;
            }
        }
    }

    function validate_password1(){
        let password1 = document.getElementById("password1").value;
        let password_pattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?& ])[A-Za-z\d@$!%*?& ]{8,}$/;
        let valid = password_pattern.test(password1);
        if(!valid){
            document.getElementById("password1").style.backgroundColor = "red";
            document.getElementById("password1_notification").innerHTML = "Password is invalid";
            return false;

        }
        else {
            document.getElementById("password1_notification").innerHTML = "";
            document.getElementById("password1").style.backgroundColor = "transparent";
            return true;
        }
    }
    function validate_password2(){
        let password1 = document.getElementById("password1").value;
        let password2 = document.getElementById("password2").value;
        if(password2!==password1){
            document.getElementById("password2").style.backgroundColor = "red";
            document.getElementById("password2_notification").innerHTML = "Passwords don't match";
            return false;
        }
        else {
            document.getElementById("password2_notification").innerHTML = "";
            document.getElementById("password2").style.backgroundColor = "transparent";
            return true;
        }
    }

    function validate_email(){
        let email = document.getElementById("email").value;
        let email_pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let valid = email_pattern.test(email)
        if(!valid){
            document.getElementById("email").style.backgroundColor = "red";
            document.getElementById("email_notification").innerHTML = "Email is invalid";
            return false;

        }
        else {
            document.getElementById("email_notification").innerHTML = "";
            document.getElementById("email").style.backgroundColor = "transparent";
            return true
        }
    }

    function validate_phone(){
        let phone = document.getElementById("phone").value;
        let phone_pattern =/^([0-9]{3})-([0-9]{3})-([0-9]{4})$/;
        let valid = phone_pattern.test(phone);
        if(!valid){
            document.getElementById("phone").style.backgroundColor = "red";
            document.getElementById("phone_notification").innerHTML = "Phone is invalid";
            return false

        }
        else {
            document.getElementById("phone_notification").innerHTML = "";
            document.getElementById("phone").style.backgroundColor = "transparent";
            return true
        }
    }
    // Reference : Lecture week 7-8

    // Real time validation
    $("#username").keyup(function(){
        validate_username()
    })
    $("#password1").keyup(function(){
        let password2 = document.getElementById("password2").value;
        validate_password1()
        if (password2) {
            validate_password2();
        }
    })
    $("#password2").keyup(function(){
        validate_password2();
    })
    $("#email").keyup(function(){
        validate_email();
    })
    $("#phone").keyup(function(){
        validate_phone();
    })

//     Register button validation
//     https://www.tutorialsteacher.com/jquery/jquery-ajax-method
//     Reference : Lecture week 8
    $("#register").click(function() {
        let username_valid = validate_username();
        let password1_valid = validate_password1();
        let password2_valid = validate_password2();
        let email_valid = validate_email();
        let phone_valid = validate_phone();

        if (!username_valid || !password1_valid || !password2_valid || !email_valid || !phone_valid){
            $('#notification').html('At least one field is invalid. Please correct it before proceeding');
        }

        else{
            $.ajax({
            url: "https://ibs.utm.utoronto.ca/csc309/a3/register",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: document.getElementById("username").value,
                password1: document.getElementById("password1").value,
                password2: document.getElementById("password2").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value
            }),
            success: function (data, status,xhr) {
                if(xhr.status === 200) {
                    $('#notification').html('User added');
                }
            },
            error: function (xhr) {
                if(xhr.status === 409){
                    $('#notification').html('Username has already been taken');
                }
                if (xhr.status === 404) {
                    $('#notification').html('Unknown error occurred');
                }
            },
            })
        }
    })
//================================================================================================================= Q2
// References :
// https://www.w3schools.com/jsref/jsref_find.asp#:~:text=The%20find()%20method%20returns,the%20function%20for%20empty%20elements.
// https://www.w3schools.com/jsref/met_table_insertrow.asp
// https://www.tutorialrepublic.com/faq/how-to-check-if-an-array-includes-an-object-in-javascript.php
//  Reference for buttons in table : https://herewecode.io/blog/create-button-javascript/
//  https://www.w3schools.com/jsref/met_element_setattribute.asp
//  https://www.w3schools.com/jsref/coll_table_rows.asp
// https://www.w3schools.com/jquery/traversing_closest.asp
// https://www.w3schools.com/jsref/prop_tablerow_rowindex.asp

    // The shopping cart
    let cart = []

    function addCart(){
        // Get user inputs and table
        let item_name = document.getElementById("name").value;
        let item_price = document.getElementById("price").value;
        let item_quantity = document.getElementById("quantity").value;
        let table = document.getElementById("cart-items");
        let rows = table.rows;
        // Ignore empty inputs
        if(!item_name || !item_price || !item_quantity){
            return;
        }
        // Create item object if it doesnt exist already

        let item_object = new Item(item_name,item_price,item_quantity);

        // If item already exists in cart, update the quantities, subtotal, taxes, and grand total
        // https://www.w3schools.com/jsref/jsref_some.asp

        if(cart.some(Item => Item.name === item_name)){
            updateCartItems(item_object);
        }

        else{
            // Add item to the cart array and create a new row for it

            cart.push(item_object)
            let cartRow = document.createElement('tr');

            // Sets the id of created row as the name of the item with the whitespaces as underscores
            cartRow.setAttribute('id', item_name.replace(/ /g, '_'));

            // Create the cells

            let name = cartRow.insertCell(0);
            let price = cartRow.insertCell(1);
            let quantity = cartRow.insertCell(2);
            let total = cartRow.insertCell(3);
            let decrease = cartRow.insertCell(4);
            let increase = cartRow.insertCell(5);
            let deleteItem = cartRow.insertCell(6);

            //Create button elements and set their class name

            let decrease_button = document.createElement('button');
            let increase_button = document.createElement('button');
            let delete_button = document.createElement('button');

            decrease_button.className = 'decrease';
            increase_button.className = 'increase';
            delete_button.className = 'delete';


        // Add the user inputs to the cells
            name.innerHTML =  item_name;
            price.innerHTML = item_price;
            quantity.innerHTML = item_quantity;
            total.innerHTML = item_object.total;
            decrease_button.innerHTML = '-';
            increase_button.innerHTML = '+';
            delete_button.innerHTML ='delete';
            decrease.appendChild(decrease_button);
            increase.appendChild(increase_button);
            deleteItem.appendChild(delete_button);

        // Append the row to the table and calculate new totals

            table.appendChild(cartRow);
            updateCartTotals(item_object);
        }

        // References : https://dmitripavlutin.com/javascript-event-delegation/
        // https://javascript.info/event-delegation
        // https://stackoverflow.com/questions/66447146/click-event-on-dynamically-created-inputs-with-same-class-name
        //  Event listener for the table, so that the increase, decrease, and delete buttons work in the table rows. Uses
        // event delegation

        table.onclick = function (event){
            if (event.target.className === 'decrease') {
                let item_object = cart.find(item => item.name === event.target.closest("tr").id.replace(/_/g, " "));
                decreaseQuantity(item_object);
            }
            if (event.target.className === 'increase') {
                let item_object = cart.find(item => item.name === event.target.closest("tr").id.replace(/_/g, " "));
                increaseQuantity(item_object);
            }
            if (event.target.className === 'delete') {
                let item_object = cart.find(item => item.name === event.target.closest("tr").id.replace(/_/g, " "));
                deleteCartRow(item_object);
            }
        }
    }
    // This function updates the items quantity and total if the item already exists in the shopping list
    // And then updates the rows to reflect the same
    function updateCartItems(item_object){
        let table = document.getElementById("cart-items");
        let rows = table.rows;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].name === item_object.name) {
                cart[i].price = item_object.price;
                cart[i].quantity = item_object.quantity;
                cart[i].total = cart[i].price * cart[i].quantity;
                updateCartTotals(item_object);

                let new_item_name = item_object.name.replace(/ /g, '_')
                let row = rows.namedItem(new_item_name);
                row.cells[1].innerHTML = cart[i].price ;
                row.cells[2].innerHTML = cart[i].quantity;
                row.cells[3].innerHTML = cart[i].total;
            }
        }
    }

    // Reference : https://stackoverflow.com/questions/39851723/total-in-the-table-dynamically-javascript
    // https://www.w3schools.com/jsref/prop_node_textcontent.asp#:~:text=The%20textContent%20property%20sets%20or
    // ,node%2C%20and%20all%20its%20descendants.
    // https://www.w3schools.com/jsref/jsref_parsefloat.asp
    // When this function is called, the subtotal, taxes, and grand total are all calculated and displayed. Use parsFloat
    // because we need to get the first number from the string, so we can update it

    function updateCartTotals(item_object){
        let subtotal = parseFloat(document.getElementById("subtotal").textContent);
        let taxes = parseFloat(document.getElementById("taxes").textContent);
        let grand_total = parseFloat(document.getElementById("grand_total").textContent);

        subtotal = 0;

        // Recalculates the totals
        for (let i = 0; i < cart.length; i++) {
            subtotal += cart[i].total;
        }
        taxes = subtotal * 0.13;
        grand_total = subtotal + taxes;

        //Update the textcontent of subtotal, taxes, and grand_total, rounded to 2 decimal places

        $('#subtotal').text(subtotal.toFixed(2));
        $('#taxes').text(taxes.toFixed(2));
        $('#grand_total').text(grand_total.toFixed(2));
    }

    function decreaseQuantity(item_object){
        if (item_object.quantity > 0 ){
            item_object.quantity -= 1;
            updateCartItems(item_object);
        }
    }

    function increaseQuantity(item_object){
        item_object.quantity ++;
        updateCartItems(item_object);
    }

    // Reference : https://www.freecodecamp.org/news/how-to-remove-an-element-from-a-javascript-array-removing-a-
    // specific-item-in-js/#:~:text=You%20can%20remove%20the%20element,of%20the%20element%20to%20remove.
    // https://www.w3schools.com/jsref/jsref_findindex.asp#:~:text=The%20findIndex()%20method%20returns,not%20change%20the%20original%20array.
    function deleteCartRow(item_object){
        // Get the table and its rows
        let table = document.getElementById("cart-items");
        let rows = table.rows;

        // Change the item name so it matches the format of the ids in the table rows, then find the row
        // by the id of that row, and then remove it
        let new_item_name = item_object.name.replace(/ /g, '_');
        let row = rows.namedItem(new_item_name);
        row.remove();

        // Find the index of the item in the array and compare it to the item object passed, then delete
        // the item from the cart
        let index = cart.findIndex(item => item.name === item_object.name);
        cart.splice(index, 1);

        updateCartTotals();
    }

// Add cart event listener

    $("#add_update_item").click(function(){
        addCart();
    })


//================================================================================================================= Q3
// Reference : https://www.youtube.com/watch?v=uR2NbrqXfMo&ab_channel=CodingShiksha
// https://www.educative.io/answers/how-to-implement-infinite-scrolling-in-javascript
// https://www.youtube.com/watch?v=xHm6AbNwAw8

    let data_div = document.getElementById('data');
    let number = 1;
    let hasMore = true;
    loadParagraphs();

    function loadParagraphs(numParagraphs = 5){
        // Checks if more data exists
        if(hasMore){
            let url = `https://ibs.utm.utoronto.ca/csc309/a3/text/data?paragraph=${number}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Iterates through the response data, since the response sends back 5 paragraphs, it goes through
                    // all the paragraphs, creates its div, then its paragraph, paragraph number, and
                    // like button, and appends that to
                    // paragraph and its div.
                    for (let i = 0; i < data.data.length; i++) {
                      const paragraph_div = document.createElement('div');
                      paragraph_div.setAttribute('id', `paragraph_${data.data[i].paragraph}`);
                      const paragraph_content = document.createElement('p');
                      const paragraph_number = document.createElement('b');
                      const like_button = document.createElement('button');
                      like_button.className = 'like';
                      paragraph_number.textContent = `(Paragraph: ${data.data[i].paragraph}) `;
                      paragraph_content.textContent = `${data.data[i].content}`;
                      like_button.innerHTML = `Likes: ${data.data[i].likes}`;
                      // Creates the event listener for the button that respons on click by
                      // fetching likes and updating them if needed
                      like_button.addEventListener('click', function() {
                        fetch('https://ibs.utm.utoronto.ca/csc309/a3/text/likes', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            paragraph: data.data[i].paragraph
                          })
                        })
                        .then(response => response.json())
                        .then(data => {
                          like_button.innerHTML = `Likes: ${data.data.likes}`;
                        })
                      });

                      // Appends all the elements to its parent and then appends it to the main data div
                      paragraph_content.appendChild(paragraph_number);
                      paragraph_div.appendChild(paragraph_content);
                      paragraph_div.appendChild(like_button);
                      data_div.appendChild(paragraph_div);
                    }
                    // Increases the number by 5 to get the next set of data and checks if theres anymore data
                    number += data.data.length;
                    hasMore = data.next;

                    // If theres no more data, it sets the end message and appends to the div
                    if(!hasMore){
                        const paragraph_end = document.createElement('p');
                        const end_message = document.createElement('b');
                        end_message.innerHTML = 'You have reached the end';
                        paragraph_end.appendChild(end_message);
                        data_div.appendChild(paragraph_end);
                    }
                })
                // .catch(error => {
                //     console.log('Error:', error);
                // });
        }
    }
    // Event listener for the scroll on the entire window that load paragraphs as you hit the end of the page,
    // reference for it above
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY+0.5;
        let innerHeight = window.innerHeight;
      if (scrollY + innerHeight >= document.documentElement.scrollHeight) {
        loadParagraphs();
      }
    });
})




