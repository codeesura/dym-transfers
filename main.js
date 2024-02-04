const { ethers } = require("ethers");
const { Worker } = require('worker_threads');
const config = require('./config.json');

const providerUrl = config.providerUrl || process.argv[2];

if (!providerUrl) {
    console.error("\x1b[31m%s\x1b[0m", "Please provide a provider URL.");
    process.exit(1);
}

console.log("\x1b[34m%s\x1b[0m",`[${new Date().toLocaleTimeString()}] Starting the transaction process...`);

let activeWorkers = config.privateKeys.length;

async function checkNetworkReady() {
    while (true) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(providerUrl);
            const blockNumber = await provider.getBlockNumber();
            if (blockNumber >= 0) {
                console.log("\x1b[32m%s\x1b[0m", 'Network is ready. Starting transactions...');
                startTransactions();
                break;
            }
        } catch (error) {
            const currentTime = new Date().toLocaleTimeString();
            console.error("\x1b[31m%s\x1b[0m", `[${currentTime}] Network not ready, waiting and retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 seconsd delay
            console.log(error);
        }
    }
}


function startTransactions() {
    config.privateKeys.forEach((key, index) => {
        const attemptTransaction = (retryCount = 0) => {
            const worker = new Worker('./utils/dymWorker.js');
            worker.postMessage({
                senderPrivateKey: key,
                receiverAddress: config.receiverAddress,
                providerUrl: providerUrl,
                feeAmount: config.feeAmount,
            });
    
            worker.on('message', (message) => {
                if (message.status === 'success') {
                    console.log("\x1b[32m%s\x1b[0m", `Worker ${index + 1}: Transaction Success, Hash: ${message.hash}`);
                    decrementActiveWorkers();
                } else {
                    if (retryCount < 3) {
                        attemptTransaction(retryCount + 1);
                    } else {
                        console.error("\x1b[31m%s\x1b[0m", `Worker ${index + 1}: Transaction Failed after 3 retries.`);
                        decrementActiveWorkers();
                    }
                    if (index === 0) {
                        console.error("\x1b[31m%s\x1b[0m", `Worker ${index + 1}: Error: ${message.error}`);
                    }
                }
            });
    
            worker.on('error', error => {
                console.error("\x1b[31m%s\x1b[0m", `Worker ${index + 1} error:`, error);
                decrementActiveWorkers();
            });
    
            worker.on('exit', (code) => {
                if (code !== 0) {
                    console.error("\x1b[31m%s\x1b[0m", `Worker ${index + 1} stopped with exit code ${code}`);
                }
            });
        };
    
        attemptTransaction();
    });
}


function decrementActiveWorkers() {
    activeWorkers--;
    if (activeWorkers === 0) {
        console.log("\x1b[34m%s\x1b[0m", 'All transactions have been processed.');
    }
}

checkNetworkReady();