import React from "react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { contractABI, Contract_Address } from "../utils/constant";

export const TransactionContext = React.createContext();

const getEthereumContract = async () => {
  ;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const transctionContract = new ethers.Contract(
    Contract_Address,
    contractABI,
    signer
  );
  return transctionContract;
};
export const TransactionProvider = ({ children }) => {
  const [updator,setupdator]=useState(0)
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  const [transactions, setTransactions] = useState([]);

  const [CurrAcc, setCurrAcc] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const [TransactionCount, setTransationcount] = useState(
    localStorage.getItem("TransactionCount")
  );

  const handleChange = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  async function checkIfWalletIsConnected() {
    if (!window.ethereum) {
      alert("Please Install Metamask");
    } else {
      const account = await window.ethereum.request({ method: "eth_accounts" });
      try {
        if (account.length) {
          setCurrAcc(account[0]);
        } else {
          alert("No Accounts Found,Connect Metamsk Wallet first");
        }
      } catch (error) {
        alert("No Ethereum Object");
      }
    }
  }

  const getAllTransactions = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const transactionsContract =new ethers.Contract(
          Contract_Address,
          contractABI,
          provider
        );

        const availableTransactions =
          await transactionsContract.GetAllTransactions();
        // console.log(availableTransactions);

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              Number(transaction.timestamp) * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: Number(transaction.amount)/1000000000000000000,
          })
        );
        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ConnectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("install metamask account first");
      } else {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrAcc(accounts[0]);
      }
    } catch (error) {
      alert("Try again to connect metamask");
    }
  };
  async  function doo()
  {
    const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const transctionContract = new ethers.Contract(
          Contract_Address,
          contractABI,
          signer
        );
        const { addressTo, amount, keyword, message } = formData;
        const parseAmount = ethers.parseEther(amount);

    const transactionHash = await transctionContract.addToBlockchain(

        addressTo,
        parseAmount,
        message,
        keyword
      );
  };
  const sendTransaction = async () => {
    try {
      if (!window.ethereum) {
        return alert("Please install Metamask");
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const transctionContract = new ethers.Contract(
          Contract_Address,
          contractABI,
          signer
        );
        const { addressTo, amount } = formData;
        let isErrorOccured=false;
        try
        {
          const parseAmount = ethers.parseEther(amount);
          await signer.sendTransaction({
          from:CurrAcc,
          to: addressTo,
          gas: "0x5208",
          value: parseAmount,
        });
        }
        catch(error)
        {
          isErrorOccured=true;
          alert(error);
        }
        finally
        {
          if(isErrorOccured===false)
          {
            alert("Transaction Made Succesfully");
          }
          else
          {
            alert("transaction not done")
          }
          
        }

        let isErrorOccure=false;
        try
        {
          await doo();
        }
        catch(error)
        {
          isErrorOccure=true;
          alert(error);
        }
        finally
        {
          if(isErrorOccure===false)
          {
            alert("Your Transaction on blockchian updated succesfully");
          }
          else
          {
            alert("Failed to update your transaction")
          }
        }

        // setisLoading(true);
        // console.log(`Loading - ${transactionHash.hash}`);
        // await transactionHash.wait();
        // console.log(`Success - ${transactionHash.hash}`);
        // setisLoading(false);

        // const transactionsCount = await transctionContract.GetTransactions();

        // setTransationcount(Number(transactionsCount));
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract =  new ethers.Contract(
          Contract_Address,
          contractABI,
          provider
        );
        const currentTransactionCount = await contract.GetTransactions();
  
        window.localStorage.setItem("TransactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExists();
    getAllTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        ConnectWallet,
        CurrAcc,
        formData,
        isLoading,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
