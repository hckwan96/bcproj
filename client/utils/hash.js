import { sha256 } from "ethereum-cryptography/sha256";
import { secp256k1 as secp } from 'ethereum-cryptography/secp256k1'
import { toHex, utf8ToBytes }  from "ethereum-cryptography/utils";
import { keccak256 } from 'ethereum-cryptography/keccak';


const privateKey = secp.utils.randomPrivateKey();

//console.log('private key:', privateKey);
console.log('privateKey:', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log('public key:', toHex(publicKey));
//console.log('keccak public key:', toHex(keccak256(publicKey.slice(1).slice(-20))));