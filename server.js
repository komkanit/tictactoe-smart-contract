const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');
const http = require('http');
const { sha3withsize } = require('solidity-sha3');


const provider = new Web3.providers.HttpProvider("http://localhost:8545")
const web3 = new Web3(provider);
const asciiToHex = Web3.utils.asciiToHex;

const main = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  const code = fs.readFileSync('./TicTacToe.sol').toString();
  const compiledCode = solc.compile(code);
  const byteCode = compiledCode.contracts[':TicTacToe'].bytecode;
  const abiDefinition = JSON.parse(compiledCode.contracts[':TicTacToe'].interface);
  // console.log('abiDefinition', abiDefinition);

  const TicContract = new web3.eth.Contract(abiDefinition,
    {data: byteCode, from: accounts[0], gas: 4700000}
  );
  const commitment = await sha3withsize(1, 8);
  // console.log(commitment);
  const deployedContract = await TicContract.deploy({
    arguments: [accounts[1], 10, commitment]
  }).send()
  const hashData = await deployedContract.methods.checkHash(1).call();
  const joinResponse = await deployedContract.methods.joinGame(2).send({
    from: accounts[1],
    gas: 100000,
  });
  // console.log(joinResponse);
  const startResponse = await deployedContract.methods.startGame(1).call();
  let currentPlayer = await deployedContract.methods.checkCurrentPlayer().call();
  let currentBoard = await deployedContract.methods.checkBoard().call();
  console.log(currentBoard);
  await deployedContract.methods.playMove(2).send({
    from: accounts[currentPlayer],
    gas: 100000,
  });
  currentPlayer = await deployedContract.methods.checkCurrentPlayer().call();
  await deployedContract.methods.playMove(4).send({
    from: accounts[currentPlayer],
    gas: 100000,
  });
  currentBoard = await deployedContract.methods.checkBoard().call();
  console.log(currentBoard);

}

main();
