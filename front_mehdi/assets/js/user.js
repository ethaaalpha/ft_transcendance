class User {

	constructor(data) {
		this.update(data);
	}

	update(data) {
		this.friends = {}; // Initialize this.friends as an empty object
		for (const i in data['friends']) {
			if (this.friends.hasOwnProperty(i)) {
				continue;
			} else {
				this.friends[i] = 'offline';
			}
		}		
		this.username = data['username'];
		this.profilePicture = data['profilePicture'];
		this.userStats = data['userStats'];
		this.email = data['email'];
		this.pendingFriendsFrom = data['pendingFriendsFrom'];
		this.blocked = data['blockedUsers'];
	}

	setFriendState(user, state) {
		this.friends[user] = state;
	}

	getFriendState(user) {
		if (this.friends.hasOwnProperty(user)) {
			return this.friends[user];
		} else {
			return undefined;
		}
	}

	isFriend(user) {
		if (this.friends.hasOwnProperty(user)) {
			return 'friend';
		}
		if (this.pendingFriendsFrom.includes(user)) {
			return 'pending';
		}
		return 'notFriend';
	}

	isBlocked(user) {
		if (this.blocked.includes(user)) {
			return true;
		}
		return false;
	}
}
