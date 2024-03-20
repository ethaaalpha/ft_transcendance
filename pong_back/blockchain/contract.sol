// SPDX-License-Identifier: UNLICENSED
pragma solidity >0.5.0;

contract MatchStorage {
	uint8 host;
	uint8 invited;

	constructor(uint8 host_score, uint8 invited_score) {
		host = host_score;
		invited = invited_score;
	}
}