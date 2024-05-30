import { useState } from "react";
import server from "./server";
import { toHex, utf8ToBytes, hexToBytes }  from "ethereum-cryptography/utils";
import { keccak256 } from 'ethereum-cryptography/keccak';
import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1'

function Transfer({ address, setBalance, privateKey, nounce, setNounce })
{
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [msg, setMsg] = useState("");
  const [msgCSS, setMsgCSS] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt)
  {
    evt.preventDefault();

    try {
      if (!sendAmount)
      {
        setMsg("Please enter the amount");
        setMsgCSS("error")
        return;
      }
      else if (sendAmount <= 0)
      {
        setMsg("Please enter the valid amount");
        setMsgCSS("error")
        return;
      }

      if (!recipient)
      {
        setMsg("Please enter the recipient");
        setMsgCSS("error")
        return;
      }
  
      
      const transaction = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        nounce: nounce + 1
      };

      const hash = hashTransaction(transaction);
      transaction.transactionHash = toHex(hash);
      
      const signature = await signTransaction(transaction.transactionHash, privateKey);
  
      transaction.signature = {
        r: signature.r.toString(),
        s: signature.s.toString(),
        recovery: signature.recovery
      };

      const {
        data: { balance },
      } = await server.post(`send`, transaction);


      setBalance(balance);
      setNounce(nounce + 1);
      setMsg("Transferred completed");
      setMsgCSS("done");
    }
    catch (ex)
    {
      console.log(ex.response.data.message)
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient Public Key
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <div className={msgCSS}>{ msg }</div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

function stringifyTransaction(transaction) {
  return JSON.stringify(transaction, (key, value) => {
    return typeof value === 'bigint' ? value.toString() : value;
  });
}

function hashTransaction(transaction) {
  const stringifiedTransaction = stringifyTransaction(transaction);
  return hashMessage(stringifiedTransaction);
}

async function signTransaction(transactionHash, privateKey) {
  return await secp.sign(transactionHash, privateKey);
}

export default Transfer;
