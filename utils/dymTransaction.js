const { ethers } = require("ethers");

async function sendAllDYM(senderPrivateKey, receiverAddress, provider, feeAmount) {
    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    while (true) {
        try {
            let balance = await provider.getBalance(wallet.address);
            balance = balance.sub(ethers.utils.parseEther(feeAmount));
            if (balance <= 0) {
                console.log("Insufficient balance to perform the transfer.");
                return null;
            }
            return await attemptTransaction(wallet, receiverAddress, balance);
        } catch (error) {
            console.log("Waiting for network to be ready... Retrying shortly");
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
}

async function attemptTransaction(wallet, receiverAddress, balance) {
    const txDetails = {
        to: receiverAddress,
        value: balance,
        gasLimit: ethers.utils.hexlify(21000)
    };

    try {
        let tx = await wallet.sendTransaction(txDetails);
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.log("Attempting without specifying gas limit...");
        delete txDetails.gasLimit;

        try {
            let tx = await wallet.sendTransaction(txDetails);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.log("Attempting with a higher gas limit of 200000...");
            txDetails.gasLimit = ethers.utils.hexlify(200000);
            let tx = await wallet.sendTransaction(txDetails);
            await tx.wait();
            return tx.hash;
        }
    }
}

module.exports = { sendAllDYM };
