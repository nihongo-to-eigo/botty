'use strict';
const Command = require('../structures/Command');

//command to warn users
module.exports = function command(requires)
{
  return new Command({
    name: 'Warn',
    inline: true,
    alias: ['w'],
    description: 'Warns people.',
    permission: 'low',
    action: function(details)
    {
      const bot = requires.bot;
      const info = requires.info;
      const wholeTest = /<\@!*([a-zA-Z0-9]+)>\s\w.+/g;
      const idAndSpace = /<\@!*([a-zA-Z0-9]+)>\s/g;
      //processes input
      if(details.input === "") {return;}
      else
      {
        if(!wholeTest.test(details.input)) {
          return;
        } else {
          const userTest = info.utility.stripUID(details.args[1]);
          if(userTest) {
            const reason = details.input.replace(idAndSpace, '');
            info.db.addInfraction(userTest, 'warn', new Date, reason);
            bot.createMessage(details.channelID,{content:`${details.args[1]}, you have been warned for: ${reason}`});
          }

        }
      }
    }
  }, requires);
};
