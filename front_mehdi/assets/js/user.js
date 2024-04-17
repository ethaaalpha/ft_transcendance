class User {

	constructor(data) {
		this.friends = {};
		this.update(data);
		// console.log("Liste des amis dans le constructeur :");
		// console.log(this.friends);
	}
	
	update(data) {
		this.friends = data.friends;
		this.username = data['username'];
		this.profilePicture = data['profilePicture'];
		this.userStats = data['userStats'];
		this.email = data['email'];
		this.pendingFriendsFrom = data['pendingFriendsFrom'];
		// this.pendingFriendsTo = data['pendingFriendsTo'];
		this.blocked = data['blockedUsers'];
	}

	setFriendState(username, state) {
		this.friends[username] = state;
	}

	getFriendState(username) {
		if (this.friends.includes(username)) {
			return this.friends[username];
		} else {
			return undefined;
		}
	}

	isFriend(username) {
		if (this.friends.includes(username)) {
			return 'friend';
		} else if (this.pendingFriendsFrom.includes(username)) {
			return 'pending';
		// } else if (this.pendingFriendsTo.includes(username)) {
		// 	return 'pending';
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
