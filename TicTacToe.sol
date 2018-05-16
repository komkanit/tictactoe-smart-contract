pragma solidity ^0.4.18;

contract TicTacToe {
    address[2] _playerAddress;
    uint32 _turnLength;

    bytes32 _p1Commitment;
    uint8 _p2Nounce;

    uint8[9] _board;
    uint8 _currentPlayer;
    uint256 _turnDeadLine;

    function TicTacToe (address opponent, uint32 turnLength, bytes32 p1Commitment)
    public {
        _playerAddress[0] = msg.sender;
        _playerAddress[1] = opponent;
        _turnLength = turnLength;
        _p1Commitment = p1Commitment;
    }
    function checkCurrentPlayer() view public returns (uint8) {
        return _currentPlayer;
    }
    function checkBoard() view public returns (uint8[9]) {
        return _board;
    }
    function checkHash(uint8 data) view public returns (bytes32) {
        return keccak256(data);
    }
    function checkBalance() view public returns (uint256) {
        return address(this).balance;
    }
    function checkBalanceUser(uint8 u) view public returns (uint256) {
        return _playerAddress[u].balance;
    }
    function joinGame(uint8 p2Nounce)
    public payable returns (bool success) {
        require(msg.sender == _playerAddress[1]);
        require(msg.value >= address(this).balance);
        _p2Nounce = p2Nounce;
        return true;
    }
    function startGame(uint8 p1Nounce)
    public {
        require(keccak256(p1Nounce) == _p1Commitment);
        _currentPlayer = (p1Nounce ^ _p2Nounce) & 0x01;
        _turnDeadLine = block.number + _turnLength;
    }
    function playMove(uint8 squareToPlay)
    public returns (uint8) {
        require(msg.sender == _playerAddress[_currentPlayer]);
        require(squareToPlay >= 0 && squareToPlay <= 8);
        _board[squareToPlay] = _currentPlayer + 1;
        _currentPlayer ^= 0x1;
        return _currentPlayer;
    }
}