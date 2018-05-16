'use strict';
const Command = require('../structures/Command');

//For retrieving kanji readings, meanings, etc.
module.exports = function command(requires)
{
  return new Command({
    inline: true,
    alias: ['k'],
    description: '<kanji> , Looks up kanji information.',
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let kanji = info.utility.useSource('kanjiAPI');

      const searchKanji = function(k)
      {
        kanji.searchKanji(k).then((emb) =>
        {
          bot.sendMessage(details.channelID, {
            embed: emb,
          }); 
        }).catch((err) =>
        {
          bot.sendMessage(details.channelID, {
            embed: {
              title: 'Error',
              description: err
            }
          });
        });
      };

      if(details.input === "") {return;}
      else
      {
        searchKanji(details.args[1]);
      }
    }
  }, requires);
};
