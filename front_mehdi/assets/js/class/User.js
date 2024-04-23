class User {

	constructor(data) {
		this.friends = {};
		this.update(data);
	}
	
	update(data) {
		this.friends = data.friends;
		this.username = data['username'];
		this.profilePicture = data['profilePicture'];
		this.userStats = data['userStats'];
		this.email = data['email'];
		this.pendingFriendsFrom = data['pendingFriendsFrom'];
		this.pendingFriendsTo = data['pendingFriendsTo'];
		this.blocked = data['blockedUsers'];
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
		} else if (this.pendingFriendsFrom.includes(username)) {
			return 'pending';
		} else if (this.pendingFriendsTo.includes(username)) {
			return 'pending';
		} else {
			return 'notFriend';
		}
	}

	isBlocked(username) {
		if (this.blocked.includes(username)) {
			return true;
		}
		return false;
	}

	removeFriend(username) {
		const index = this.friends.indexOf(username);
		if (index > -1) {
			this.friends.splice(index, 1);
		}
	}
	
}

export default User;
