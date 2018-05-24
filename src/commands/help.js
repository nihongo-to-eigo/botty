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
      //concatenates an array to one line
      const concatArr = function(arr)
      {
        let s = '';
        for(let i = 0; i < arr.length; i++)
        {
          if(arr[i] != null)
          {
            if(i == (arr.length - 1))
            {
              s += details.prefix + arr[i];
            }
            else
            {
              s += details.prefix + arr[i] + ', ';
            }
          }
        }
        return s;
      };

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
        field.name = `${details.prefix}${command}, ${concatArr(info.commands[command].getAlias())}`;
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
