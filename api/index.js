const express = require('express')
import rsa from 'js-crypto-rsa'

let publicJwk = {}
let privateJwk = {}

rsa.generateKey(2048).then((key) => {
  // now you get the JWK public and private keys
  publicJwk = key.publicKey
  privateJwk = key.privateKey

  console.log('public key:', publicJwk)
  console.log('private key:', privateJwk)

  const msg = new TextEncoder().encode('gila')

  rsa
    .encrypt(
      msg,
      publicJwk,
      'SHA-256' // optional, for OAEP. default is 'SHA-256'
    )
    .then((encrypted) => {
      // now you get an encrypted message in Uint8Array
      var decoder = String.fromCharCode.apply(null, encrypted)
      var b64encoded = Buffer.from(decoder).toString('base64')
      console.log('encr', b64encoded)
      return rsa.decrypt(
        encrypted,
        privateJwk,
        'SHA-256' // optional, for OAEP. default is 'SHA-256'
      )
    })
    .then((decrypted) => {
      // now you get the decrypted message
      console.log('describe message:', new TextDecoder().decode(decrypted))
    })
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/test', function (req, res) {
  res.send('Test successful')
})

export default {
  path: '/api2',
  handler: app,
}
