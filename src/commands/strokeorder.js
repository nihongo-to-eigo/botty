'use strict';
const Command = require('../structures/Command');

//For retrieving kanji stroke orders
module.exports = function command(requires)
{
  return new Command({
    name: 'Stroke Order',
    inline: true,
    alias: ['so'],
    description: '<kanji> , Looks up kanji stroke order',
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let kanji = info.utility.useSource('strokeAPI');

      const searchKanji = function(k)
      {
        kanji.searchKanji(k).then((file) =>
        {
          bot.uploadFile(details.channelID, file, {
            fileName: 'strokes.gif',
          }); 
        }).catch((err) =>
        {
          bot.sendMessage(details.channelID, {
            embed: {
              title: 'Error',
              description: 'Kanji not found.',
              color: info.utility.red
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
