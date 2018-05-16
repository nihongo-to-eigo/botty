'use strict';
const Command = require('../structures/Command');

//Kills the bot, just in case it's acting up ;)
module.exports = function command(requires)
{
  return new Command({
    inline: true,
    alias: ['ev'],
    description: 'Evaluates JS code',
    permission: 'private',
    action: function(details)
    {
      let bot = requires.bot;
      
      const echo = function(str)
      {
        bot.sendMessage(details.channelID, {
          message: str
        });
      };
      if(details.input === '') {return;}
      else
      {
        try
        {
          bot.sendMessage(details.channelID, {
            message: eval(details.input)
          });
        }
        catch(err)
        {
          bot.sendMessage(details.channelID, {
            message: err
          });
        }
      }
    }
  }, requires);
};