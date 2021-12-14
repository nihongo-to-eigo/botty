'use strict';
const Command = require('../structures/Command');

//For retrieving kanji readings, meanings, etc.
module.exports = function command(requires) {
  return new Command({
    name: 'Kanji',
    inline: true,
    alias: ['k'],
    blurb: 'Looks up kanji information.',
    longDescription: 'Retrieves kanji data from kanjidic2. \n Gets info such as kanji meaning, readings, radical, composing elements, and JLPT level.',
    usages: ['`%prefixkanji {kanji}` ― Returns info on {kanji}'],
    permission: 'public',
    action: async function(details) {
      let bot = requires.bot;
      let info = requires.info;
      let kanji = info.utility.useSource('kanjiAPI');

      const searchKanji = function(k) {
        kanji.searchKanji(k).then((emb) => {
          bot.createMessage(details.channelID, {embed: emb}); 
        }).catch((err) => {
          if(err.statusCode === 204) {
            bot.createMessage(details.channelID, {
              embed: {
                title: 'Error',
                description: 'No content found, please make sure you only use one kanji at a time. Also, try to not have extra whitespace or spaces.',
                color: info.utility.red
              }
            });
          } else {
            bot.createMessage(details.channelID, {
              embed: {
                title: 'Error',
                description: 'An error occurred, if it persists please contact CyberRonin!'
              }
            });
          }

        });
      };

      if(details.input === '')
        return;
      
      await bot.sendChannelTyping(details.channelID);
      searchKanji(details.args[1]);
    }
  }, requires);
};
