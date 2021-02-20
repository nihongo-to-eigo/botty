const Datastore = require('nedb');
const { resolve } = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// set up permissions DB
const permDB = new Datastore('./permissions.db');
permDB.loadDatabase();

/**
 * Adds a permission level to the permission DB
 * @param {string} permLevel Permission level you want to add to the DB
 */
function addPerm(permLevel) {
  return new Promise((resolve, reject) => {
    permDB.insert({_id: permLevel, users: [], roles: []}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
// adding permission levels
function addHighPerm () {
  return new Promise((resolve, reject) => {
    rl.write('Adding high and low permission levels to the permission DB\n');
    // add high permission level
    addPerm('high').then(() => {
      rl.write('Added high permission.\n');
      resolve();
    }).catch((err) => {
      reject(`Failed to add high permission: ${err}\n`);
    });
  });
};
// add low permission level
function addLowPerm() {
  return new Promise((resolve, reject) => {
    addPerm('low').then(() => {
      rl.write('Added low permission.\n');
      resolve();
    }).catch((err) => {
      reject(`Failed to add low permission: ${err}\n`);
    });
  });
};

// set up settings DB
const settingsDB = new Datastore('./settings.db');
settingsDB.loadDatabase();

/**
 * Adds a setting to the DB with the value of the value parameter
 * @param {string} setting Setting to add to the DB
 * @param {string} value Value of the setting
 */
function addSetting(setting, value) {
  return new Promise((resolve, reject) => {
    settingsDB.insert({_id: setting, value}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
    // get and set the home server id for the bot
function addHome() {
  return new Promise((resolve, reject) => {
    rl.question('What is the ID of the home Discord server? ', (homeServerId) => {
      addSetting('home_server_id', homeServerId).then(() => {
        rl.write('Home server ID stored\n')
        resolve();
      }).catch((err) => {
        reject(`There was an issue storing the home server ID: ${err}\n`);
      });
    });
  });
};

// get and set the private log channel id
function addPrivateLogChannel() {
  return new Promise((resolve, reject) => {
    rl.question('What is the ID of the private log channel? ', (privateLogChannel) => {
      addSetting('private_log_channel', privateLogChannel).then(() => {
        rl.write('Private log channel ID stored\n');
        resolve();
      }).catch((err) => {
        reject(`There was an error when trying to store the private log channel: ${err}\n`);
      });
    });
  });
};

// get and set the public log channel id
function addPublicLogChannel() {
  return new Promise((resolve, reject) => {
    rl.question('What is the ID of the public log channel? ', (publicLogChannel) => {
      addSetting('public_log_channel', publicLogChannel).then(() => {
        rl.write('Public log channel ID stored\n');
        resolve();
      }).then((err) => {
        reject(`There was an error when trying to store the public log channel ID: ${err}`);
      });
    });
  });
};

// get and set the warn role id
function addWarnRole() {
  return new Promise((resolve, reject) => {
    rl.question('What is the ID of the warn role? ', (warnRoleId) => {
      addSetting('warn_role_id', warnRoleId).then(() => {
        rl.write('Warn role ID stored\n');
        resolve();
      }).catch((err) => {
        reject(`There was an error trying to store the warned role ID: ${err}`);
      });
    });
  });
};
// get and set the muted role id
function addMutedRole() {
  return new Promise((resolve, reject) => {
    rl.question('What is the ID of the muted role? ', (mutedRoleId) => {
      addSetting('muted_role_id', mutedRoleId).then(() => {
        rl.write('Muted role ID stored\n');
        resolve();
      }).catch((err) => {
        reject(`There was an error tryign to store the muted role ID: ${err}`);
      });
    });
  });
};

addHome().then(() => {
  addPrivateLogChannel().then(() => {
    addPublicLogChannel().then(() => {
      addWarnRole().then(() => {
        addMutedRole().then(() => {
          Promise.all([addHighPerm(), addLowPerm()]).then((values) => {
            rl.close();
          })
        })
      })
    })
  })
})

// graceful close message
rl.on('close', () => {
  console.log('Setup ended.');
  process.exit(0);
});