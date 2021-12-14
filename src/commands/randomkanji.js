'use strict';
const Command = require('../structures/Command');

//For retrieving kanji readings, meanings, etc.
module.exports = function command(requires) {
  return new Command({
    name: 'Random Kanji',
    inline: true,
    alias: ['rk'],
    blurb: 'Gets info on random kanji.',
    usages: ['`%prefixrk`'],
    permission: 'public',
    action: async function(details) {
      let bot = requires.bot;
      let info = requires.info;
      let kanji = info.utility.useSource('kanjiAPI');

      const randomKanji = function() {
        kanji.randomKanji().then((emb) => {
          bot.createMessage(details.channelID, {embed: emb}); 
        }).catch((err) => {
          bot.createMessage(details.channelID, {
            embed: {
              title: 'Error',
              description: JSON.stringify(err)
            }
          });
        });
      };

      if(details.input === '') {
        await bot.sendChannelTyping(details.channelID);
        randomKanji();
      }
    }
  }, requires);
};
