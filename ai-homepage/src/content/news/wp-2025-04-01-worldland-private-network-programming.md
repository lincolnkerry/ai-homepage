---
title: "WorldLand Private Network Programming"
date: "2025-04-01"
author: "seungminkim"
category: "web3"
summary: "🌐 Overview 📦 Private Network Setup and Environment Guide for WorldLand The goal of this course is to provide hands-on experience in building a blockchain network from scratch, enab…"
source: "heungno.net WordPress archive"
---

## 🌐 Overview

### 📦 Private Network Setup and Environment Guide for WorldLand

The goal of this course is to provide hands-on experience in building a blockchain network from scratch, enabling the setup of a private WorldLand network.

WorldLand is a blockchain client based on the Ethereum Virtual Machine (EVM), designed to test a novel Proof-of-Work algorithm called **ECCPoW**. It enables users to experiment with private blockchain environments optimized for learning and research.

### 🔍 What is ECCPoW?

ECCPoW views the block header as a message distorted by transmission and uses **LDPC decoding** to find a valid solution (codeword) through puzzle-solving.

* Official Website: <https://worldland.foundation>
* Main Client Repository: <https://github.com/cryptoecc/WorldLand>
* WIP (ECCPoW Spec): [WIP-2 ECCPoW](https://github.com/cryptoecc/WIPs/blob/main/WIPs/wip-2.md)

In this course, we use a modified version of the client tailored for private class-based networks:

* WorldLand BCAI (Private Client): <https://github.com/smin-k/WorldLand_BCAI>

---

## 🌍 WorldLand Client & Private Network Setup

### What is the WorldLand Client?

The WorldLand client is a program that allows individual users or machines to join the WorldLand blockchain network. When executed, it connects to the network as a WorldLand node.

* To connect to the **mainnet**, use: <https://github.com/cryptoecc/WorldLand>
* For **private testing** (as used in this course), use: <https://github.com/smin-k/WorldLand_BCAI>

---

## 🔒 Private Network Setup

Unlike a public mainnet, a private blockchain restricts participation to authorized users only. In this course, we will create a private WorldLand network, accessible only within the local classroom environment.

### 🔑 Genesis Block

* The genesis block defines the starting state and protocol of the blockchain.
* Once created, it **cannot be modified**.
* Changing the genesis protocol later causes a hard fork.
* The genesis configuration must be shared and used identically by **all nodes**.

📄 Sample: `BCAIgensis.json`

```
{
  "config": {
    "chainId": 331,
    "homesteadBlock": 0,
    "daoForkBlock": null,
    "daoForkSupport": true,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "worldlandBlock": 0,
    "seoulBlock": 0,
    "annapurnaBlock": 0,
    "bcaiBlock": 0,
    "eccpow": {}
  },
  "difficulty": "1023",
  "gasLimit": "2100000",
  "alloc": {}
}
```

### ✍️ Genesis Modifications (Optional)

* **Block Time**: How often new blocks are created.
* **Block Reward**: Amount of WLC rewarded to miners.
* **Chain ID**: Prevents replay attacks between networks.

---

### 🌐 1. Firewall Configuration

#### Linux

```
sudo ufw allow 30303/tcp
sudo ufw allow 30303/udp
sudo ufw allow 8545/tcp
sudo ufw allow 8545/udp
sudo ufw reload
sudo ufw status
```

#### Windows (PowerShell as Admin)

```
New-NetFirewallRule -DisplayName "Open 30303 TCP" -Direction Inbound -LocalPort 30303 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Open 30303 UDP" -Direction Inbound -LocalPort 30303 -Protocol UDP -Action Allow
New-NetFirewallRule -DisplayName "Open 8545 TCP" -Direction Inbound -LocalPort 8545 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Open 8545 UDP" -Direction Inbound -LocalPort 8545 -Protocol UDP -Action Allow
```

#### macOS

Edit firewall config:

```
sudo nano /etc/pf.conf
```

Add:

```
pass in proto tcp from any to any port 30303
pass in proto udp from any to any port 30303
pass in proto tcp from any to any port 8545
pass in proto udp from any to any port 8545
```

Then apply:

```
sudo pfctl -f /etc/pf.conf
sudo pfctl -e
```

---

### 📶 2. Connect to Class Router

Since GIST internal network does not support port forwarding, connect all student nodes to the provided router:

* **Network Name**: `BCAI`
* **Password**: `compress`

📌 Once connected, note your **local IP address** using `ipconfig` or `ifconfig`.

---

### 🚀 3. Quickstart: Run WorldLand with Docker (Recommended)

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
docker run -it --name worldland-bcai -p 8545:8545 -p 30303:30303 infonetlab/worldland_bcai

#mac
docker run -it --platform linux/amd64 --name worldland-bcai -p 8545:8545 -p 30303:30303 infonetlab/worldland_bcai
```

This command launches the client and drops you into the interactive Worldland console. No installation required.

This command launches the client and drops you into the interactive

**Useful Docker Commands**

These commands can help you manage your WorldLand container environment more easily:

```
# Stop the container
docker stop worldland-bcai

# Remove the container
docker rm worldland-bcai

# Copy keystore to host
docker cp worldland-bcai:/workspace/BCAInetwork/keystore ./keystore

# List running containers
docker ps

# Clean up exited containers
docker container prune
```

---

### 🛠️ 4. (Alternative) Build from Source

Use this if Docker is not available.

#### Linux

```
sudo apt update && sudo apt upgrade
sudo apt install gcc make snapd
sudo snap install go --classic
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
git clone https://github.com/smin-k/WorldLand_BCAI
```

#### macOS

```
brew update && brew upgrade
brew install gcc make snap go node
git clone https://github.com/smin-k/WorldLand_BCAI
```

#### Windows (PowerShell as Admin)

```
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Then:

```
choco install git golang mingw nodejs
git clone https://github.com/smin-k/WorldLand_BCAI
cd WorldLand_BCAI
go get -u -v golang.org/x/net/context
go install -v ./cmd/...
```

If you see "dubious ownership" error:

```
git config --global --add safe.directory "YOUR_PROJECT_PATH"
go mod tidy
```

---

### ⚙️ 5. Initialize with Genesis File

#### Linux/macOS

```
cd WorldLand_BCAI
./build/bin/worldland --datadir BCAInetwork init BCAIgensis.json
```

#### Windows

```
cd WorldLand_BCAI
worldland --datadir BCAInetwork init BCAIgensis.json
```

---

### ▶️ 6. Start WorldLand Node

#### Linux/macOS

```
./build/bin/worldland --networkid 250407 --datadir BCAInetwork --port 30303 --http --http.addr 0.0.0.0 --http.vhosts "*" --http.corsdomain "*" --http.api "eth,net,web3" --nodiscover --verbosity 3 --allow-insecure-unlock console
```

#### Windows

```
worldland --networkid 250407 --datadir BCAInetwork -port 30303 --http --http.addr 0.0.0.0 --http.vhosts "*" --http.corsdomain "*" --http.api "eth,net,web3" --nodiscover --verbosity 3 --allow-insecure-unlock console
```

---

✅ WorldLand is now up and running. You’re connected to your own private blockchain network!

## 🧩 Using the WorldLand Client

### 👥 Add and Manage Peers

In public blockchain networks, peers are discovered automatically. However, in private networks, **you must manually add peers** using their enode addresses.

1. Get your own enode address:

```
admin.nodeInfo.enode
```

2. Share your enode via:  
   [WorldLand Enode Sharing Sheet](https://docs.google.com/spreadsheets/d/1JHNnxN6r3qAk5wq-b9e_KKAMsO_Cr2yW_lDc8FIn5TA/edit?usp=sharing)
3. Check your local IP using `ipconfig` (Windows) or `ifconfig` (macOS/Linux)
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

Check your account:

```
eth.accounts
```

#### 💰 Check balance

```
eth.getBalance(eth.accounts[0])
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
web3.fromWei(eth.getBalance(eth.accounts[0]), "ether")
```

---

### 🔁 Send Transactions

#### 1. Unlock sender account

```
personal.unlockAccount("0xSenderAddress", "password", 300)
```

#### 2. Send 1 WLC to another account

```
eth.sendTransaction({
  from: "0xSenderAddress",
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
