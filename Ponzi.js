/*
Save this file in your node project directory
This script requires nodeJS installed the web3 and ethersjs node packages as well.

https://www.npmjs.com/package/ethers
https://www.npmjs.com/package/web3

So to run enter your private key below and run the script.
npm install web3 ethers
node ponzi.js

it will run the compound every 10 minutes

*/

const Web3 = require("web3")
const ethers = require("ethers");
const { default: BigNumber } = require("bignumber.js");

/// wallet private key...not your address.
// metamask -> account details -> export private key
const privateKeys = [  ]

////// --- DONT TOUCH ANYTHING BELOW THIS LINE ----- ////////

const provider = new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');

const Contracts = {
    SmartMasterChef:"0xa0488f956d7fe05b1798e9faf0ce5f1133d23822"
}

async function claimRewards(key) {
    try {
        const wallet = new ethers.Wallet(key, provider);
        const mcontract = new ethers.Contract(Contracts.SmartMasterChef, [{
                "type": "constructor",
                "stateMutability": "nonpayable",
                "inputs": [{
                    "type": "address",
                    "name": "_smartcoin",
                    "internalType": "contract SmartCoin"
                }, {"type": "address", "name": "_devAddr", "internalType": "address"}, {
                    "type": "address",
                    "name": "_treasuryAddr",
                    "internalType": "address"
                }, {"type": "address", "name": "_investorAddr", "internalType": "address"}, {
                    "type": "uint256",
                    "name": "_joePerSec",
                    "internalType": "uint256"
                }, {"type": "uint256", "name": "_startTimestamp", "internalType": "uint256"}, {
                    "type": "uint256",
                    "name": "_devPercent",
                    "internalType": "uint256"
                }, {"type": "uint256", "name": "_treasuryPercent", "internalType": "uint256"}, {
                    "type": "uint256",
                    "name": "_investorPercent",
                    "internalType": "uint256"
                }]
            }, {
                "type": "event",
                "name": "Deposit",
                "inputs": [{
                    "type": "address",
                    "name": "user",
                    "internalType": "address",
                    "indexed": true
                }, {"type": "uint256", "name": "pid", "internalType": "uint256", "indexed": true}, {
                    "type": "uint256",
                    "name": "amount",
                    "internalType": "uint256",
                    "indexed": false
                }],
                "anonymous": false
            }, {
                "type": "function",
                "stateMutability": "nonpayable",
                "outputs": [],
                "name": "deposit",
                "inputs": [{"type": "uint256", "name": "_pid", "internalType": "uint256"}, {
                    "type": "uint256",
                    "name": "_amount",
                    "internalType": "uint256"
                }]
            }]
            , wallet);
        const result = await mcontract.deposit(0, 0);
        await result.wait(1)
    } catch(error) {
        console.log('Exception',error);
    }
}

async function getBalance(key, tokenAddress) {
    try {
        const abi = [
          {
            name: 'balanceOf',
            type: 'function',
            inputs: [
              {
                name: '_owner',
                type: 'address',
              },
            ],
            outputs: [
              {
                name: 'balance',
                type: 'uint256',
              },
            ],
            constant: true,
            payable: false,
          },
        ];
        const wallet = new ethers.Wallet(key, provider);
        const contract = new ethers.Contract(tokenAddress, abi, provider);
        const balance = await contract.balanceOf(await wallet.getAddress());
        return balance
    } catch(error) {
        console.log('Exception',error);
    }
}

async function swapExactTokensForAVAX  (key, amountIn, to) {
    const wallet = new ethers.Wallet(key, provider);
   const JoeRouter02 = '0x60aE616a2155Ee3d9A68541Ba4544862310933d4';
   const abi = [{
        "inputs": [
        {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
        },
        {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
        },
        {
            "internalType": "address",
            "name": "to",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
        }
        ],
        "name": "swapExactTokensForAVAX",
        "outputs": [
        {
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
        }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }]
    const contract = new ethers.Contract(JoeRouter02, abi, wallet);
    const path = [
        '0xcc2f1d827b18321254223df4e84de399d9ff116c', // smrt contract
        '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7' // wavax contract
    ]
    const deadlineInMs = new Date().getTime() + 672348
    const result = await contract.swapExactTokensForAVAX(amountIn, 0, path, to, deadlineInMs);
    await result.wait(1)
    return result
}


async function addLiquidityAVAX(key, amountTokenDesired, amountAVAX, to) {
    const wallet = new ethers.Wallet(key, provider);
    const JoeRouter02 = '0x60aE616a2155Ee3d9A68541Ba4544862310933d4';
    const abi = [{
        "inputs": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amountTokenDesired",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountTokenMin",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountAVAXMin",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            }
          ],
          "name": "addLiquidityAVAX",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "amountToken",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountAVAX",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
    }]
    const contract = new ethers.Contract(JoeRouter02, abi, wallet);
    const deadlineInMs = new Date().getTime() + 2272348
    const amountTokenMin = amountTokenDesired.sub(ethers.BigNumber.from('25000000000000000000')) // subtract 2 smrt as min
    const token = '0xcc2f1d827b18321254223df4e84de399d9ff116c'
    const amountAVAXMin = amountAVAX.sub(ethers.BigNumber.from('100000000000000000')) // subtract 1 wavax as min
    const result = await contract.addLiquidityAVAX(token, amountTokenDesired, amountTokenMin, amountAVAXMin, to, deadlineInMs, {
        value: amountAVAX
    });
    await result.wait(1)
    return result
}

async function depositLp(key, amount) {
    const wallet = new ethers.Wallet(key, provider);
    const mcontract = new ethers.Contract(Contracts.SmartMasterChef, [{
        "type": "constructor",
        "stateMutability": "nonpayable",
        "inputs": [{
            "type": "address",
            "name": "_smartcoin",
            "internalType": "contract SmartCoin"
        }, { "type": "address", "name": "_devAddr", "internalType": "address" }, {
            "type": "address",
            "name": "_treasuryAddr",
            "internalType": "address"
        }, { "type": "address", "name": "_investorAddr", "internalType": "address" }, {
            "type": "uint256",
            "name": "_joePerSec",
            "internalType": "uint256"
        }, { "type": "uint256", "name": "_startTimestamp", "internalType": "uint256" }, {
            "type": "uint256",
            "name": "_devPercent",
            "internalType": "uint256"
        }, { "type": "uint256", "name": "_treasuryPercent", "internalType": "uint256" }, {
            "type": "uint256",
            "name": "_investorPercent",
            "internalType": "uint256"
        }]
    }, {
        "type": "event",
        "name": "Deposit",
        "inputs": [{
            "type": "address",
            "name": "user",
            "internalType": "address",
            "indexed": true
        }, { "type": "uint256", "name": "pid", "internalType": "uint256", "indexed": true }, {
            "type": "uint256",
            "name": "amount",
            "internalType": "uint256",
            "indexed": false
        }],
        "anonymous": false
    }, {
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [],
        "name": "deposit",
        "inputs": [{ "type": "uint256", "name": "_pid", "internalType": "uint256" }, {
            "type": "uint256",
            "name": "_amount",
            "internalType": "uint256"
        }]
    }]
        , wallet);
    const result = await mcontract.deposit(0, amount);
    await result.wait(1)
    return result
}

async function claimAll() {
    for (let i = 0; i < privateKeys.length; i++) {
        const wallet = new ethers.Wallet(privateKeys[i], provider);
        
        // console.log('Claiming', await wallet.getAddress());
        await claimRewards(privateKeys[i]);

        const smrtAddress = '0xCC2f1d827b18321254223dF4e84dE399D9Ff116c'
        const smrtBalance = await getBalance(privateKeys[i], smrtAddress);
        console.log('SMRT: ', smrtBalance.toString() / 1000000000000000000);

        const avaxBalance = await wallet.getBalance()
        console.log('AVAX: ', avaxBalance.toString() / 1000000000000000000);
        
        const halfToAvax = smrtBalance.div(2)
        await swapExactTokensForAVAX(privateKeys[i], halfToAvax, await wallet.getAddress());

        const avaxBalanceAfter = await wallet.getBalance()
        console.log('AVAX after: ', avaxBalanceAfter.toString() / 1000000000000000000);
        const avaxSwapped = avaxBalanceAfter.sub(avaxBalance)
        console.log('Avax swapped: ', avaxSwapped.toString() / 1000000000000000000);
        
        await addLiquidityAVAX(privateKeys[i], halfToAvax, avaxSwapped, await wallet.getAddress())

        const lpAddr = '0xf070843Ba9ed0ab85B0d15f9E8D67A5A8E073254'
        const lpBalance = await getBalance(privateKeys[i], lpAddr)
        console.log('LP: ', lpBalance.toString() / 1000000000000000000);

        await depositLp(privateKeys[i], lpBalance)

        const lpBalanceAfter = await getBalance(privateKeys[i], lpAddr)
        console.log('LP after: ', lpBalanceAfter.toString() / 1000000000000000000);

        console.log('All done, doing this again in 10 minutes')
        console.log('\n');
    }
}

function init() {

    //// run it when we start up
    claimAll();

    /// then run it every x minutes
    setInterval(function () {
        claimAll();
    }, 10 * 60 * 1000);
}

//// start the script
init();