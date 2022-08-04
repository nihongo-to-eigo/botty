'use strict';
const Command = require('../structures/Command');

//command to mute w/time
module.exports = function command(requires) {
  return new Command({
    name: 'On-Topic',
    inline: true,
    alias: ['ot'],
    blurb: 'Self-applies the on-topic role.',
    longDescription: 'Self-applies the on-topic role, hiding the off-topic channel, for a given amount of time. Allowed times are (m - minutes, h - hours, d - days)',
    usages: ['`%prefixot {time}`'],
    permission: 'public',
    action: async function(details) {
      const bot = requires.bot;
      const info = requires.info;
      const timeReg = /\d+(d|m|h)/g;

      if(details.input === ''
          || !timeReg.test(details.input)
          || !(details.userID)
      ) {
        await bot.createMessage(details.channelID, {
          embed: {
            description: 'Failed to parse command. Please try again',
            color: info.utility.red,
          }
        });
      } else {
        timeReg.lastIndex = 0; 
        const test = timeReg.exec(details.args[1]);
        const userTest = details.userID;
        if(userTest) {
          if(test !== null) {
            const amount = parseInt(test[0].replace(test[1], ''));
            let termEnd = new Date;
            switch(test[1]) {
            case 'm':
              termEnd.setMinutes(termEnd.getMinutes() + amount);
              break;
            case 'h':
              termEnd.setHours(termEnd.getHours() + amount);
              break;
            case 'd':
              termEnd.setDate(termEnd.getDate() + amount);
              break;
            }

            info.db.addTimer(userTest, 'ontop', termEnd);
              
            bot.createMessage(details.channelID, {content: `On-topic role applied until ${termEnd.toUTCString()}`});
              
            const user = bot.guilds.get(info.settings.home_server_id).members.get(userTest);
            const ontopRole = info.settings.ontop_role_id;
            if(user && ontopRole) {
              try {
                await user.addRole(ontopRole);
              } catch (e) {
                await bot.createMessage(info.settings.info_log_channel, {
                  embed: {
                    title: 'On-topic role could not be added',
                    color: info.utility.red,
                    fields: [
                      {name: 'User', value: `<@${user.id}>`},
                      {name: 'Details', value: e.toString()},
                      {name: 'Role ID', value: ontopRole}
                    ],
                  }
                });
              }
            }
          }
        }
      }
    }
  }, requires);
};
