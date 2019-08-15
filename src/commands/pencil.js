'use strict';
const Command = require('../structures/Command');

//Adds a pencil at the end of your nickname or username.
module.exports = function command(requires)
{
  return new Command({
    name: 'Pencil',
    inline: true,
    alias: ['p'],
    blurb: 'Adds a pencil at the end of your nickname or username',
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let member = bot.guilds.get(details.serverID).members.get(details.userID);
      let pencil = '📝';
      let nickname = member.nick || '';
      if(details.input === '') {
        if(!nickname.endsWith(pencil)) {
          let newName = member.nick ? member.nick + ' ' + pencil : member.username + ' ' + pencil;
          member.edit({nick: newName}).then(() => {
            bot.createMessage(details.channelID, {embed: {
              title: 'Success', description: pencil + ' Has been added.', color: info.utility.green}
            });
          }).catch(() => {
            bot.createMessage(details.channelID, {embed: {
              title: 'Error', description: 'An error occured.', color: info.utility.red}
            });
          });
        }
        else {
          bot.createMessage(details.channelID, {embed: {
            title: 'Error', description: 'You already have ' + pencil, color: info.utility.red}
          });
        }
      }
    }
  }, requires);
};
