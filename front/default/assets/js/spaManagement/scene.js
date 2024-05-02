import globalVariables from '../init.js';
import { removeChildDiv, createChildDiv } from './div.js';
import { setEventListener } from './setEvent.js';
import { unsetEventListener } from './unsetEvent.js';
import { setFocus } from './setFocus.js';

let sceneChangeLock = false;

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

let sceneQueue = [];

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
		unhideElementsIds: ["sign-in"],
		setEventListenerIds: "sign-in",
		setFocusId: "sign-in"
	},
	"sign-up": {
		id: "sign-up",
		removeNewSceneIds: ["sign-up"],
		removeOldScenesIds: ["sign-up"],
		createChildDivIds: ["sign-up"],
		unhideElementsIds: ["sign-up"],
		setEventListenerIds: "sign-up",
		setFocusId: "sign-up"
	},
	"conversation-list": {
		id: "conversation-list",
		removeNewSceneIds: ["conversation-list"],
		removeOldScenesIds: ["conversation-list", "nav-bar"],
		createChildDivIds: ["conversation-list", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "conversation-list"],
		setEventListenerIds: "conversation-list"
	},
	"conversation-display": {
		id: "conversation-display",
		removeNewSceneIds: ["conversation-display"],
		removeOldScenesIds: ["conversation-display", "nav-bar"],
		createChildDivIds: ["conversation-display", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "conversation-display"],
		setEventListenerIds: "conversation-display",
		setFocusId: "conversation-display"
	},
	"search": {
		id: "search",
		removeNewSceneIds: ["search"],
		removeOldScenesIds: ["search", "nav-bar"],
		createChildDivIds: ["search", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "search"],
		setEventListenerIds: "search",
		setFocusId: "search"
	},
	"profil": {
		id: "profil",
		removeNewSceneIds: ["profil", "match-history"],
		removeOldScenesIds: ["profil", "match-history", "nav-bar"],
		createChildDivIds: ["profil", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "profil", "match-history"],
	},
	"settings": {
		id: "settings",
		removeNewSceneIds: ["settings"],
		removeOldScenesIds: ["settings", "nav-bar"],
		createChildDivIds: ["settings", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings"],
	},
	"settings-game-theme": {
		id: "settings-game-theme",
		removeNewSceneIds: ["settings-game-theme"],
		removeOldScenesIds: ["settings-game-theme", "nav-bar"],
		createChildDivIds: ["settings-game-theme", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings-game-theme"],
	},
	"settings-profil-picture": {
		id: "settings-profil-picture",
		removeNewSceneIds: ["settings-profil-picture"],
		removeOldScenesIds: ["settings-profil-picture", "nav-bar"],
		createChildDivIds: ["settings-profil-picture", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings-profil-picture"],
		setEventListenerIds: "settings-profil-picture",
	},
	"settings-password": {
		id: "settings-password",
		removeNewSceneIds: ["settings-password"],
		removeOldScenesIds: ["settings-password", "nav-bar"],
		createChildDivIds: ["settings-password", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings-password"],
		setEventListenerIds: "settings-password",
		setFocusId: "settings-password"
	},
	"settings-email": {
		id: "settings-email",
		removeNewSceneIds: ["settings-email"],
		removeOldScenesIds: ["settings-email", "nav-bar"],
		createChildDivIds: ["settings-email", "nav-bar"],
		unhideElementsIds: ["home", "nav-bar", "settings-email"],
		setEventListenerIds: "settings-email",
		setFocusId: "settings-email"
	}
};

const parentsToHide = [
	"sign-in",
	"sign-up",
	"conversation-list",
	"conversation-display",
	"search",
	"profil",
	"match-history",
	"settings",
	"settings-game-theme",
	"settings-profil-picture",
	"settings-password",
	"settings-email",
	"nav-bar",
	"home",
];

const parentsToremove = [
	"sign-in",
	"sign-up",
	"conversation-list",
	"conversation-display",
	"search",
	"profil",
	"match-history",
	"settings",
	"settings-game-theme",
	"settings-profil-picture",
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
	"settings-profil-picture",
	"settings-password",
	"settings-email",
];

async function changeSceneHandler(sceneInfo, username) {
	
	// CLEAN NEW SCENE | IF SAME SCENE
	if (sceneInfo.id == globalVariables.currentScene) {
		removeChildDiv(sceneInfo.removeNewSceneIds);
		hideElements(sceneInfo.id);
	}
	globalVariables.currentScene = sceneInfo.id;
	
	// CREATE NEW SCENE
	await createChildDiv(sceneInfo.createChildDivIds, username);
	if (sceneInfo.setEventListenerIds) {
		setEventListener(sceneInfo.setEventListenerIds);
	}

	// TRANSITION TO NEW SCENE
	hideElements(...parentsToHide);
	unhideElements(...sceneInfo.unhideElementsIds);
	if (sceneInfo.setFocusId) {
		setFocus(sceneInfo.setFocusId);
	}

	// CLEAN OLD SCENES
	unsetEventListener(eventsToUnset, sceneInfo.id);
	const oldScenesToRemove = parentsToremove.filter(parentId => !sceneInfo.removeOldScenesIds.includes(parentId));
	removeChildDiv(oldScenesToRemove);
}

// Utils
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
