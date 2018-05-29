const fs = require('fs');
const readline = require('readline');

let rl = readline.createInterface(process.stdin, process.stdout);

let mainTemplate = [
  ['prefix', 'Command Prefix', '[', false],
  ['playing', 'Bot Status', 'Try %prefixhelp ;)', false],
  ['description', 'Bot Description', '<bot description>', false],
  ['administrators', 'Admin User ID', '<user id>', true],
  ['log_channel', 'Log Channel ID', '<log channel id>', false],
  ['voice_channel', 'Voice Channel ID', '<voice channel id>', false],
  ['voice_channel_chat', 'Voice Chat Channel ID', '<voice chat id>', false]
];

let apiTemplate = [
  ['discord_token', 'Discord Bot Token', '<bot token>', false]
];

let fileOutput = {
  api : {}
}

if(fs.exists('./config.json'))
  return;

console.log('---- Install Successful ---');
console.log('Couldn\'t find config file. Create one now?');

// Ask if the user wants to create a config.
rl.on('line', (input) => {
  if(input.toLowerCase() == "y")
    startInputWizard();
  else 
    process.exit(0);
});
rl.setPrompt('[y/n] > ');
rl.prompt();


function startInputWizard() {
  rl.removeAllListeners("line");

  promptInputFromTemplate(mainTemplate, fileOutput, () => {
    promptInputFromTemplate(apiTemplate, fileOutput.api, () => {
      console.log('Generated configuration!');
      writeConfigToFile(fileOutput);
    });  
  });
}

function writeConfigToFile(json) {
  fs.writeFile("./config.json", JSON.stringify(json, null, 2), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("Config was saved!");
    process.exit(0);
  }); 
}

function promptInputFromTemplate(configTemplate, configOutput, onFinish, k = null) {

  // Setup input listeners on first call.
  if(k === null) {
    k = 0;
    rl.on('line', mapConfig.bind(this))
    .on('close',function(){
      process.exit(0);
    });
  }

  // Iterate each template entry and write it into configOutput
  if(k < configTemplate.length) {
    let i = configTemplate[k];
    let multipleInputsOkWarning = i[3] ? '(Input empty string to finish)' : '';

    rl.setPrompt(`${i[1]} ${multipleInputsOkWarning} | '${i[2]}' > `);
    rl.prompt();
  } else {
    rl.removeAllListeners('line');
    onFinish();
  }

  // This is called on each input from the user, maps input to output object.
  function mapConfig(line) {
    let c = configTemplate[k];
    let value = (line === '') ? c[2] : line; // use default if blank.

    // Are multiple values are ok?
    if(c[3] === true) {
      if(configOutput[c[0]] === undefined)
        configOutput[c[0]] = [];

      // Only write default value to array if its the first and only item.
      if(configOutput[c[0]].length === 0 || line !== '')
        configOutput[c[0]].push(value);

    } else {
      configOutput[c[0]] = value;
    }

    // Only continue to next if multiple entries not allowed or if user entered empty line
    if(c[3] === false || line === '')
      k++;

    promptInputFromTemplate(configTemplate, configOutput, onFinish, k);
  }
}




