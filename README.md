# DY Transactions Processor

## Description

This codebase is designed to handle transactions for the DY project. It utilizes worker threads to perform transactions asynchronously and will retry a transaction up to three times if it fails before giving up.

Before you begin the installation process, you need to ensure that you have Node.js installed on your system as it's a prerequisite for running JavaScript code outside the browser. Here's how you can prepare your system:

## Prerequisites

1. Node.js: The runtime environment needed to run JavaScript code. You can download it from the official [Node.js](https://nodejs.org/en/download/current) website.
2. npm: This comes bundled with Node.js, so if you install Node.js, you will automatically have npm installed. npm is a package manager that allows you to install JavaScript packages.
3. Git: Version control system to clone the repository. You can download it from the official [Git website](https://git-scm.com/download/win).
Once you have these prerequisites installed, you can proceed with the installation of the project using your choice of package manager.

## Installation

To get started with this project, clone the repository and install its dependencies.


Using npm:

```bash
git clone https://github.com/codeesura/dym-transfers.git
cd dym-transfers
npm install
```

## Configuration

Before running the application, you need to configure the necessary settings in the `config.json` file. Here's what you need to know:

```json
{
    "providerUrl": "",
    "receiverAddress": "SAFE_WALLET_ADDRESS", // Your safe wallet address where DYM tokens will be transferred.
    "privateKeys": [
        "PRIVATE_KEY_1", // Your wallet private keys. Each key must be in quotes, separated by commas.
        "PRIVATE_KEY_2",
        "PRIVATE_KEY_3" // Do not place a comma after the last key to avoid errors.
    ],
    "feeAmount": "1" // The amount allocated for fees in your wallet address. It is recommended to set this to at least 1.
}
```

* **Note** that the `providerUrl` can be left empty here; however, when running the command (`node main.js RPCURL`), you must specify this URL. If you have already set it in the `config.json` file, you can execute the command directly (`node main.js`). Be very careful with your private keys. They are sensitive information and should be kept secure at all times. Please ensure to replace the placeholder values (e.g., `SAFE_WALLET_ADDRESS`, `PRIVATE_KEY_1`, etc.) with actual data before running the application.

## Usage

After you have configured your `config.json` file, you can run the application. If you have set the `providerUrl` in your configuration file, you can start the application with the following command:

```bash
node main.js
```

If you haven't set the `providerUrl` in the configuration file, you must provide it when you run the application:

```bash
node main.js RPCURL
```

Replace <RPCURL> with the actual URL of your Dymension RPC provider.

Make sure you are in the project directory when you execute these commands. If the application encounters any issues or if there are any missing configurations, it will likely throw an error, so make sure to check the output for any error messages and ensure all your configuration settings are correct.