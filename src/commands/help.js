'use strict';
const Command = require('../structures/Command');

//Help command
module.exports = function command(requires)
{
  return new Command({
    inline: true,
    alias: ['?'],
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

      let commLen = Object.keys(info.commands).length;
      Object.keys(info.commands).forEach((command,index) =>
      {
        let field = {};
        //Looks to see if it's an admin comand. If it is, don't display the info.
        if(info.commands[command].getPerm() === 'private' && !details.isAdministrator)
        {
          return;
        }
        //create the entry in the embed
        let prefix = info.config.prefix;
        let aliases = prefix + info.commands[command].getAlias().join(', ' + prefix);      
        field.name = `${prefix}${command}, ${aliases}`;
        field.value = info.commands[command].getDesc();
        field.inline = info.commands[command].inline;
        emb.fields.push(field);
        //seeeeend it once all of the commands are iterated through
        if(index === commLen - 1)
        {
          bot.sendMessage(details.channelID, {
            embed: emb
          });
        }
      });
    }
  }, requires);
};
