---
title: "Worldland Programming- Smart Contract"
date: "2025-04-23"
author: "seungminkim"
category: "web3"
summary: "💡 What is a Smart Contract? What kind of content can be written on a distributed ledger? If you write something like \"A sends 10,000 won to B,\" it serves as a transaction record . …"
source: "heungno.net WordPress archive"
---

---

### 💡 What is a Smart Contract?

**What kind of content can be written on a distributed ledger?**

* If you write something like "A sends 10,000 won to B," it serves as a **transaction record**.
* If you write a program that performs a specific function, it serves as a **smart contract**.

Smart contracts are **self-executing programs** stored on a blockchain. When specific conditions are met, the contract runs automatically without the need for intermediaries. This enables trustless agreements between parties.

---

### 📄 Example of a Smart Contract

* A contract stating: "If A sends 10,000 won to B, then B must transfer 5,000 won to C."
* This logic can be written in a programming language like Solidity and deployed on a blockchain.
* Once uploaded to the blockchain, the content **cannot be tampered with** and is **publicly visible**.
* The **contract terms are transparently disclosed** and **guaranteed to be executed as written**.
* This allows enforcement of contracts even with **untrustworthy parties**, as the code handles the execution.

---

### 💰 What is a Token?

* A **token** is a digital asset implemented through a smart contract.
* Most blockchains have a **native coin** (e.g., ETH for Ethereum) used for gas fees and basic transactions.
* A token is **another type of cryptocurrency**, created and managed by smart contracts on top of a blockchain.
* **Utility tokens** grant access to certain dApps or features.
* **Governance tokens** represent voting rights or ownership in a project.
* Token standards include: **ERC-20**, **ERC-721**, **ERC-1155**.
* The terms **"coin"** and **"token"** are often used interchangeably, though technically different.
* There are **hundreds of tokens** in circulation, each with unique use cases.

---

### 🔄 Fungible Token vs. Non-Fungible Token (NFT)

![](https://heungno.net/wp-content/uploads/2025/04/image-12-1024x424.png)

#### 🔹 Fungible Token

* Tokens are **interchangeable** and have **equal value**.
* Commonly used as **currency** (e.g., DAI, USDT).
* Core functions include: `transfer`, `balanceOf`, `mint`, `burn`.
* Standard: **ERC-20**.

#### 🔸 Non-Fungible Token (NFT)

* Each token has a **unique ID** and **cannot be exchanged 1:1**.
* Used for **digital collectibles**, **art**, **game items**, **certifications**, etc.
* Core functions include: `tokenId`, `ownerOf`, `transfer`, `mint`, `burn`.
* Standards: **ERC-721**, \*\*ERC-1155`.

#### Example of a Smart Contract

* A contract stating: "If A sends 10,000 won to B, then B must transfer 5,000 won to C."
* This contract can be written in a programming language and executed on the blockchain.
* Once uploaded to the blockchain, the content **cannot be tampered with** and is **publicly visible**.
* The **contract terms are transparently disclosed** and **guaranteed to be executed as written**.
* This allows enforcement of contracts even with **untrustworthy parties**.

---

## 🧪 Smart Contract Practice (1)

### 🎯 Goal: Create and deploy an ERC-20 token on a testnet

### 🛠️ Preparation

1. **Use the Chrome browser** with a stable internet connection  
   → Chrome is recommended for best compatibility with MetaMask.
2. **Install the MetaMask extension**  
   🔗 <https://metamask.io/>  
   → MetaMask is a crypto wallet used to interact with the EVM blockchain.
3. **Create or import a MetaMask wallet**
   * If you're creating a new one, **back up your Secret Recovery Phrase safely**.
   * ⚠️ **Never share your recovery phrase** with anyone – it grants full access to your wallet.
4. **MetaMask Settings:**
   * Visit **<https://worldland.foundation>**
   * Click on **“Wallet Connect”**
   * Select **“MetaMask”**
   * Approve the connection request in your MetaMask extension
   * MetaMask will automatically switch or add the **WorldLand Mainnet** network.
5. **Collect wallet addresses**  
   → Submit your testnet wallet address using this form:  
   🔗<https://docs.google.com/spreadsheets/d/1vUjBWYotwlHhyA4uc8uX1LvEZeKX7RkAyjJT3E8N81c/edit?usp=sharing>

![](https://heungno.net/wp-content/uploads/2025/04/image-34-1024x142.png)
![](https://heungno.net/wp-content/uploads/2025/04/image-37-1024x390.png)

### 🛠️ Practice 0: Setting Up Development Environment

#### 💻 Remix IDE

* **Web-based GUI IDE**: <https://remix.ethereum.org/>
* No installation needed — just open in browser
* **Best for beginners** and quick smart contract testing
* Supports Solidity editing, compiling, deploying, and debugging all in one place

#### 🧰 Truffle

* **Node.js-based development framework**: <https://trufflesuite.com/docs/truffle/>
* Ideal for more **complex or production-level projects**
* Offers built-in testing (Mocha/Chai), migration scripts, and network configuration
* Often used with **Ganache** for local blockchain testing

#### ⚙️ Hardhat

* Also a **Node.js-based framework**, but offers **faster setup** and better plugin system
* Easier to customize and integrate with other tools
* Preferred for projects with **TypeScript support** or **advanced debugging**
* Docs: <https://hardhat.org/docs>

### 🔍 Exploring the Remix IDE

In this guide, **we will be using [Remix IDE](https://remix.ethereum.org/)** as our development environment.

* Visit: <https://remix.ethereum.org/>

![](https://heungno.net/wp-content/uploads/2025/04/image-14-1024x551.png)

---

### 🔮 Practice 1: ERC-20 Token

#### 📜 Overview

In this practice, we will create and deploy a custom ERC-20 token using Remix.  
Here's what you'll do:

* ✅ **Review** the official ERC-20 source code
* ✅ **Learn** basic Solidity syntax
* ✅ **Understand** the core ERC-20 functions (`transfer`, `approve`, etc.)
* ✅ **Write, compile, and deploy** your own ERC-20 token contract
* ✅ **Add features**, such as owner-only minting
* ✅ **Deploy** the token to the **WorldLand Mainnet** (not Sepolia)

> 📌 **Note:** This guide uses the **WorldLand Mainnet**, not a testnet like Sepolia.

#### 📂 Load ERC-20 Source Code in Remix

We'll use **OpenZeppelin**, a popular library of secure smart contract components, to create our ERC-20 token.

To begin, you need to load the required OpenZeppelin contracts in Remix:

Paste these GitHub URLs into **separate files** within Remix:

* `ERC20.sol`:  
  <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol>
* `IERC20.sol`:  
  <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol>
* `IERC20Metadata.sol`:  
  <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/IERC20Metadata.sol>
* `Context.sol`:  
  <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol>
* `IERC6093.sol`:  
  <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/interfaces/draft-IERC6093.sol>

> 💡 Tip: You can also copy the raw content from GitHub and paste it directly into new files in the Remix file explorer.

---

### 📄 Solidity Syntax

#### **Basic Solidity Syntax** (Solidity version, import, contract declaration)

![](https://heungno.net/wp-content/uploads/2025/04/image-15-1024x462.png)

**`pragma solidity ^0.8.20;`**  
Specifies the minimum compiler version required. The `^` means the code is compatible with version 0.8.20 and above (excluding 0.9.0+).

**`import { ... } from "..."`**  
Imports external contract interfaces and modules. In this case, we're using interfaces like `IERC20` and `Context` from the OpenZeppelin library — a widely used collection of secure smart contract building blocks.

**`contract ERC20 is ... {`**  
Declares a contract named `ERC20` and lists the other contracts or interfaces it inherits from. This enables **code reuse** and gives the contract access to essential ERC-20 functions.

**`abstract` keyword**  
Indicates that this contract is **not complete on its own**. It's designed to be inherited and extended by other contracts (e.g., `MyERC20`), and cannot be deployed as-is.

#### **Variable Declaration**

![](https://heungno.net/wp-content/uploads/2025/04/image-16-1024x331.png)

`mapping(address => uint256) private _balances;`  
Defines a mapping that links each address to its token balance.  
Used to track who owns how much.

`mapping(address => mapping(address => uint256)) private _allowances;`  
Nested mapping that manages how much a spender is allowed to use on behalf of the owner (via `approve` and `transferFrom`).

`uint256 private _totalSupply;`  
Stores the total amount of tokens that have been minted.

`string private _name;`, `string private _symbol;`  
Holds the token's name and symbol as strings. These are part of the ERC-20 metadata.

**Types**: `uint256`, `string`, `address`, `mapping`  
→ These define what kind of data the contract stores.

**Visibility**: `private`, `public`  
→ Controls where the variable can be accessed. `private` is for internal use only.

#### **Function Definition**

![](https://heungno.net/wp-content/uploads/2025/04/image-18-1024x574.png)

`constructor(...)`  
The constructor is a special function that runs once during deployment.  
It has no return type and is used to initialize contract variables.

`function name()`  
Specifies the function's name. Each function must have a unique name within the contract.

`public`, `internal`  
Visibility modifiers define where the function can be accessed.

* `public`: accessible from inside and outside the contract
* `internal`: accessible only within this contract or its derived contracts

`view`, `pure`  
State mutability modifiers specify how the function interacts with blockchain data.

* `view`: reads from state but doesn’t write
* `pure`: doesn’t read or write state — used for pure calculations

`returns (...)`  
Defines the function’s return type. Solidity functions must explicitly declare the type of data they return.

`virtual`  
Marks the function as overrideable. Contracts that inherit this one can provide their own implementation.

---

### 📊 ERC-20 Token Key Features

**Token Info**

![](https://heungno.net/wp-content/uploads/2025/04/image-19.png)

`name()`  
Returns the **full name** of the token (e.g., “MyToken”).  
Used by wallets and explorers to display the token.

`symbol()`  
Returns the **short ticker symbol** of the token (e.g., “MTK”).  
Similar to a stock ticker like “AAPL”.

`decimals()`  
Returns the **number of decimal places** the token uses.  
A value of `18` means 1 token = 10¹⁸ units. This is the same as Ether and is standard.

`totalSupply()`  
Returns the **total number of tokens in circulation**.  
Updated when tokens are minted or burned.

**Functions**

![](https://heungno.net/wp-content/uploads/2025/04/image-20-1024x287.png)

`balanceOf(address account)`  
Returns the **current token balance** of a given address.  
Useful for dApps and wallets to display user balances.

`transfer(address to, uint256 value)`  
Sends tokens **directly from the caller’s address** to another address.

* Caller must have enough balance.
* Returns `true` on success.

![](https://heungno.net/wp-content/uploads/2025/04/image-38-1024x329.png)

`approve(address spender, uint256 value)`  
Authorizes another address (`spender`) to **spend up to `value` tokens** on behalf of the caller.

* Does **not** transfer tokens immediately — just sets permission.
* Required for `transferFrom`.

`transferFrom(address from, address to, uint256 value)`  
Allows a spender (usually a smart contract) to **transfer tokens from someone else’s account**, if previously approved.

* Commonly used in DeFi, games, and marketplaces.
* Reduces the approved allowance as the transfer happens.

---

### 📃 Writing MyERC20.sol

We’ve looked at the key features and functions of ERC-20. Now, it’s time to build your own token.

![](https://heungno.net/wp-content/uploads/2025/04/image-22-1024x408.png)

#### ⚠️ Why You Can’t Deploy OpenZeppelin’s `ERC20` Directly

* The `ERC20` contract is marked as **`abstract`**, meaning it’s not complete on its own.
* It does **not include token creation logic**, like minting tokens in the constructor.
* Abstract contracts serve as **templates** that must be extended.

📌 If you try to compile and deploy `ERC20.sol` directly, Remix will show an alert like the one above.

#### ✅ What to Do Next

* Create a new file named **`MyERC20.sol`** in your Remix workspace.
* This will be your **custom implementation** that extends `ERC20` and adds:
  + A constructor that mints tokens
  + (Optional) Access control or mint restrictions

![](https://heungno.net/wp-content/uploads/2025/04/image-23.png)

**MyERC20.sol**

```
// SPDX-License-Identifier: MIT
// MyERC20 version 0.0.1
pragma solidity ^0.8.20;

import {ERC20} from "./ERC20.sol";

contract MyERC20 is ERC20 {
    uint256 public _initialSupply = 1000000 * (10**18);

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _mint(_msgSender(), _initialSupply);
    }

    function mint(address to, uint256 value) public {
        _mint(to, value);
    }
}
```

### 📆 Compile & Deploy

#### ✅ How to Compile

💡 After writing your token contract, the next step is to **compile it** in Remix to check for any syntax or logic errors.

1. **Select the file**  
   In the **File Explorer**, make sure `MyERC20.sol` is selected.
2. **Click the compile button**  
   Open the **Solidity Compiler** tab (left menu) and click the **“Compile MyERC20.sol”** button.

![](https://heungno.net/wp-content/uploads/2025/04/image-25-1024x465.png)

#### 🚀 Deploy using Remix VM

💡 After compiling your contract, you can deploy it to a local blockchain environment using **Remix VM**. This allows for quick and gas-free testing.

1. **Select the network**  
In the "Deploy & Run Transactions" tab, choose **Remix VM (Shanghai)** as the environment.  
This simulates a local blockchain in your browser.

2. **Select an account**  
Pick one of the pre-funded test accounts provided by Remix.

3. **Select the contract**  
Ensure **MyERC20** is selected in the CONTRACT dropdown.  
This should match the name of your compiled contract.

4. **Enter constructor input values**  
Provide your token’s `name` (e.g., `"MyToken"`) and `symbol` (e.g., `"MTK"`).

5. **Click `transact`**  
Hit the orange **`transact`** button to deploy your contract.  
Remix will show a confirmation log and your deployed contract will appear in the sidebar.

![](https://heungno.net/wp-content/uploads/2025/04/image-26-1024x702.png)

#### 📋 Confirm in Console

💡 After clicking the **`transact`** button, Remix will display deployment logs in the console.  
This lets you verify that your contract was successfully deployed.

![](https://heungno.net/wp-content/uploads/2025/04/image-27-1024x349.png)

#### 🧩 Interacting with Deployed Contract

💡 Once your contract is deployed, you can **call functions directly in Remix** to verify and use the token.

![](https://heungno.net/wp-content/uploads/2025/04/image-30.png)

Click the following buttons to **read values stored in the contract**:

* `name()` – returns the token name (e.g., "My Token")
* `symbol()` – returns the token symbol (e.g., "MTK")
* `decimals()` – shows how many decimal places the token uses (typically 18)
* `totalSupply()` – shows the total amount of tokens created
* `balanceOf(address)` – shows how many tokens a specific address holds

### 🔁 Try Token Actions

Test the actual **token transfer logic** using these functions:

* `mint(address to, uint256 value)`  
  Mints (creates) new tokens and sends them to the given address.  
  👉 *If restricted to owner, only the deployer can use this.*
* `transfer(address to, uint256 value)`  
  Transfers tokens from your current account to another address.

> 📌 Make sure you're using the **same account** that has tokens (or was minted tokens), otherwise transfer will fail due to insufficient balance.

---

### 🔧 Modify Contract: Owner-only Mint

💡 In the previous step, we noticed that anyone could call the `mint()` function.  
That’s dangerous — so now we’ll add a simple **access control mechanism** to make sure only the contract owner can mint new tokens.

---

### ✏️ What Changed

MyERC20.sol

```
// SPDX-License-Identifier: MIT
// MyERC20 version 0.0.2
pragma solidity ^0.8.20;
import {ERC20} from "./ERC20.sol";

contract MyERC20 is ERC20 {
    uint256 public _initialSupply = 1000000 * (10**18);
    address public _owner;

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _mint(_msgSender(), _initialSupply);
        _owner = _msgSender();
    }

    function mint(address to, uint256 value) public {
        require(_owner == _msgSender(), "caller is not owner");
        _mint(to, value);
    }
}
```

* ✅ `address public _owner;`  
  A new state variable to store who deployed the contract (the "owner").
* ✅ `_owner = _msgSender();` inside the constructor  
  This sets the owner when the contract is first deployed.
* ✅ `require(_owner == _msgSender(), "caller is not owner");` in the `mint()` function  
  This restricts minting to the owner only.

---

### 🔁 What to Do

1. **Update your contract code** as shown
2. **Recompile and redeploy** `MyERC20.sol`
3. In Remix, try using the `mint()` function from a **non-owner account** → ❌ Should revert with `"caller is not owner"`
4. Try again from the **owner account** → ✅ Should succeed

![](https://heungno.net/wp-content/uploads/2025/04/image-29-1024x278.png)

### 🌐 Deploy to Public Network

💡 Now that you’ve tested locally, it’s time to deploy your token to a real blockchain — **the WorldLand Mainnet**.

worldland

<https://seoul.worldland.foundation>

103

WLC

![](https://heungno.net/wp-content/uploads/2025/04/image-40.png)

### ✅ Deployment Steps (WorldLand Mainnet)

1. **Open MetaMask**  
   Make sure the MetaMask extension is installed and unlocked.
2. **Connect MetaMask to Remix**  
   In Remix, under the **DEPLOY & RUN TRANSACTIONS** panel:
   * Set **Environment** to **Injected Provider - MetaMask**
3. **Select the WorldLand Mainnet in MetaMask**
4. **Redeploy your contract**
   * Ensure the correct contract (`MyERC20`) is selected
   * Provide constructor values (token name, symbol)
   * Set **Gas Limit** (e.g., `800000`)
   * Click `transact`

![](https://heungno.net/wp-content/uploads/2025/04/image-31-1024x330.png)

If deployment succeeds, you’ll see the transaction confirmed in both Remix and MetaMask.  
Copy and save the deployed **contract address** — you’ll need it to interact with your token.

### 💳 View Balance in MetaMask

💡 Once your contract is deployed on the **WorldLand Mainnet**, you can add the token to MetaMask to view and track balances.

### ✅ Steps to Check Your Token

1. **Copy the deployed contract address**  
   After deployment in Remix, copy the address shown under "contract address".
2. **Open MetaMask → Go to `Tokens` tab → Click “Import tokens”**
   * Select the **WorldLand Mainnet** network if not already active.
3. **Paste the contract address**
   * MetaMask will automatically fetch the token **name**, **symbol**, and **decimals** if coded properly.
4. **Call `mint()` in Remix**
   * Mint tokens to your MetaMask account.
   * Go back to MetaMask — the **balance will update** in real-time.

![](https://heungno.net/wp-content/uploads/2025/04/image-32-1024x266.png)
![](https://heungno.net/wp-content/uploads/2025/04/image-39-1024x547.png)
