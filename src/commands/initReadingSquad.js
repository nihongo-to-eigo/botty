'use strict';
const Command = require('../structures/Command');

//Adds a pencil at the end of your nickname or username.
module.exports = function command(requires)
{
  return new Command({
    name: 'InitReadingSquad',
    inline: true,
    alias: ['squadup'],
    blurb: 'Set up reading squad deadline',
    longDescription: 'Schedules the first deadline for the Reading Squad. Future deadlines will be scheduled automatically.',
    usages: ['`%prefixsquadup`'],
    permission: 'low',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let readingSquad = info.utility.useSource('readingSquad');

      info.db.countTimers('reading').then(count => {
        if (count == 0) {
          const deadline = readingSquad.setUpcomingDeadline();
          bot.createMessage(details.channelID, {embed: {
            title: 'Success', description: `Reading Squad deadline set to ${deadline.toUTCString()}`}
          });
        }
        else {
          bot.createMessage(details.channelID, {embed: {
            title: 'Error', description: 'Reading squad deadline is already set', color: info.utility.red}
          });
        }
      });
    }
  }, requires);
};
