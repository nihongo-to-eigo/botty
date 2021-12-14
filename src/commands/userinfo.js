'use strict';
const Command = require('../structures/Command');

//For getting user information (account creation date, server join date, etc.)
module.exports = function command(requires) {
  return new Command({
    name: 'User Info',
    inline: false,
    alias: ['ui'],
    blurb: 'Gets info on a user',
    longDescription: 'Shows account creation date and server join date for a user. Without a specified user mentioned, gets info on the person who used the command.',
    usages: ['`%prefixui` ― Gets info on sender',
      '`%prefixui {user}` ― Gets info on specified user.'],
    permission: 'public',
    action: async function(details) {
      const bot = requires.bot;
      const info = requires.info;
      const userFeather = info.utility.useSource('user');

      if(details.input === '') {
        const { embed } = await userFeather.getInfo(details, details.userID);
        bot.createMessage(details.channelID, {embed });
      } else if(details.args.length == 2) {
        let uid = info.utility.stripUID(details.args[1]);
        if(uid) {
          const { embed } = await userFeather.getInfo(details, uid);
          bot.createMessage(details.channelID, { embed });
        }
      } else {
        bot.createMessage(details.channelID, {message: 'Please look at the help menu to see how to properly use the command.'});
      }
    }
  }, requires);
};
