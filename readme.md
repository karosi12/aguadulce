## Aguadulce service

Build a backend service for interacting with an auction smart contract deployed on the Ethereum blockchain using a node provider like Alchemy or Infura.

## Installation

First install [Node.js](http://nodejs.org/)

clone the repository then cd into the project folder run

`npm install` Install dependencies

`npm run compile` To compile the smart contract file

`npm run deploy` To deploy to Ethereum blockchain using sepolia network

`npm run dev` To run in dev environment

`npm run test` For unit test
np

Note: Copy the sample.env file then create an .env file in the root directory of the project and paste the keys then add the values.

### Resources

## User Authentication

Implement user authentication using JSON Web Tokens (JWT). Users
should be able to register, login, and logout.

- user can be created via baseurl/api/v1/register, https method POST
- user can login via baseurl/api/v1/login, https method POST
- user can view their details via baseurl/api/v1/user, https method GET
- user can logout via baseurl/api/v1/logout, https method DELETE

## Auction Operations

The logged in user should be able to access endpoints for

- auction submit bid via baseurl/api/v1/auction/submit-bid, https method POST
- auction status via baseurl/api/v1/auction/status, https method GET
- auction history via baseurl/api/v1/auction/highest-bid, https method GET
- auction bid via baseurl/api/v1/auction/history, https method GET
- auction statistics via baseurl/api/v1/auction/statistics, https method GET