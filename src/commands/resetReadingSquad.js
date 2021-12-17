'use strict';
const Command = require('../structures/Command');

module.exports = function command(requires) {
  return new Command({
    name: 'Reading Squad Reset',
    inline: true,
    alias: ['rsreset'],
    blurb: 'Manually trigger the reading squad reset', 
    longDescription: 'Post a message in the reports channel, clear roles from lapsed users, set new deadline', 
    usages: ['`%rsreset`'], 
    permission: 'low',
    action: async function(details) {
        const {info, bot} = requires;
        try {
          const readingSquad = info.utility.useSource('readingSquad');
          await info.db.removeTimerType('reading');
          await readingSquad.reset();
        } catch (e) {
          await bot.createMessage(details.channelID, {
            embed: {
              title: 'Command resulted in an error',
              color: info.utility.red,
              fields: [
                { name: 'Details', value: e.toString() },
              ],
            }
          });
        }
    }
  }, requires);
};
