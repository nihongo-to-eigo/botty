'use strict';
const Command = require('../structures/Command');

//command to ban
module.exports = function command(requires) {
  return new Command({
    name: 'Ban',
    inline: true,
    alias: ['b'],
    blurb: 'Bans people.',
    longDescription: 'Bans a user from the server',
    usages: ['`%prefixb {user} {reason}`'],
    permission: 'high',
    action: async function(details) {
      const bot = requires.bot;
      const info = requires.info;
      const wholeTest = /^(?:<@!*)?([a-zA-Z0-9]+)(?:>)?\s*\w.+/g;
      const idPattern = /^(?:<@!*)?([a-zA-Z0-9]+)(?:>)?\s/g;
      //processes input
      let userTest;
      if(details.input === ''
                || !wholeTest.test(details.input)
                || !(userTest = info.utility.stripUID(details.args[1]))
      ) {
        await bot.createMessage(details.channelID, {
          embed: {
            description: 'Failed to parse command. Please try again',
            color: info.utility.red,
          }
        });
      } else {
        const reason = details.input.replace(idPattern, '');
        await bot.banGuildMember(details.serverID, userTest, 7, reason);
        await info.db.addInfraction(userTest, 'ban', new Date, reason);
        await bot.createMessage(details.channelID, {content: 'User was banned'});
        await bot.createMessage(info.settings.private_log_channel, {
          embed: {
            title: 'Log', fields: [
              {name: 'User', value: `<@${userTest}>`},
              {name: 'Action', value: 'ban'},
              {name: 'Reason', value: reason},
              {name: 'Message Link', value: details.link},
              {name: 'Responsible Mod', value: `<@${details.userID}>`}
            ]
          }
        });
      }
    }
  }, requires);
};
