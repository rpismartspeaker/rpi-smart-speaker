'use strict';

const { OAuth2Client } = require('google-auth-library')
const opn = require('opn')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

try {
  const key = require('../client_secret.json').installed
  const Auth = new OAuth2Client(key.client_id, key.client_secret, key.redirect_uris[0])

  const url = Auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/assistant-sdk-prototype'],
  });

  try {
    opn(url)
  } catch (e) {
    console.log(`please visit to ${url}`)
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  rl.question('token: ', answer => {
    if (!answer) {
      process.exit(-1)
    } else {
      Auth.getToken(answer, (err, res) => {
        if (err) {
          throw new Error(`error getting token: ${err}`)
        } else {
          let token = JSON.stringify(res)
          fs.writeFileSync(path.resolve(__dirname, '..', 'credentials.json'), token, {
            encoding: 'utf8'
          })
        }
      })
    }
    rl.close()
  })
} catch (e) {
  console.error(e)
}
