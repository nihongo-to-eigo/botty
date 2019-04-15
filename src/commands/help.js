'use strict';
const Command = require('../structures/Command');

//Help command
module.exports = function command(requires)
{
  return new Command({
    name: 'Help',
    inline: true,
    alias: ['?', 'h'],
    description: 'Brings up this menu.',
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let emb = {};
      emb.fields = [];
      emb.title = 'Help';
      emb.description = "You can DM the bot :heart:";

      Object.keys(info.commands).forEach((command,index) =>
      {
        let field = {};
        //Looks to see if it's an admin comand. If it is, don't display the info.
        if(info.commands[command].getPerm() === 'private' && !details.isAdministrator)
        {
          return;
        } else if(info.commands[command].getPerm() === 'high' && (!details.isAdministrator && details.permissionLevel !== 'high')) {
          return;
        } else if(info.commands[command].getPerm() === 'low' && (!details.isAdministrator && details.permissionLevel !== 'high' && details.permissionLevel !== 'low')) {
          return;
        }
        //create the entry in the embed
        let prefix = info.config.prefix;
        let aliases = prefix + info.commands[command].getAlias().join(', ' + prefix);      
        field.name = `${prefix}${command}, ${aliases}`;
        field.value = info.commands[command].getDesc();
        field.inline = info.commands[command].inline;
        emb.fields.push(field);
      });
      
      //seeeeend it once all of the commands are iterated through
      bot.createMessage(details.channelID, {
        embed: emb
      });     
    }
  }, requires);
};
