class User {

	constructor(data) {
		this.friends = {};
		this.pendingGameFrom = [];
		this.pendingGameTo = [];
		data.friends.forEach(friend => {
			this.friends[friend] = { status: 'offline' }; // Définir l'état par défaut à 'offline'
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

	// setter
	addFriend(newfriend) {
		this.friends[newfriend] = { status: 'offline' };
	}

	removeFriend(oldfriend) {
		delete (this.friends[oldfriend])
	}

	addBlockedUser(block) {
		if (!this.blocked.includes(block))
			this.blocked.push(block);
	}

	removeBlockedUser(block) {
		removeElement(this.blocked, block)
	}

	addPendingFriendTo(newpendingto) {
		if (!this.pendingFriendTo.includes(newpendingto))
			this.pendingFriendTo.push(newpendingto);
	}

	addPendingGameFrom(username) {
		if (!this.pendingGameFrom.includes(username)) {
			console.log("addPendingGameFrom: " + username);
			this.pendingGameFrom.push(username);
			console.log(this.pendingGameFrom);
		}
	}

	removePendingGameFrom(username) {
		removeElement(this.pendingGameFrom, username);
	}

	addPendingGameTo(username) {
		if (!this.pendingGameTo.includes(username)) {
			this.pendingGameTo.push(username);
		}
	}

	removePendingGameTo(username) {
		removeElement(this.pendingGameTo, username)
	}

	setFriendStatus(username, status) {
		if (this.friends[username]) {
			this.friends[username].status = status;
		}
	}

	// getter
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
		console.log(this.gameTheme)
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

	// remover
	// removeFriend(username) {
	// 	const index = this.friends.indexOf(username);
	// 	if (index > -1) {
	// 		this.friends.splice(index, 1);
	// 	}
	// }

	// removePendingGameFrom(username) {
	// 	const index = this.pendingGameFrom.indexOf(username);
	// 	if (index !== -1) {
	// 		this.pendingGameFrom.splice(index, 1);
	// 	}
	// }

	// removePendingGameTo(username) {
	// 	const index = this.pendingGameTo.indexOf(username);
	// 	if (index !== -1) {
	// 		this.pendingGameTo.splice(index, 1);
	// 	}
	// }
}

export default User;


function removeElement(array, value) {
    const index = array.indexOf(value);
    if (index !== -1) {
        array.splice(index, 1);
    }
}
