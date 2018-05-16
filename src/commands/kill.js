'use strict';
const Command = require('../structures/Command');

//Kills the bot, just in case it's acting up ;)
module.exports = function command(requires)
{
  return new Command({
    inline: true,
    alias: ['ki'],
    description: 'Kills the bot',
    permission: 'private',
    action: function(details)
    {
      requires.bObj.kill();
    }
  }, requires);
};
