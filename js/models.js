'use strict';

const BASE_URL = 'https://hack-or-snooze-v3.herokuapp.com';

class Story {
	constructor ({ author, createdAt, storyId, title, updatedAt, url, username }) {
		this.author = author;
		this.createdAt = createdAt;
		this.storyId = storyId;
		this.title = title;
		this.updatedAt = updatedAt;
		this.url = url;
		this.username = username;
	}

	getHostName () {
		return new URL(this.url).host;
	}
}

class StoryList {
	constructor (storiesArr) {
		this.storiesArr = storiesArr;
	}

	// static async/await function that makes an api call to get the most current stories... it also takes the stories array portion of the response and maps each element of that array into a new instance of the Story class and then returns a new instance of the StoryList class.
	static async getStories () {
		console.debug('StoryList.getStories');
		const response = await axios({
			method : 'GET',
			url    : `${BASE_URL}/stories`,
		});
		const storiesArray = response.data.stories.map((story) => new Story(story));
		return new StoryList(storiesArray);
	}

	async addStory (user, { title, author, url }) {
		console.debug('StoryList.addStory');
		const token = user.token;
		const response = await axios({
			method : 'POST',
			url    : `${BASE_URL}/stories`,
			data   : { token, story: { title, author, url } },
		});
		console.log(response.data.story);

		const story = new Story(response.data.story);
		this.storiesArr.unshift(story);
		user.stories.unshift(story);

		return story;
	}
}

class User {
	/** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */
	constructor ({ createdAt, favorites = [], name, password, stories = [], updatedAt, username }, token) {
		this.createdAt = createdAt;
		this.favorites = favorites.map((s) => new Story(s));
		this.name = name;
		this.password = password;
		this.stories = stories.map((s) => new Story(s));
		this.updatedAt = updatedAt;
		this.username = username;
		this.token = token;
	}

	static async loginViaStoredCredentials (token, username) {
		try {
			const response = await axios({
				url    : `${BASE_URL}/users/${username}`,
				method : 'GET',
				params : { token },
			});

			let { user } = response.data;

			return new User(
				{
					username   : user.username,
					name       : user.name,
					createdAt  : user.createdAt,
					favorites  : user.favorites,
					ownStories : user.stories,
				},
				token,
			);
		} catch (err) {
			console.error('loginViaStoredCredentials failed', err);
			return null;
		}
	}

	/** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

	static async signup (username, password, name) {
		const response = await axios({
			url    : `${BASE_URL}/signup`,
			method : 'POST',
			data   : { user: { username, password, name } },
		});

		let { user } = response.data;

		return new User(
			{
				username   : user.username,
				name       : user.name,
				createdAt  : user.createdAt,
				favorites  : user.favorites,
				ownStories : user.stories,
			},
			response.data.token,
		);
	}

	/** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

	static async login (username, password) {
		const response = await axios({
			url    : `${BASE_URL}/login`,
			method : 'POST',
			data   : { user: { username, password } },
		});

		let { user } = response.data;

		return new User(
			{
				username   : user.username,
				name       : user.name,
				createdAt  : user.createdAt,
				favorites  : user.favorites,
				ownStories : user.stories,
			},
			response.data.token,
		);
	}

	/** Add a story to the list of user favorites and update the API
   * - story: a Story instance to add to favorites
   */

	/** Add a story to the list of user favorites and update the API
   * - story: a Story instance to add to favorites
   */

	async addFavorite (story) {
		console.debug('addFavorite');
		const token = this.token;
		this.favorites.push(story);
		await axios({
			url    : `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
			method : 'POST',
			data   : { token },
		});
	}

	/** Remove a story to the list of user favorites and update the API
   * - story: the Story instance to remove from favorites
   */

	async removeFavorite (story) {
		console.debug('removeFavorite');
		const token = this.token;
		this.favorites = this.favorites.filter((s) => s.storyId !== story.storyId);
		await axios({
			url    : `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
			method : 'DELETE',
			data   : { token },
		});
	}

	/** Return true/false if given Story instance is a favorite of this user. */

	isFavorite (story) {
		return this.favorites.some((s) => s.storyId === story.storyId);
	}
}
