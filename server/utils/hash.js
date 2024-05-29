//import { sha256 } from "ethereum-cryptography/sha256";
const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex, utf8ToBytes }  = require("ethereum-cryptography/utils");

const privateKey = secp256k1.utils.randomPrivateKey();

//console.log('private key:', privateKey);
console.log('privateKey:', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey).slice(-20);
const fullPublicKey = secp256k1.getPublicKey(privateKey);

console.log('public key:', toHex(publicKey));
console.log('public key:', toHex(fullPublicKey));
console.log('keccak public key:', toHex(keccak256(publicKey.slice(1).slice(-20))));


const bytes = utf8ToBytes("Vote Yes on Proposal 123");
const hash = keccak256(bytes); 

const signature = secp256k1.sign(hash, privateKey);
console.log('sign',signature)

class Signature {
  constructor({r, s, recovery}) {

      this.r = BigInt(r);
      this.s = BigInt(s);
      this.recovery = recovery;
  }
}

SignatureFixed = new Signature(signature)
 const isValid = secp256k1.verify(SignatureFixed, hash, fullPublicKey);
 console.log(SignatureFixed)
 console.log("publicKey: ",signature.recoverPublicKey(hash).toHex());

 const signatureObj = {
  r: BigInt(signature.r),
  s: BigInt(signature.s),
  recovery: signature.recovery
 };
 const signatureObj2 = { r: signatureObj.r, s: signatureObj.s }

 const signatureHex = toHex(new Uint8Array(signatureObj))
 const valid = secp256k1.verify(signatureObj2, hash, fullPublicKey);

 console.log("publicKey: ",signatureObj.recoverPublicKey(hash).toHex());

 console.log('sobj', signatureObj)
 console.log("valid: ",isValid);

 //console.log("publicKey: ",SignatureFixed.recoverPublicKey(hash).toHex());

 console.log("valid1: ",valid);

