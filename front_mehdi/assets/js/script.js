function checkAndUnhideFields() {
	var identifiant = document.getElementById("identifiant").value;
	var passwordConfirm = document.getElementById("passwordConfirm");
	var email = document.getElementById("email");
	
	
	if (identifiant === "") {
		passwordConfirm.classList.remove("d-none");
		email.classList.remove("d-none");
	} else {
		hideLoginForm();
	}
}


function hideLoginForm() {
	var loginForm = document.getElementById("loginForm");
	loginForm.classList.add("d-none");
	unhideLoginForm();
}

function unhideLoginForm() {
	var loginForm = document.getElementById("Wesh");
	loginForm.classList.remove("d-none");
}


// if (identifiant === "") {
// 	display error empty
// } else {
// 	if not into database OR wrong password {
// 		display error wrong combinaison username password
// 	}
// 	else
// 		hide and succefully loged scenario
// }
  