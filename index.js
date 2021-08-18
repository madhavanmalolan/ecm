const Web3 = require('web3');
const dotenv = require('dotenv');
const fs = require('fs/promises');
const webpush = require('web-push');
const { JSEncrypt } = require('js-encrypt');
dotenv.config();

const web3 = new Web3(process.env.RPC_ENDPOINT);
const contract = new web3.eth.Contract(
	[
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "server",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "encryptedPushToken",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "data",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "image",
					"type": "string"
				}
			],
			"name": "NewNotification",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "server",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "price",
					"type": "uint256"
				}
			],
			"name": "NewServer",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "server",
					"type": "address"
				}
			],
			"name": "getServerPrice",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "server",
					"type": "address"
				}
			],
			"name": "getServerPublicKey",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "server",
					"type": "address"
				}
			],
			"name": "getServerVapidKey",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "user",
					"type": "address"
				}
			],
			"name": "getUserPrice",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "user",
					"type": "address"
				}
			],
			"name": "getUserRegistrationServer",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "user",
					"type": "address"
				}
			],
			"name": "isUserRegistered",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "publicKey",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "vapidKey",
					"type": "string"
				}
			],
			"name": "registerServer",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "server",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "encryptedPushToken",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "metadata",
					"type": "string"
				}
			],
			"name": "registerUser",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "user",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "data",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "image",
					"type": "string"
				}
			],
			"name": "sendNotification",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		}
	]
  , process.env.CONTRACT_ADDRESS); 


async function init() {
	const PUBLIC_KEY = await fs.readFile("./id_rsa.pub");
	const PRIVATE_KEY = await fs.readFile("./id_rsa");
	
	console.log(PUBLIC_KEY.toString());
	const decrypt = new JSEncrypt();
	decrypt.setPrivateKey(PRIVATE_KEY.toString());
	
	contract.events.NewNotification(async (err, event) => {
	  console.log("New Notification", JSON.stringify(event));
	  if(event.returnValues.server === process.env.ETH_ADDRESS){
		  console.log("MY Notification");
		  console.log(PRIVATE_KEY);
		  console.log(event.returnValues.encryptedPushToken);
		  const pushToken = decrypt.decrypt(event.returnValues.encryptedPushToken);
		  console.log(pushToken);
		  webpush.setVapidDetails("mailto:madhavan@creatoros.co", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
		  webpush.sendNotification(JSON.parse(pushToken), JSON.stringify({title: event.returnValues.title, data: event.returnValues.data, image: event.returnValues.image }));
	  }
	
	});
	contract.events.NewServer(async (err, event) => {
	  console.log("New Server", JSON.stringify(event));
	});
	
	
}

init();