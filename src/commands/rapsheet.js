'use strict';
const Command = require('../structures/Command');

//command to get a users infractions
module.exports = function command(requires) {
  return new Command({
    name: 'Rapsheet',
    inline: true,
    alias: ['rs'],
    blurb: 'Get\'s a user\'s infractions.',
    permission: 'low',
    action: async function(details) {
      const bot = requires.bot;
      const info = requires.info;
      await bot.sendChannelTyping(details.channelID);
      
      const userFeather = info.utility.useSource('user');
      function processInfractions(infractions) {
        const len = infractions.length;
        const lastFive = len - 5;
        let warns = 0, mutes = 0;
        let fields = [];
        let lastInfractions = {name: 'Latest infractions'};
        let lastFiveInfractions = [];
        infractions.forEach((infraction, index) => {
          if(infraction.type === 'mute') {
            mutes ++;
          } else if(infraction.type === 'warn') {
            warns ++;
          }
          if(index >= lastFive) {
            lastFiveInfractions.push(`${infraction.type}: ${infraction.reason} - ${infraction.time.toUTCString()}`);
          }
        });
        lastInfractions.value = lastFiveInfractions.join('\n');
        fields.push({name: 'Mute(s)', value: mutes, inline: true});
        fields.push({name: 'Warn(s)', value: warns, inline: true});
        fields.push(lastInfractions);
        return fields;
      }
      //processes input
      if(details.input === '') {
        return;
      } else {
        if(details.args.length === 2) {
          const userTest = info.utility.stripUID(details.args[1]);
          if(userTest) {
            const { embed, user } = await userFeather.getInfo(details, userTest);
            const stuff = await info.db.getInfractions(userTest, userTest);

            if(stuff === null) {
              bot.createMessage(details.channelID, { embed });
            } else {
              embed.fields = processInfractions(stuff.infractions, userTest).concat(embed.fields);
              embed.color = 0xFF0000;
              embed.title = `${user.username}'s Rapsheet`;
              bot.createMessage(details.channelID, {embed: embed});
            }
          }
        }
      }
    }
  }, requires);
};
