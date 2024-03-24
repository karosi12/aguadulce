import { Config } from '../config/config'
const config = new Config()
const { CONTRACT_ADDRESS, PRIVATE_KEY, PROVIDER_API_URL } =
  config.requiredVariables

// For Hardhat
const contract = require('../../artifacts/contracts/Auction.sol/Auction.json')

// interact.js
// const ethers = require('ethers');
import { ethers } from 'ethers'

// Provider
const alchemyProvider = new ethers.providers.JsonRpcProvider(PROVIDER_API_URL)

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider)

// Contract
export const auctionContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contract.abi,
  signer,
)
