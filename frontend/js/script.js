console.log("hello");
const go = document.getElementById("coffee-button");

// declare all our inputs
const priceInput = document.getElementById("price-input");
const nameInput = document.getElementById("name-input");
const imageURLInput = document.getElementById("image-url-input");

// setting up our coffee data
// const latte = {
//   name: "Long Black",
//   price: 3.0,
//   image_url:
//     "https://whitehorsecoffee.com.au/wp-content/uploads/2016/09/unnamed-6.jpg",
// };

let showAllCoffee = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3100/allCoffee",
    // your success function contains a object which can be named anything
    success: (coffees) => {
      console.log(coffees);
      renderCoffees(coffees);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

go.onclick = () => {
  console.log("clicked");
  $.ajax({
    url: `http://localhost:3100/addCoffee`,
    // use the post type to create data somewhere
    // requesting to POST our data
    type: "POST",
    // we can send objects through to the backend, using the data argument
    data: {
      // the first property (i.e. the one on the left) called name has to be spelt exactly as the schema
      name: nameInput.value,
      price: priceInput.value,
      image_url: imageURLInput.value,
    },
    success: () => {
      console.log("A new coffee was added.");
      showAllCoffee();
    },
    error: () => {
      console.log("Error: cannot reach the backend");
    },
  });
};

// this function gets run when we click on a delete button
let deleteCoffee = (coffeeId) => {
  // use ajax and go to the delete route
  $.ajax({
    // Let's go to our route
    url: `http://localhost:3100/deleteCoffee/${coffeeId}`,
    type: "DELETE",
    success: () => {
      // at this point, we can assume that the delete was successful
      showAllCoffee();
    },
    error: () => {
      console.log("Cannot call API");
    },
  });
};

handleEditFunctionality = (coffee, id) => {
  let productName = document.getElementById("productName");
  let productPrice = document.getElementById("productPrice");
  let imageurl = document.getElementById("imageUrl");
  let imagePreview = document.getElementById("image-preview");
  productName.value = coffee.name;
  productPrice.value = coffee.price;
  imageurl.value = coffee.image_url;
  imagePreview.innerHTML = `
  <img src="${coffee.image_url}" alt="${productName}">
  `;
  // console.log(`the id was passed in ${id}`)
  // ===============================
  //        EDIT CLICK LISTENER
  // ===============================

  $("#updateProduct").click(function () {
    event.preventDefault();
    let productId = id;
    let productName = document.getElementById("productName").value;
    let productPrice = document.getElementById("productPrice").value;
    let imageurl = document.getElementById("imageUrl").value;
    console.log(productId, productName, productPrice, imageurl);
    $.ajax({
      url: `http://localhost:3100/updateProduct/${productId}`,
      type: "PATCH",
      data: {
        name: productName,
        price: productPrice,
        image_url: imageurl,
      },
      success: function (data) {
        console.log(data);
        showAllCoffee();
        $('#editModal').modal('hide');
        $("#updateProduct").off('click');
      },
      error: function () {
        console.log("error: cannot update");
      },
    });
  });
}

// this function will ask the backend for data relating to the coffee we clicked on to edit
populateEditModal = (coffeeId) => {
  console.log(coffeeId);
  $.ajax({
    url: `http://localhost:3100/coffee/${coffeeId}`,
    type: "GET",
    success: (coffeeData) => {
      // console.log("coffee was found!")
      // console.log(coffeeData);
      handleEditFunctionality(coffeeData, coffeeId);
    },
    error: (error) => {
      console.log(error)
    }
  })
};

// this function will handle all our deletes
let collectDeleteButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  let deleteButtonsArray = document.getElementsByClassName("delete-button");
  // this will loop over every delete button
  for (let i = 0; i < deleteButtonsArray.length; i++) {
    deleteButtonsArray[i].onclick = () => {
      let currentId = deleteButtonsArray[i].parentNode.id;
      // delete coffee based on the id
      deleteCoffee(currentId);
    };
  }
};

// this will gather all our edits and add a click listener for them
// if we click on an edit button it will grab the ID from the parent node (the div around it)
let collectEditButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  let editButtonsArray = document.getElementsByClassName("edit-button");
  // this will loop over every edit button
  for (let i = 0; i < editButtonsArray.length; i++) {
    editButtonsArray[i].onclick = () => {
      let currentId = editButtonsArray[i].parentNode.id;
      // delete coffee based on the id
      populateEditModal(currentId);
    };
  }
};

let renderCoffees = (coffees) => {
  console.log("The render coffee function is running");
  result.innerHTML = "";
  coffees.forEach((item) => {
    result.innerHTML += `
      <div class="result-container" id="${item._id}">
      <img src="${item.image_url}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>$${item.price}</p> 
      <i class="fa-solid fa-trash-can delete-button"></i>
      <i class="fa-solid fa-pen-to-square edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
      </div>
      `;
  });
  // all coffees should be rendered now
  // and now we can collect the delete buttons
  collectDeleteButtons();
  // collect edit buttons
  collectEditButtons();
};

// start app
showAllCoffee();

// this function checks if the users logged in
// if they are, show the username and their profile image

let checkLogin = () => {
  const userDetails = document.getElementById("user-details");
  let navContent;
  if (sessionStorage.userID) {
    // console.log("You're logged in")
    // console.log(sessionStorage.userName)
    navContent = `
    <span id="username">${sessionStorage.userName}</span>
    <span id="dp" style="background-image: url('${sessionStorage.profileImg}')"></span>
    <a id="sign-out-button" href="#">Sign out</a>
    `
  }
  // if they're not logged in
  else {
    navContent = `
    <a href="login.html">Login</a>
    <a href="signup.html">Signup</a>
    `;
  }
  // render our logged in elements
  userDetails.innerHTML = navContent;
}

checkLogin();

// Sign out button
const signoutBtn = document.getElementById("sign-out-button");

let logOut = () => {
  console.log("You've logged out")
  sessionStorage.clear();
  window.location.reload();
}

if (sessionStorage.userID) {
  signoutBtn.onclick = () => logOut();
};
