// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract Lock {
    uint transationCounter;

    event Transfer(address from , address receiver ,uint amount , string message , uint timestamp, string keyword);

    struct TransferStruct
    {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain(address payable receiver,uint amount,string memory message,string memory keyword) public 
    {
        transationCounter+=1;
        transactions.push(TransferStruct(msg.sender,receiver,amount,message,block.timestamp,keyword));
        emit Transfer(msg.sender ,receiver ,amount, message ,block.timestamp,keyword);

    }

    function GetAllTransactions() public view returns(TransferStruct[] memory) 
    {
        return transactions;
    }
    function GetTransactions() public view returns(uint) 
    {
        return transationCounter;
        
    }



}
