'use strict';
const Command = require('../structures/Command');

//Adds a pencil at the end of your nickname or username.
module.exports = function command(requires)
{
  return new Command({
    name: 'Pencil',
    inline: true,
    alias: ['p'],
    description: 'Adds a pencil at the end of your nickname or username',
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let member = bot.servers[details.serverID].members[details.userID];
      let pencil = '📝';
      let newName = '';
      let change = true;
      if(member.nick) {
        if(!member.nick.endsWith(pencil)) {
          newname = member.nick ? member.nick + pencil : member.username + pencil;
        }
        else {
          change = false;
        }
      }
      if(details.input === '' && change) {
        member.setNick(newName).then(() => {
          bot.sendMessage(details.channelID, {embed: {
            title: 'Success', description: pencil + ' Has been added.', color: info.utility.green}
          });
        }).catch(() => {
          bot.sendMessage(details.channelID, {embed: {
            title: 'Error', description: 'An error occured.', color: info.utility.red}
          });
        })
      }
      else if(change === false) {
        bot.sendMessage(details.channelID, {embed: {
          title: 'Error', description: 'You already have ' + pencil, color: info.utility.red}
        });
      }
    }
  }, requires);
};
