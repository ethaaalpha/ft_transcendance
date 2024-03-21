pragma solidity ^0.8.0;

contract Scoreboard {
    struct Match {
        uint256 matchId;
        mapping(address => uint256) scores;
        bool isCompleted;
    }

    mapping(uint256 => Match) public matches;
    uint256 public totalMatches;

    event ScoreUpdated(uint256 indexed matchId, address indexed player, uint256 score);
    event MatchCompleted(uint256 indexed matchId);

    function createMatch() public returns (uint256) {
        totalMatches++;
        matches[totalMatches].matchId = totalMatches;
        return totalMatches;
    }

    function setScore(uint256 _matchId, uint256 _score) public {
        require(_matchId <= totalMatches && _matchId > 0, "Invalid matchId");
        require(!matches[_matchId].isCompleted, "Match is completed");
        matches[_matchId].scores[msg.sender] = _score;
        emit ScoreUpdated(_matchId, msg.sender, _score);
    }

    function getScore(uint256 _matchId, address _player) public view returns (uint256) {
        require(_matchId <= totalMatches && _matchId > 0, "Invalid matchId");
        return matches[_matchId].scores[_player];
    }

    function completeMatch(uint256 _matchId) public {
        require(_matchId <= totalMatches && _matchId > 0, "Invalid matchId");
        require(!matches[_matchId].isCompleted, "Match already completed");
        matches[_matchId].isCompleted = true;
        emit MatchCompleted(_matchId);
    }
}