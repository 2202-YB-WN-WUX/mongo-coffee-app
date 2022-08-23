{/* <label for="name-input">Name: </label>
<input id="name-input" name="name-input" type="text">
<label for="password-input">Password: </label>
<input id="password-input" name="password-input" type="password">
<button id="login-button">Login</button> */}

const server = "http://localhost:3100"
const loginBtn = document.getElementById("login-button")
const nameInput = document.getElementById("name-input")
const passwordInput = document.getElementById("password-input");

loginBtn.onclick = () => {
    $.ajax({
        url: `${server}/loginUser`,
        type: 'POST',
        data: {
            username: nameInput.value,
            password: passwordInput.value
        },
        success: (user) => {
            if (user == 'user not found') {
                console.log("User is not found please register")
            } else if (user == 'not authorised') {
                console.log("Incorrect password")
            } else {
                console.log("awesome you are logged in successfully")
                console.log(user);
                // set the sessions storage with the user grabbed from the database (Mongodb)
                sessionStorage.setItem('userID', user._id);
                sessionStorage.setItem('userName', user.username);
                sessionStorage.setItem('profileImg', user.profile_img_url);
                // redirect automatically
                document.location.href = 'index.html';
            }
        },
        error: () => {
            console.log("error cannot call api")
        }
    })
}