# Supply chain & data auditing

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

The DApp User Interface when running should look like...

![truffle test](doc/images/ftc_product_overview.png)

![truffle test](doc/images/ftc_farm_details.png)

![truffle test](doc/images/ftc_product_details.png)

![truffle test](doc/images/ftc_transaction_history.png)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Please make sure you've already installed ganache-cli, Truffle and enabled MetaMask extension in your browser.

#### Dependencies

This project uses the following libraries:

- web app:

    lite-server v2.6.1

- contracts

    Truffle v5.5.22 (core: 5.5.22)
    Ganache v7.3.2
    Solidity v0.5.16 (solc-js)
    Node v12.22.12
    Web3.js v1.7.4


### Installing

> The starter code is written for **Solidity v0.4.24**. At the time of writing, the current Truffle v5 comes with Solidity v0.5 that requires function *mutability* and *visibility* to be specified (please refer to Solidity [documentation](https://docs.soliditylang.org/en/v0.5.0/050-breaking-changes.html) for more details). To use this starter code, please run `npm i -g truffle@4.1.14` to install Truffle v4 with Solidity v0.4.24. 

A step by step series of examples that tell you have to get a development env running

Clone this repository:

```
git clone https://github.com/lgeorges1234/3_Supplychain_Project.git
```

Change directory to ```app``` folder and install all requisite npm packages (as listed in ```package.json```):

```
cd app
npm install
```

Launch Ganache:

```
ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"
```

Your terminal should look something like this:

![truffle test](doc/images/ganache-cli.png)

In a separate terminal window, Compile smart contracts:

```
truffle compile
```

Your terminal should look something like this:

![truffle test](doc/images/truffle_compile.png)

This will create the smart contract artifacts in folder ```app\build\contracts```.

Migrate smart contracts to the locally running blockchain, ganache-cli:

```
truffle migrate
```

Your terminal should look something like this:

![truffle test](doc/images/truffle_migrate.png)

Test smart contracts:

```
truffle test
```

All 10 tests should pass.

![truffle test](doc/images/truffle_test.png)

In a separate terminal window, launch the DApp:

```
npm run dev
```

## Contract Hash

The contract has been deployed on the Rinkeby Testing Network getting the following contract address:

- 0x66764d55f81cc6c04484919f02d723b1aeafc3c3bbe659f988b085777018c1f9


## Built With

* [Ethereum](https://www.ethereum.org/) - Ethereum is a decentralized platform that runs smart contracts
to make the web faster, safer, and more open.
* [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier.
* [Web3 library](https://web3js.readthedocs.io/en/v1.7.4/) - Web3 is a collection of libraries that allow you to interact with a local or remote ethereum node using HTTP, IPC or WebSocket.


