const Command = require('../structures/Command');

//command to warn users
module.exports = function command(requires) {
  return new Command({
    name: 'Warn',
    inline: true,
    alias: ['w'],
    blurb: 'Warns people.',
    longDescription: 'Warns a user and adds to their infraction count for their rapsheet',
    usages: ['`%prefixw {user} {reason}`'],
    permission: 'low',
    action: async function(details) {
      const bot = requires.bot;
      const info = requires.info;
      const wholeTest = /(?:<@!*)?([a-zA-Z0-9]+)(?:>)?\s([一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[a-zA-Z0-9]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤]+|.+)+/g;
      const idAndSpace = /(?:<@!*)?([a-zA-Z0-9]+)(?:>)?\s/g;
      
      if(details.input === ''
          || !wholeTest.test(details.input)
          || !(info.utility.stripUID(details.args[1]))
      ) {
        await bot.createMessage(details.channelID, {
          embed: {
            description: 'Failed to parse command. Please try again',
            color: info.utility.red,
          }
        });
      } else {
        const userTest = info.utility.stripUID(details.args[1]);
        if(userTest) {
          const reason = details.input.replace(idAndSpace, '');
          info.db.addInfraction(userTest, 'warn', new Date, reason);
            
          bot.createMessage(details.channelID,{content:`<@${details.args[1]}>, you have been warned for: ${reason}`});

          bot.createMessage(info.settings.private_log_channel, {
            embed: {
              title: 'Log',
              fields: [
                {name: 'User', value: details.args[1]},
                {name: 'Action', value: 'warn'},
                {name: 'Reason', value: reason},
                {name: 'Message Link', value: details.link},
                {name: 'Responsible Mod', value: `<@${details.userID}>`},
              ]
            }
          });
        }
      }
    }
  }, requires);
};
