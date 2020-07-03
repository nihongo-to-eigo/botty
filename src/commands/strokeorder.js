'use strict';
const Command = require('../structures/Command');

//For retrieving kanji stroke orders
module.exports = function command(requires)
{
  return new Command({
    name: 'Stroke Order',
    inline: true,
    alias: ['so'],
    blurb: 'Shows the stroke order of a kanji (animated)',
    longDescription: 'Shows animated stroke order image of given kanji. Also works on kana and some other miscellaneous Japanese characters.',
    usages: ['`%prefixso {kanji}` ― Returns stroke order of {kanji}.'],
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
          bot.createMessage(details.channelID, {
            embed: {title: k, description: 'Stroke Order Gif', image: {url: 'attachment://stroke.gif'}},
          },{
            file,
            name: 'stroke.gif'
          }); 
        }).catch((err) =>
        {
          bot.createMessage(details.channelID, {
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
