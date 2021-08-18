# Ethereum Cloud Messaging Node
ECM Nodes can earn by being a relayer of notifications
As seen on the the [ecmnetwork homepage](https://madhavanmalolan.github.io/ecm.js)

## 1. Git Clone

```
  git clone https://github.com/madhavanmalolan/ecm.git
```

## 2. Install

```
  cd ecm && npm install 
```
## 3. Generate rsa keys
These keys that users who are registered with you will use to encrypt their push notification tokens to send to you.
```
  $ openssl genrsa -out id_rsa 8192
  $ openssl rsa -pubout -in id_rsa -out id_rsa.pub
```

### 4. Generate VAPID keys
VAPID keys are used to send the notifications to browsers.
```
  $ node vapid_keys.js 
```

### 5. Populate .env

```
    RPC_ENDPOINT=wss://ropsten.infura.io/ws/v3/YOUR_INFURA_TOKEN
    CONTRACT_ADDRESS=0x2efF4A6d1C101D0C4c33e13FC21De523bAfDA5b3
    VAPID_PUBLIC_KEY= ENTER VAPID PUBLIC KEY HERE
    VAPID_PRIVATE_KEY=ENTER VAPID PRIVATE KEY HERE
    ETH_ADDRESS= YOUR ETHEREUM ADDRESS
    ETH_PRIVATEKEY= YOUR ETHEREUM PRIVATE KEY
```

### 6. Start and keep service running
You must run the server continuously, frequent challenges will be issued to check validity of the node.
```
  screen -d -m node index.js  
```

### 7. Register your service provider
Follow [this link to register](https://ethcontract.app/0x2efF4A6d1C101D0C4c33e13FC21De523bAfDA5b3/registerServer?abi=f22f4eba0d5b432754ce36650314790d). Remember to use Ropsten.
Set payable value to be the number of wei a developer should pay to send a notification to a user registered to your server.
###8. Ask Supporters to use your eth address in the ECM instance on their websites
When notifications are sent to the users on your server, you earn ETH

```
  const ecm = new ECM();
  ecm.register("YOUR ADDRESS HERE", true);  
```

------------------------
You can donate to `madhavanmalolan.eth` to support this project


