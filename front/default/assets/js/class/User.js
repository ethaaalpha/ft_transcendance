class User {

	constructor(data) {
		this.friends = {};
		this.update(data);
		this.pendingGameFrom = [];
		this.pendingGameTo = [];
	}
	
	update(data) {
		this.friends = data.friends;
		this.username = data['username'];
		this.profilePicture = data['profilePicture'];
		this.userStats = data['userStats'];
		this.email = data['email'];
		this.pendingFriendFrom = data['pendingFriendsFrom'];
		this.pendingFriendTo = data['pendingFriendsTo'];
		this.blocked = data['blockedUsers'];
	}

	// add game pending
	addPendingGameFrom(username) {
		if (!this.pendingGameFrom.includes(username)) {
			console.log("addPendingGameFrom: " + username);
			this.pendingGameFrom.push(username);
			console.log(this.pendingGameFrom);
		}
	}

	addPendingGameTo(username) {
		if (!this.pendingGameTo.includes(username)) {
			this.pendingGameTo.push(username);
		}
	}

	// setters
	setFriendState(username, state) {
		this.friends[username] = state;
	}

	// getters
	getFriendState(username) {
		if (this.friends.includes(username)) {
			return this.friends[username];
		} else {
			return undefined;
		}
	}

	getPendingGameFrom() {
		return this.pendingGameFrom;
	}

	getPendingGameTo() {
		return this.pendingGameTo;
	}

	getUserStats() {
		return this.userStats;
	}

	getUsername() {
		return this.username;
	}

	getProfilePicture() {
		return this.profilePicture;
	}
	
	isFriend(username) {
		if (this.friends.includes(username)) {
			return 'friend';
		} else if (this.pendingFriendFrom.includes(username)) {
			return 'pending';
		} else if (this.pendingFriendTo.includes(username)) {
			return 'pending';
		} else {
			return 'notFriend';
		}
	}

	isPendingFriendFrom(username) {
		if (this.pendingFriendFrom.includes(username)) {
			return true;
		}
		return false;
	}
	
	isPendingFriendTo(username) {
		if (this.pendingFriendTo.includes(username)) {
			return true;
		}
		return false;
	}

	isPendingGameFrom(username) {
		if (this.pendingGameFrom.includes(username)) {
			return true;
		}
		return false;
	}
	
	isPendingGameTo(username) {
		if (this.pendingGameTo.includes(username)) {
			return true;
		}
		return false;
	}

	isBlocked(username) {
		if (this.blocked.includes(username)) {
			return true;
		}
		return false;
	}

	// remover
	removeFriend(username) {
		const index = this.friends.indexOf(username);
		if (index > -1) {
			this.friends.splice(index, 1);
		}
	}

	removePendingGameFrom(username) {
		const index = this.pendingGameFrom.indexOf(username);
		if (index !== -1) {
			this.pendingGameFrom.splice(index, 1);
		}
	}

	removePendingGameTo(username) {
		const index = this.pendingGameTo.indexOf(username);
		if (index !== -1) {
			this.pendingGameTo.splice(index, 1);
		}
	}
}

export default User;
