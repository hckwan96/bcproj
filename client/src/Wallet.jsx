import server from "./server";
import { useState } from "react";
import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1'
import { toHex }  from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, nounce })
{
  const [keyLength, setkeyLength] = useState(0);

  async function onChange(evt)
  {
    let privateKey = evt.target.value;
    setkeyLength(privateKey.length);

    if (privateKey.startsWith("0x"))
    {
      privateKey = privateKey.slice(2)
    }

    setPrivateKey(privateKey);

    if (privateKey.length == 64)
    {
      const address = toHex(secp.getPublicKey(privateKey));
      setAddress(address);

      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      }
      else
      {
        setAddress("");
        setBalance(0);
      }
    }
    else
    {
      setAddress("");
      setBalance(0);
    }
  }


  async function checkAcc()
  {
    let privateKey = document.getElementById("key").value;

    if (privateKey.startsWith("0x"))
    {
      privateKey = privateKey.slice(2)
    }

    setPrivateKey(privateKey);

    if (privateKey.length < 64 || privateKey.length > 64)
    {
      alert("Private key should be 64 characters in length");
      setAddress("");
      setBalance(0);
    }
    else
    {
      const address = toHex(secp.getPublicKey(privateKey));
      setAddress(address);

      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      }
      else
      {
        setAddress("");
        setBalance(0);
      }
    }
  }


  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Type your private key" value={privateKey} id="key" onChange={onChange}></input>
        Length: {keyLength}
      </label>

      {
        address ?  
          (
            <label>
              Wallet Address: {address.slice(0, 5)} ... {address.slice(-5)}
              <br />Nounce: {nounce}
            </label>
          ) : null
      }
    
      <div className="balance">Balance: {balance}</div>

      <input type="button" className="button Chkbutton" value="Check Account" onClick={checkAcc}/>
    </div>
  );
}

export default Wallet;
