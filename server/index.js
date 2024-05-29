const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes, hexToBytes  }  = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  /// Private Keys:
  /// 5f80132e3392f6c68c9049b40f5d0bcc05da0f269ae21fc3f9c460752064c27f
  /// c2537674ee7c36d583b6de1ec114a25d62274079fcb52af8e979f44b8a063b04
  /// 33fc998a18025e1d8d1decd203fb34f80ca62526fada0e35efe1d318b785d368
  "037b262ac746b51ee590f2a288490267ddee2f0a16d9d1cf15e307645bf6730f9a": 100,
  "03914051b9f42ed8704b29e2d8c507a4dc6e340e5454ab64f7a4d37c97606b7ff7": 50,
  "03d46c86a7d1cdbf73fdf54450ab6e1adbdd1631525d401f8007ff28ae91124787": 75,
};

const lastTransactionNounce = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  const { sender, recipient, amount, nounce, transactionHash, signature } = req.body;

  const signatureObj = {
    r: BigInt(signature.r),
    s: BigInt(signature.s),
    recovery: signature.recovery
  };
  const signatureObj2 = { r: signatureObj.r, s: signatureObj.s }

  const signatureHex = toHex(new Uint8Array(signatureObj))
  const isValid = secp256k1.verify(signatureObj2, transactionHash, sender);
  
  if (!isValid)
  {
      res.status(409).send({ message: "Sender is not the signer" });
      return;
  }

  const lastNounce = lastTransactionNounce[sender] || 0;
  if (lastNounce >= nounce)
  {
      res.status(409).send({ message: "Sender is trying to replay nounce:", nounce });
      return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount)
  {
    res.status(400).send({ message: "Not enough funds!" });
  }
  else
  {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address)
{
  if (!balances[address]) {
    balances[address] = 0;
  }
}
