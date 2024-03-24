// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

contract Auction {
    address public auctioneer;
    uint public highestBid;
    address public highestBidder;
    uint public totalBids;
    uint public totalEthVolume;
    mapping(address => uint) public bids;

    enum AuctionStatus { Ongoing, Ended }
    AuctionStatus public auctionStatus;

    event NewBid(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    constructor() {
        auctioneer = msg.sender;
        auctionStatus = AuctionStatus.Ongoing;
    }

    modifier onlyAuctioneer() {
        require(msg.sender == auctioneer, "Only auctioneer can call this function");
        _;
    }

    function getAuctionStatus() public view returns(uint, address, AuctionStatus) {
        return (highestBid, highestBidder, auctionStatus);
    }

    function getAuctionHistory() public view returns(uint) {
        return totalBids;
    }

    function submitBid(uint newValue, address sender) public payable {
        require(auctionStatus == AuctionStatus.Ongoing, "Auction is not ongoing");
        require(msg.value > highestBid, "Bid amount should be higher than current highest bid");

        if (highestBid != 0) {
            // Refund the previous highest bidder
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = newValue; 
        highestBidder = sender; 
        totalBids++;
        totalEthVolume += newValue; 
        bids[msg.sender] += newValue;

       emit NewBid(sender, newValue);
    }

    function endAuction() public onlyAuctioneer {
        require(auctionStatus == AuctionStatus.Ongoing, "Auction is not ongoing");

        auctionStatus = AuctionStatus.Ended;
        emit AuctionEnded(highestBidder, highestBid);
    }
}
