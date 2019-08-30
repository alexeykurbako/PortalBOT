// "axios": "^0.18.1",
    // "slackbot": "0.0.2",
    // "slackbots": "^1.1.0"

//  const { WebClient } = require('@slack/web-api')
  const token = 'xoxb-741873925540-742344171200-uG1k97cvdIVWOQCu3YmoEw2G';
//  const web = new WebClient(token);

// const { createEventAdapter } = require('@slack/events-api');
 const slackSigningSecret = '7c3f6ece3204c118586b7c899ccd6c5c';
// const slackEvents = createEventAdapter(slackSigningSecret);

const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: token,
  signingSecret: slackSigningSecret
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');

  app.message(':wave:', async ({ message, say}) => {
    say(`Hello, <@${message.user}>`);
  });
})();


// const port = process.env.PORT || 4200;

// slackEvents.on('start', () => {
//   const params = {
//     icon_emoji: ':zap:'
//   };
//     bot.postMessageToChannel(
//     'general',
//     'Just write @HowToBot and something what you want to know!',
//     params
//   );
// });

//WEBAPI EXAMPLE
// web.on('message',(event) => {
//   console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
// });


// slackEvents.on('message', (event) => {
//   console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
// });

// (async () => {
//   const server = await slackEvents.start(port);
//   console.log(`Listening for events on ${server.address().port}`);
// })();


// slackEvents.on('message', (event) => {
//   // Oops! This throws a TypeError.
//   event.notAMethod();
// });

// // All errors in listeners are caught here. If this weren't caught, the program would terminate.
// slackEvents.on('error', (error) => {
//   console.log(error.name); // TypeError
// });


// (async () => {
//   // console.log()
//    const conversationId = 'CMWFD5N7Q';
//   // // Post a message to the channel, and await the result.
//   // // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
//   // const result = await web.chat.postMessage({
//   //   text: 'Hello world!',
//   //   channel: conversationId,
//   // });

//   // // The result contains an identifier for the message, `ts`.
//   // console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
//   const result = await web.chat.meMessage({
//        text: 'Hello world!',
//       channel: conversationId,
//     });
//   console.log(result);
// })();





// Start Handler
// bot.on('start', () => {
//   const params = {
//     icon_emoji: ':zap:'
//   };
  

//   bot.postMessageToChannel(
//     'general',
//     'Just write @HowToBot and something what you want to know!',
//     params
//   );
// });

// // Error Handler
// bot.on('error', err => console.log(err));

// // Message Handler
// bot.on('message', data => {//получаем с api
//   if (data.type !== 'message') {
//     return;
//   }
//  // console.log(data);

//   handleMessage(data);
// });

// // Respons to Data
// function handleMessage(message) {
//   if (message.text.includes(' help')) {
//     runHelp();
//   } else if (message.text.includes(' currency')) {
//     handleCurrency(message);
//   }
// }

// function handleCurrency(message){
//   axios.get('http://www.nbrb.by/API/ExRates/Rates/145').then(res => {
//     const params = {
//       icon_emoji: ':zap:'
//     };
//     const userId = message.user;
//     bot.postMessageToChannel("general", `Today is ${res.data.Date} and 1 USD = ${res.data.Cur_OfficialRate} RUB`, params);
//   });
// }

// // Show Help Text
// function runHelp() {
//   const params = {
//     icon_emoji: ':question:'
//   };

//   bot.postMessageToChannel(
//     'general',
//     `Some info about bot`,
//     params
//   );
// }

