'use strict';

let currentUser;

async function checkForRememberedUser () {
	console.debug('checkForRememberedUser');

	const token = localStorage.getItem('token');
	console.log(`The token is ${token}`);

	const username = localStorage.getItem('username');
	console.log(`The username is ${username}`);

	if (!token || !username) return false; //***QUESTION... does this stop the function? */

	console.log(currentUser);

	currentUser = await User.loginViaStoredCredentials(token, username); //located in models.js in the User class.
}

async function loginFormSubmit (evt) {
	console.debug('loginFormSubmit', evt);
	evt.preventDefault();

	// grab the username and password
	const username = $('#login-username').val();
	const password = $('#login-password').val();

	// User.login retrieves user info from API and returns User instance
	// which we'll make the globally-available, logged-in user.
	currentUser = await User.login(username, password);

	$loginForm.trigger('reset');

	saveUserCredentialsInLocalStorage();
	updateUIOnUserLogin();
}
$loginForm.on('submit', loginFormSubmit);

async function signup (evt) {
	console.debug('signup', evt);
	evt.preventDefault();

	const name = $('#signup-name').val();
	const username = $('#signup-username').val();
	const password = $('#signup-password').val();

	// User.signup retrieves user info from API and returns User instance
	// which we'll make the globally-available, logged-in user.
	currentUser = await User.signup(username, password, name);

	saveUserCredentialsInLocalStorage();
	updateUIOnUserLogin();

	$signupForm.trigger('reset');
}
$signupForm.on('submit', signup);

function logout (evt) {
	console.debug('logout', evt);
	localStorage.clear();
	location.reload();
}
$navLogOutTag.on('click', logout);

function saveUserCredentialsInLocalStorage () {
	console.debug('saveUserCredentialsInLocalStorage');
	if (currentUser) {
		localStorage.setItem('token', currentUser.loginToken);
		localStorage.setItem('username', currentUser.username);
	}
}

async function updateUIOnUserLogin () {
	console.debug('updateUIOnUserLogin');
	hidePageComponents();
	// re-display stories (so that "favorite" stars can appear)
	putStoriesOnPage();
	$allStoriesList.show();
	updateNavOnLogin();
}
