import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
// eslint-disable-next-line node/no-missing-import
import { CustomBallot } from "../typechain";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";
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
  if (process.argv.length < 3) throw new Error("Ballot address missing");
  const customBallotAddress = process.argv[2];

console.log(
    `Attaching ballot contract interface to address ${customBallotAddress}`
  );

console.log("Querying the winning proposal");

//Connect wallet to contract
const customBallotContract: CustomBallot = new Contract(
    customBallotAddress,
    customBallotJson.abi,
    signer
) as CustomBallot;

// Call the winnerName function from the ballot contract
const winningProposalName = await customBallotContract.winnerName();
//Display the winning proposal. Make sure to convert bytes32 to string 
console.log ("And the winning proposal is..."+ ethers.utils.parseBytes32String(winningProposalName))

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});