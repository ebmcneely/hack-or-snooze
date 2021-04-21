'use strict';

const $body = $('body');

const $navLinks = $('.nav-links');
const $storyAddingTag = $('#story-adding-tag');
const $favoritesTag = $('#favorites-tag');
const $myStoriesTag = $('#my-stories-tag');
const $navLoginTag = $('#nav-login-tag');
const $navUserProfileTag = $('#nav-user-profile-tag');
const $navLogOutTag = $('#nav-logout-tag');

const $loginForm = $('#login-form');
const $signupForm = $('#signup-form');
const $storyAddingForm = $('#story-adding-form');

const $storiesLoadingMsg = $('#stories-loading-msg');
const $allStoriesList = $('#all-stories-list');
const $favoriteStoriesList = $('#favorite-stories-list');
const $myStoriesList = $('#my-stories-list');



function hidePageComponents () {
	const components = [
		$allStoriesList,
		$favoriteStoriesList,
		$myStoriesList,
		$loginForm,
		$signupForm,
		$storyAddingForm,
	];
	components.forEach((component) => component.hide());
}

async function start () {
	console.debug('start');
	await checkForRememberedUser(); //located in user.js
	await getAndShowStoriesOnStart(); //located in stories.js
	if (currentUser) updateUIOnUserLogin();
}

$(start);
