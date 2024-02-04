const { parentPort } = require('worker_threads');
const { ethers } = require("ethers");
const { sendAllDYM } = require("./dymTransaction");

parentPort.on('message', async (message) => {
    const { senderPrivateKey, receiverAddress, providerUrl, feeAmount } = message;
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    
    try {
        const hash = await sendAllDYM(senderPrivateKey, receiverAddress, provider, feeAmount);
        parentPort.postMessage({ status: 'success', hash });
    } catch (error) {
        parentPort.postMessage({ status: 'error', error: error.message });
    }
});
