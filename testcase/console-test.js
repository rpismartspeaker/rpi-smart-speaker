'use strict';

const readline = require('readline');
const path = require('path');
const GoogleAssistant = require('google-assistant');

const config = {
  auth: {
    keyFilePath: path.resolve(__dirname, '..', 'client_secret.json'),
    savedTokensPath: path.resolve(__dirname, '..', 'credentials.json'), // where you want the tokens to be saved
  },
  conversation: {
    lang: 'ko-KR', // defaults to en-US, but try other ones, it's fun!
  },
};

const startConversation = (conversation) => {
  // setup the conversation
  conversation
    .on('response', text => console.log('Assistant Response:', text))
    // if we've requested a volume level change, get the percentage of the new level
    .on('volume-percent', percent => console.log('New Volume Percent:', percent))
    // the device needs to complete an action
    .on('device-action', action => console.log('Device Action:', action))
    // once the conversation is ended, see if we need to follow up
    .on('ended', (error, continueConversation) => {
      if (error) {
        console.log('Conversation Ended Error:', error);
      } else if (continueConversation) {
        promptForInput();
      } else {
        console.log('Conversation Complete');
        conversation.end();
      }
    })
    // catch any errors
    .on('error', (error) => {
      console.log('Conversation Error:', error);
    });
};

const promptForInput = () => {
  // type what you want to ask the assistant
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Type your request: ', (request) => {
    // start the conversation
    config.conversation.textQuery = request;
    assistant.start(config.conversation, startConversation);

    rl.close();
  });
};

const assistant = new GoogleAssistant(config.auth);
  assistant
    .on('ready', promptForInput)
    .on('error', (error) => {
      console.log('Assistant Error:', error);
    });