class User {

	constructor(data) {
		this.friends = {};
		this.pendingGameFrom = [];
		this.pendingGameTo = [];
		data.friends.forEach(friend => {
			this.friends[friend] = { status: 'offline' };
		});
		
		this.update(data);
	}
	
	update(data) {
		this.username = data['username'];
		this.profilePicture = data['profilePicture'];
		this.userStats = data['userStats'];
		this.email = data['email'];
		this.pendingFriendFrom = data['pendingFriendsFrom'];
		this.pendingFriendTo = data['pendingFriendsTo'];
		this.blocked = data['blockedUsers'];
		this.gameTheme = data['gameTheme'];
	}	

	addFriend(newfriend) {
		this.friends[newfriend] = { status: 'online' };
	}

	addBlockedUser(block) {
		if (!this.blocked.includes(block))
			this.blocked.push(block);
	}

	addPendingFriendTo(newpendingto) {
		if (!this.pendingFriendTo.includes(newpendingto))
			this.pendingFriendTo.push(newpendingto);
	}

	addPendingFriendFrom(username) {
		if (!this.pendingFriendFrom.includes(username)) {
			this.pendingFriendFrom.push(username);
		}
	}

	addPendingGameFrom(username) {
		if (!this.pendingGameFrom.includes(username)) {
			this.pendingGameFrom.push(username);
		}
	}

	addPendingGameTo(username) {
		if (!this.pendingGameTo.includes(username)) {
			this.pendingGameTo.push(username);
		}
	}

	setFriendStatus(username, status) {
		if (this.friends[username]) {
			this.friends[username].status = status;
		}
	}

	getFriendStatus(username) {
		if (this.friends[username]) {
			return this.friends[username].status;
		}
		return undefined;
	}

	getUsername() {
		return this.username;
	}

	getGameTheme(){
		if (this.gameTheme != null && this.gameTheme != "")
			return this.gameTheme;
		else
			return "d2";
	}
	
	isFriend(username) {
		if (this.friends.hasOwnProperty(username)) {
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

	removeBlockedUser(block) {
		removeElement(this.blocked, block)
	}

	removePendingGameTo(username) {
		removeElement(this.pendingGameTo, username)
	}

	removePendingGameFrom(username) {
		removeElement(this.pendingGameFrom, username);
	}

	removeFriend(oldfriend) {
		delete (this.friends[oldfriend])
	}
}

function removeElement(array, value) {
	const index = array.indexOf(value);
	if (index !== -1) {
		array.splice(index, 1);
	}
}

export default User;