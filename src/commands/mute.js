'use strict';
const Command = require('../structures/Command');

//command to mute w/time
module.exports = function command(requires) {
  return new Command({
    name: 'Mute',
    inline: true,
    alias: ['m'],
    blurb: 'Mutes people.',
    longDescription: 'Mutes a user for a specific amount of time. Allowed times are (m - minutes, h - hours, d - days)',
    usages: ['`%prefixm {user} {time} {reason}`'],
    permission: 'low',
    action: async function(details) {
      const bot = requires.bot;
      const info = requires.info;
      const timeReg = /\d+(d|m|h)/g;
      const wholeTest = /(?:<@!*)?([a-zA-Z0-9]+)(?:>)?\s\d+(d|m|h)\s\w.+/g;
      const idAndTime = /(?:<@!*)?([a-zA-Z0-9]+)(?:>)?\s\d+(d|m|h)\s/g;

      if(details.input === ''
          || !wholeTest.test(details.input)
          || !(info.utility.stripUID(details.args[1]))
      ) {
        await bot.createMessage(details.channelID, {
          embed: {
            description: 'Failed to parse command. Please try again',
            color: info.utility.red,
          }
        });
      } else {
        const test = timeReg.exec(details.args[2]);
        const userTest = info.utility.stripUID(details.args[1]);
        if(userTest) {
          if(test !== null) {
            const amount = parseInt(test[0].replace(test[1], ''));
            let muteEnd = new Date;
            switch(test[1]) {
            case 'm':
              muteEnd.setMinutes(muteEnd.getMinutes() + amount);
              break;
            case 'h':
              muteEnd.setHours(muteEnd.getHours() + amount);
              break;
            case 'd':
              muteEnd.setDate(muteEnd.getDate() + amount);
              break;
            }

            info.db.addTimer(userTest, 'mute', muteEnd);
            info.db.addInfraction(userTest, 'mute', new Date, details.input.replace(idAndTime, ''));
              
            bot.createMessage(details.channelID, {content: `User will be muted until ${muteEnd.toUTCString()}`});
            bot.createMessage(info.settings.private_log_channel, {
              embed: {
                title: 'Log', fields: [{name: 'User', value: details.args[1]},
                  {name: 'Action', value: 'mute'},
                  {name: 'Length', value: test[0]},
                  {name: 'Reason', value: details.input.replace(idAndTime, '')},
                  {name: 'Message Link', value: details.link},
                  {name: 'Responsible Mod', value: `<@${details.userID}>`}]
              }
            });
              
            const mutedUser = bot.guilds.get(info.settings.home_server_id).members.get(userTest);
            const muteRole = info.settings.mute_role_id;
            if(mutedUser && muteRole) {
              try {
                await mutedUser.addRole(muteRole, details.input.replace(idAndTime, ''));
              } catch (e) {
                await bot.createMessage(info.settings.info_log_channel, {
                  embed: {
                    title: 'Mute role could not be added',
                    color: info.utility.red,
                    fields: [
                      {name: 'User', value: `<@${mutedUser.id}>`},
                      {name: 'Details', value: e.toString()},
                      {name: 'Role ID', value: muteRole}
                    ],
                  }
                });
              }
            }
          }
        }
      }
    }
  }, requires);
};
