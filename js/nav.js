'use strict';

// function that executes hidePageComments() and putStoriesOnPage() when the Hack or Snooze anchor tag is clicked... hidePageComments() is located in main.js and putStoriesOnPage is located in stories.js
function navAllStories (evt) {
	console.debug('navAllStories', evt);
	hidePageComponents(); // located in main.js
	putStoriesOnPage(); // located in stories.js
	updateNavOnLogin();
}
$body.on('click', '#nav-all', navAllStories); // attaches an event handler to the Hack or Snooze anchor tag which then executes navAllStories when the anchor tag is clicked

// function that executes hidePageComponents() when the login/signup anchor tag is clicked... it also displays the login and signup forms... hidePageComments() is located in main.js
function navLoginClick (evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}
$navLoginTag.on('click', navLoginClick); // attaches an event handler to the login/signup anchor tag which then executes navLoginClick when the anchor tag is clicked

// function that changes the navbar layout once a user is logged in by hiding the login anchor tag, showing the logout anchor tag, showing the submit, favorites, and my stories anchor tags, and assigning the username to the user profile anchor tag... this funtion is called within updateUIOnUserLogin() in user.js
function updateNavOnLogin () {
	console.debug('updateNavOnLogin');

	const $favButtons = $('.fav-button');

	$navLoginTag.hide();
	$favButtons.show();
	$navLogOutTag.show();
	$navLinks.show();
	$navUserProfileTag.text(`${currentUser.username}`).show();
}

// function that executes hidePageComponents() and shows the story adding form when the submit anchor tag is clicked... hidePageComments() is located in main.js
function navSubmitClick (evt) {
	console.debug('navSubmitClick', evt);
	hidePageComponents();
	$storyAddingForm.show();
}
$storyAddingTag.on('click', navSubmitClick);

// function that executes hidePageComponents() and putFavoritesListOnPage() when the favorites anchor tag is clicked... hidePageComments() is located in main.js and putFavoritesListOnPage() is located in stories.js
function navFavoritesClick (evt) {
	console.debug('navFavoritesClick', evt);
	hidePageComponents();
	putFavoritesListOnPage();
}
$body.on('click', '#favorites-tag', navFavoritesClick);

function navMyStoriesClick (evt) {
	console.debug('navMyStoriesClick', evt);
	hidePageComponents();
	putMyStoriesListOnPage();
}
$body.on('click', '#my-stories-tag', navMyStoriesClick);
