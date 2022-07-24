import { ethers } from "ethers";
import "dotenv/config";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

  function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }
function setupProvider() {
  const infuraOptions = process.env.INFURA_API_KEY
    ? process.env.INFURA_API_SECRET
      ? {
          projectId: process.env.INFURA_API_KEY,
          projectSecret: process.env.INFURA_API_SECRET,
        }
      : process.env.INFURA_API_KEY
    : "";
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: infuraOptions,
  };
  const provider = ethers.providers.getDefaultProvider("goerli", options);
  return provider;
}

async function main() {
    const wallet =
      process.env.MNEMONIC && process.env.MNEMONIC.length > 0
        ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
        : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

    console.log(`Using address ${wallet.address}`);

    const provider = setupProvider();

    const signer = wallet.connect(provider);

    const balanceBN = await signer.getBalance();

    const balance = Number(ethers.utils.formatEther(balanceBN));

    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
      throw new Error("Not enough ether");
    }
    console.log("Deploying Token contract");
    
    const tokenFactory = new ethers.ContractFactory(
        tokenJson.abi,
        tokenJson.bytecode,
        signer
      );
      const tokenContract = await tokenFactory.deploy();
      console.log("Awaiting confirmations");
      await tokenContract.deployed();
      console.log("Completed");
      console.log(`Token address is : ${tokenContract.address}`);
      const mintTx = await tokenContract.mint(wallet.address, ethers.utils.parseEther("100"));
      await mintTx.wait();
    
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  