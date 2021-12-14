'use strict';
const Command = require('../structures/Command');

//Kills the bot, just in case it's acting up ;)
module.exports = function command(requires) {
  return new Command({
    name: 'Reading Squad Reset',
    inline: true,
    alias: ['rsreset'],
    blurb: 'Manually trigger the reading squad reset', 
    longDescription: 'Post a message in the reports channel, clear roles from lapsed users, set new deadline', 
    usages: ['`%rsreset`'], 
    permission: 'low',
    action: async function() {
        const {info} = requires;
        const readingSquad = info.utility.useSource('readingSquad');
        await info.db.removeTimerType('reading');
        await readingSquad.reset();
    }
  }, requires);
};
