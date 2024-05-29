import server from "./server";
import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1'
import { toHex }  from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, nounce })
{
  async function onChange(evt)
  {
    let privateKey = evt.target.value;

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
        setBalance(0);
      }
    }
    else
      setBalance(0);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
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
    </div>
  );
}

export default Wallet;
