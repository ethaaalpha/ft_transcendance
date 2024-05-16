import globalVariables from '/static/default/assets/js/init.js';
import { removeChildDiv, createChildDiv } from '/static/default/assets/js/spaManagement/div.js';
import { setEventListener } from '/static/default/assets/js/spaManagement/setEvent.js';
import { unsetEventListener } from '/static/default/assets/js/spaManagement/unsetEvent.js';
import { setFocus } from '/static/default/assets/js/spaManagement/setFocus.js';

let sceneChangeLock = false;
let sceneQueue = [];

async function changeScene(newScene, username) {
	if (sceneChangeLock) {
		addToSceneQueue(newScene, username);
		return;
	}

	sceneChangeLock = true;
	try {
		const sceneInfo = sceneInfos[newScene];
		await changeSceneHandler(sceneInfo, username);
	} catch (error) {
		console.error("Error during scene change :", error);
	} finally {
		sceneChangeLock = false;
		const nextScene = dequeueNextScene();
		if (nextScene) {
			const { scene, username } = nextScene;
			await changeScene(scene, username);
		}
	}
}

function addToSceneQueue(newScene, username) {
	sceneQueue = [{ scene: newScene, username: username }];
}

function dequeueNextScene() {
	const nextScene = sceneQueue.shift();
	return nextScene;
}

const sceneInfos = {
	"sign-in": {
		id: "sign-in",
		removeNewSceneIds: ["sign-in"],
		removeOldScenesIds: ["sign-in"],
		createChildDivIds: ["sign-in"],
		unhideElementsIds: ["sign-in", "app"],
		setEventListenerIds: "sign-in",
		setFocusId: "sign-in",
		tabName: 'signIn',
	},
	"sign-up": {
		id: "sign-up",
		removeNewSceneIds: ["sign-up"],
		removeOldScenesIds: ["sign-up"],
		createChildDivIds: ["sign-up"],
		unhideElementsIds: ["sign-up", "app"],
		setEventListenerIds: "sign-up",
		setFocusId: "sign-up",
		tabName: 'signUp',
	},
	"conversation-list": {
		id: "conversation-list",
		removeNewSceneIds: ["conversation-list"],
		removeOldScenesIds: ["conversation-list", "nav-bar"],
		createChildDivIds: ["conversation-list", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "conversation-list", "app"],
		setEventListenerIds: "conversation-list",
		tabName: 'Home',
	},
	"conversation-display": {
		id: "conversation-display",
		removeNewSceneIds: ["conversation-display"],
		removeOldScenesIds: ["conversation-display", "nav-bar"],
		createChildDivIds: ["conversation-display", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "conversation-display", "app"],
		setEventListenerIds: "conversation-display",
		setFocusId: "conversation-display",
		tabName: 'Home',
	},
	"search": {
		id: "search",
		removeNewSceneIds: ["search"],
		removeOldScenesIds: ["search", "nav-bar"],
		createChildDivIds: ["search", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "search", "app"],
		setEventListenerIds: "search",
		setFocusId: "search",
		tabName: 'Home',
	},
	"profile": {
		id: "profile",
		removeNewSceneIds: ["profile", "match-history"],
		removeOldScenesIds: ["profile", "match-history", "nav-bar"],
		createChildDivIds: ["profile", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "profile", "match-history"],
		tabName: 'Profile',
	},
	"in-game": {
		id: "in-game",
		removeNewSceneIds: ["in-game"],
		removeOldScenesIds: ["in-game", "nav-bar"],
		createChildDivIds: ["in-game", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "in-game", "app"],
		setEventListenerIds: "in-game",
		tabName: 'Game',
	},
	"settings": {
		id: "settings",
		removeNewSceneIds: ["settings"],
		removeOldScenesIds: ["settings", "nav-bar"],
		createChildDivIds: ["settings", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings", "app"],
		tabName: 'Settings',
	},
	"settings-game-theme": {
		id: "settings-game-theme",
		removeNewSceneIds: ["settings-game-theme"],
		removeOldScenesIds: ["settings-game-theme", "nav-bar"],
		createChildDivIds: ["settings-game-theme", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings-game-theme", "app"],
		tabName: 'Settings',
	},
	"settings-profile-picture": {
		id: "settings-profile-picture",
		removeNewSceneIds: ["settings-profile-picture"],
		removeOldScenesIds: ["settings-profile-picture", "nav-bar"],
		createChildDivIds: ["settings-profile-picture", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings-profile-picture", "app"],
		setEventListenerIds: "settings-profile-picture",
		tabName: 'Settings',
	},
	"settings-password": {
		id: "settings-password",
		removeNewSceneIds: ["settings-password"],
		removeOldScenesIds: ["settings-password", "nav-bar"],
		createChildDivIds: ["settings-password", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings-password", "app"],
		setEventListenerIds: "settings-password",
		setFocusId: "settings-password",
		tabName: 'Settings',
	},
	"settings-email": {
		id: "settings-email",
		removeNewSceneIds: ["settings-email"],
		removeOldScenesIds: ["settings-email", "nav-bar"],
		createChildDivIds: ["settings-email", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings-email", "app"],
		setEventListenerIds: "settings-email",
		setFocusId: "settings-email",
		tabName: 'Settings',
	},
	"error": {
		id: "error",
		removeNewSceneIds: ["error"],
		removeOldScenesIds: ["error"],
		createChildDivIds: ["error"],
		unhideElementsIds: ["error"],
		tabName: 'Error',
	}
};

const parentsToHide = [
	"sign-in",
	"sign-up",
	"conversation-list",
	"conversation-display",
	"search",
	"in-game",
	"profile",
	"match-history",
	"settings",
	"settings-game-theme",
	"settings-profile-picture",
	"settings-password",
	"settings-email",
	"nav-bar",
	"home",
	"app"
];

const parentsToremove = [
	"sign-in",
	"sign-up",
	"conversation-list",
	"conversation-display",
	"search",
	"in-game",
	"profile",
	"match-history",
	"settings",
	"settings-game-theme",
	"settings-profile-picture",
	"settings-password",
	"settings-email",
	"nav-bar"
];

const eventsToUnset = [
	"sign-in",
	"sign-up",
	"conversation-list",
	"conversation-display",
	"search",
	"in-game",
	"settings-profile-picture",
	"settings-password",
	"settings-email",
];

async function changeSceneHandler(sceneInfo, username) {
	if (sceneInfo.id == globalVariables.currentScene) {
		removeChildDiv(sceneInfo.removeNewSceneIds);
		hideElements(sceneInfo.id);
	}
	globalVariables.currentScene = sceneInfo.id;
	
	await createChildDiv(sceneInfo.createChildDivIds, username);
	if (sceneInfo.setEventListenerIds) {
		setEventListener(sceneInfo.setEventListenerIds);
	}

	hideElements(...parentsToHide);
	unhideElements(...sceneInfo.unhideElementsIds);
	if (sceneInfo.setFocusId) {
		setFocus(sceneInfo.setFocusId);
	}
	document.title = sceneInfo.tabName;

	unsetEventListener(eventsToUnset, sceneInfo.id);
	const oldScenesToRemove = parentsToremove.filter(parentId => !sceneInfo.removeOldScenesIds.includes(parentId));
	removeChildDiv(oldScenesToRemove);
}

function hideElements(...elementIds) {
	elementIds.forEach(elementId => {
		const element = document.getElementById(elementId);
		if (element) {
			element.classList.add("d-none");
		}
	});
}

async function unhideElements(...elementIds) {
	elementIds.forEach(elementId => {
		var element = document.getElementById(elementId);
		if (element) {
			element.classList.remove("d-none");
		}
	});
}

export { changeScene };