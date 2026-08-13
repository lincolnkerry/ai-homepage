---
title: "Simple WorldLand Private Network Guide"
date: "2025-04-15"
author: "seungminkim"
category: "web3"
summary: "🌐 Overview This post explains the quick setup guide for the class on April 16. The detailed content can be found in the WorldLand Private Network Programming . 📦 Private Network Se…"
source: "heungno.net WordPress archive"
---

## 🌐 Overview

This post explains the quick setup guide for the class on April 16.

The detailed content can be found in the [WorldLand Private Network Programming](https://heungno.net/?p=29567).

### 📦 Private Network Setup and Environment Guide for WorldLand

The goal of this course is to provide hands-on experience in building a blockchain network from scratch, enabling the setup of a private WorldLand network.

---

### 📶 0. Connect to Class Router

Since GIST internal network does not support port forwarding, connect all student nodes to the provided router:

* **Network Name**: `BCAI`
* **Password**: `compress`

📌 Once connected, note your **local IP address** using `ipconfig` or `ifconfig`.

---

### 🚀 Quickstart: Run WorldLand with Docker (Recommended)

Docker is a platform that allows you to run applications in containers, providing a consistent environment across different operating systems.

#### ✅ Install Docker

##### Windows

* Download: <https://www.docker.com/products/docker-desktop>
* Install, reboot, and run Docker Desktop (🐳 icon appears in system tray)

##### macOS

* Download and install Docker from: <https://www.docker.com/products/docker-desktop>
* Launch Docker.app (🐳 icon in menu bar)

##### Linux

```
curl -fsSL https://get.docker.com | sh
```

---

#### ✅ Run WorldLand Client using Docker

```
#window
docker run -it --name worldland-bcai -p 8545:8545 -p 30303:30303 infonetlab/worldland_bcai

#mac
docker run -it --platform linux/amd64 --name worldland-bcai -p 8545:8545 -p 30303:30303 infonetlab/worldland_bcai
```

This command launches the client and drops you into the interactive Worldland console. No installation required.

This command launches the client and drops you into the interactive

---

✅ WorldLand is now up and running. You’re connected to your own private blockchain network!

## 🧩 Using the WorldLand Client

### 👥 Add and Manage Peers

In public blockchain networks, peers are discovered automatically. However, in private networks, **you must manually add peers** using their enode addresses.

1. Get your own enode address:

```
admin.nodeInfo.enode
```

2. Check your local IP using `ipconfig` (Windows) or `ifconfig` (macOS/Linux)
3. Share your enode via:  
   [WorldLand Enode Sharing Sheet](https://docs.google.com/spreadsheets/d/1JHNnxN6r3qAk5wq-b9e_KKAMsO_Cr2yW_lDc8FIn5TA/edit?usp=sharing)
4. Add peers manually:

```
admin.addPeer("enode://...")
admin.peers
```

If a peer shows up in `admin.peers`, connection was successful.

---

### 👛 Create Account and Start Mining

#### 🔐 Create a new account

```
personal.newAccount("your_password")
```

#### 🔨 Start mining

```
miner.setEtherbase(eth.accounts[0])  // set the mining reward address
miner.start(1)                        // start mining with 1 thread
```

You should see logs showing block generation:

```
INFO [..] 🔨 mined potential block number=1
```

#### 🛑 Stop mining

```
miner.stop()
```

#### 🧮 Check balance again

```
eth.getBalance(eth.accounts[0])
```

---

### 🔁 Send Transactions

#### 1. Unlock sender account

```
personal.unlockAccount(eth.accounts[0], "your_password", 300)
```

#### 2. Send 1 WLC to another account

```
eth.sendTransaction({
  from: eth.accounts[0],
  to: "0xReceiverAddress",
  value: web3.toWei(1, "wlc")
})
```

---

### 🔍 Inspect Blocks and Transactions

#### 🔎 View blocks

```
eth.blockNumber                   // current block
eth.getBlock("latest")           // latest block
eth.getBlock(0)                  // genesis block
```

#### 🔎 View transaction

```
eth.getTransaction("0x...txHash")
```

#### 📡 Check node status

```
eth.syncing                      // false if synced
miner.hashrate                   // current mining speed
```

---

### 🌐 Use Block Explorer (Optional)

You can use a local block explorer to view transactions and blocks via UI:

```
git clone https://github.com/smin-k/explorer
cd explorer
npm install
npm start
```

Visit <http://127.0.0.1:8000> in your browser.

---

✅ You’re now connected, mining, and able to send transactions in your private WorldLand network!

## 🔗 Connect MetaMask to WorldLand

MetaMask is a browser extension that acts as a crypto wallet and allows you to interact with blockchain networks such as Ethereum and WorldLand.

### 1. Install MetaMask

* Go to the [Chrome Web Store](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
* Install the extension
* Click the 🧩 icon in your browser to open MetaMask

### 2. Create a Wallet

* Click **Create Wallet**, set your password
* Backup your **12-word Secret Recovery Phrase** safely

### 3. Add WorldLand Private Network to MetaMask

* Click **Network dropdown → Add Network**
* Enter the following:

| Field | Value |
| --- | --- |
| Network Name | WorldLand-BCAI |
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 250407 |
| Currency Symbol | WLC |

✅ You are now connected to the private WorldLand blockchain!

---

### 🔁 Importing Accounts Between MetaMask and WorldLand

#### ▶️ From WorldLand → MetaMask

Unfortunately, Geth (used in the WorldLand client) does **not support direct private key export** via the console.

Instead, follow these steps to import your account using the keystore file:

##### 🐳 If you are using Docker:

1. Locate the keystore file for your mined account:

* Inside the container: `/workspace/BCAInetwork/keystore/`
* To copy it to your host:

```
docker cp worldland-bcai:/workspace/BCAInetwork/keystore ./keystore
```

1. Open MetaMask → Account Menu → **Import Account**
2. Choose **JSON File** as the import method
3. Upload the keystore file and enter your account password

##### 💻 If you are running WorldLand natively (not in Docker):

1. Your keystore file is usually located at:

```
./BCAInetwork/keystore
```

2. Navigate to this folder and find a file named like:  
   `UTC--...--<your_address>.json`
3. In MetaMask:

* Go to Account Menu → **Import Account**
* Select **JSON File**, upload the keystore, and enter your password

✅ Your mined WorldLand account is now available in MetaMask 🎉

#### ◀️ From MetaMask → WorldLand

1. In MetaMask → Account Menu → **Account Details**
2. Click **Export Private Key**, enter password
3. In WorldLand console:

```
web3.personal.importRawKey("PRIVATE_KEY", "METAMASK_PASSWORD")
eth.accounts
```

✅ You can now use your MetaMask wallet inside WorldLand

---

🎉 You’ve now completed account setup, peer connection, mining, and wallet integration!

## 🧠 Quiz Time: Try It Yourself

### 🧩 Problem 1: Which Block Includes Your Transaction?

You just sent a transaction using the console.

👉 Find out which block your transaction was included in. Use only the transaction hash to trace the block number and inspect that block.

---

### 🧩 Problem 2: Who Mined the Last Block?

Inspect the most recently mined block.

👉 Identify the miner address and count how many transactions were included.

---
