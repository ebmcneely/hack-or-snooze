'use strict';

let storyList;

// async/await function that stores the stories retreived by StoryList.getStories() into the storyList variable... it also clears the loading message and executes putStoriesOnPage()
async function getAndShowStoriesOnStart () {
	console.debug('getAndShowStoriesOnStart');
	storyList = await StoryList.getStories(); //located in models.js in the StoryList class
	$storiesLoadingMsg.remove(); //removes the loading message
	putStoriesOnPage(); //located below
}

// function that empties the "#all=stories-lists" <ol>... then it loops through the storiesArr portion of the new StoryList and executes generateStoryMarkup() for each element in the array... then it appends the results to the "#all=stories-lists" <ol>... then it shows the "#all=stories-lists" <ol> which was previously hidden by hidePageComments()
function putStoriesOnPage () {
	console.debug('putStoriesOnPage');
	$allStoriesList.empty();
	for (let story of storyList.storiesArr) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}
	$allStoriesList.show();
}

// function that takes each element in the storiesArr array and first, executes story.gethostname() which parses the url to isoloate the hostname... then it returns and <li> element with id=story.storyId... then it attaches an anchor tag to the <li> with an href=story.url and innerText = story.title... then it uses the <small> element three times to display the hostname, author, and username in a smaller font
function generateStoryMarkup (story) {
	console.debug('generateStoryMarkup');

	const hostName = story.getHostName();

	return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
		<button class="not-favorite fav-button hidden">Send to Favorites</button>
      </li>
    `);
}

// async/await function that recieves data from the submit story form and stores it in an object called storyData... then the function executes the StoryList.addStory method by passing in currentUser and story data... then the function generates markup for the new story and appends the markup to the all stories list... then the function hides and resets the form... then the function shows the updated stories list
async function submitStoryFormSubmit (evt) {
	console.debug('submitStoryFormSubmit');
	evt.preventDefault();

	const newStoryTitle = document.querySelector('#story-adding-title');
	const newStoryAuthor = document.querySelector('#story-adding-author');
	const newStoryUrl = document.querySelector('#story-adding-url');

	const title = newStoryTitle.value;
	const author = newStoryAuthor.value;
	const url = newStoryUrl.value;
	const username = currentUser.username;
	const storyData = { title, url, author, username };

	const story = await storyList.addStory(currentUser, storyData);

	const $story = generateStoryMarkup(story);
	$allStoriesList.prepend($story);

	// hide the form and reset it
	$storyAddingForm.slideUp('slow');
	$storyAddingForm.trigger('reset');
	$allStoriesList.show();
}
$storyAddingForm.on('submit', submitStoryFormSubmit);

// function that empties out the favorite stories <ol>... then it checks the favorites array within the user object for any entries, if there are no entries then the function appends an <h5> element to the favorite stories <ol> with innerText that reads "No favorites added"... if there are entries in the favorites array then the function loops over the array and execute generateStoryMarkup() using each element... then the funtion appends the story markups to the fovorites list and shows the favorites list on screen
function putFavoritesListOnPage () {
	console.debug('putFavoritesListOnPage');
	$favoriteStoriesList.empty();
	if (currentUser.favorites.length === 0) {
		$favoriteStoriesList.append('<h5>No favorites added!</h5>');
	}
	else {
		// loop through all of users favorites and generate HTML for them
		for (let story of currentUser.favorites) {
			const $story = generateStoryMarkup(story);
			$favoriteStoriesList.append($story);
		}
	}
	$favoriteStoriesList.show();
}

async function toggleStoryFavorite (evt) {
	console.debug('toggleStoryFavorite');

	const $tgt = $(evt.target);
	const $closestLi = $tgt.closest('li');
	const storyId = $closestLi.attr('id');
	const story = storyList.storiesArr.find((s) => s.storyId === storyId);

	// see if the item is already favorited (checking by presence of star)
	if ($tgt.hasClass('yes-favorite')) {
		// currently a favorite: remove from user's fav list and change star
		await currentUser.removeFavorite(story);
		$tgt.toggleClass('not-favorite yes-favorite');
	}
	else {
		// currently not a favorite: do the opposite
		await currentUser.addFavorite(story);
		$tgt.toggleClass('not-favorite yes-favorite');
	}
}

$allStoriesList.on('click', '.fav-button', toggleStoryFavorite);

function putMyStoriesListOnPage () {
	console.debug('putMyStoriesListOnPage');

	$myStoriesList.empty();

	if (currentUser.ownStories.length === 0) {
		$myStoriesList.append('<h5>No stories added by user yet!</h5>');
	}
	else {
		// loop through all of users stories and generate HTML for them
		for (let story of currentUser.ownStories) {
			let $story = generateStoryMarkup(story, true);
			$myStoriesList.append($story);
		}
	}
	$myStoriesList.show();
}
