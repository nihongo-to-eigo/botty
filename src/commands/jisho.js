'use strict';
const Command = require('../structures/Command');

//Searching japanese-english dictionary
module.exports = function command(requires)
{
  return new Command({
    name: 'Jisho',
    inline: false,
    alias: ['j'],
    blurb: 'Looks up word using Jisho API',
    longDescription: 'Searches [Jisho](jisho.org) API for word definitions. Can search with both English and Japanese input, the interpretation of the input is left for jisho. \nBy default this returns the first result only, which may not always be what you want. You can grab results further down the list by adding a number after the word. You can get a list of results by adding `--list`. \nThis is especially useful when searching English words, as often the top result may not be what you actually want',
    usages: ['`%prefixjisho {word}` ― Returns top result for this word in the dictionary', '`%prefixjisho {word} --list` ― Returns a list of results from this lookup', '`%prefixjisho {word} {number}` ― Return {number}th result for this word'],
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let jisho = info.utility.useSource('jishoAPI');

      const searchJisho = function(w,n)
      {
        jisho.searchJisho(w,n).then((emb) =>
        {
          bot.createMessage(details.channelID, {
            embed: emb,
          }); 
        }).catch((err) =>
        {
          bot.createMessage(details.channelID, {
            embed: {
              title: 'Error',
              description: err
            }
          });
        });
      };
      const listJisho = function(w)
      {
        jisho.listJisho(w, details.isDirectMessage).then((data) =>
        {
          if(data.shouldDM)
          {
            bot.createMessage(details.channelID, {
              embed: {
                title: 'Too Many Results',
                description: 'There were more than 10 results, sent results via DM.'
              }
            });
            bot.getDMChannel(details.userID).then(privChannel => {
              privChannel.createMessage({
                embed: data.embed
              });
            });
          }
          else
          {
            bot.createMessage(details.channelID, {
              embed: data.embed
            });
          }
        }).catch((err) =>
        {
          bot.createMessage(details.channelID, {
            embed: {
              title: 'Error',
              description: err
            }
          });
        });
      };
      //processes the command
      //to better understand this part, take a look at the parameters at the top of the page
      if(details.input === '') {return;}
      else if(details.input.search(/.+\s(--list)/g) != -1)
      {
        listJisho(details.input.replace(' --list', ''));
        return;
      }
      else if(details.input.search(/^.+\s[1-9][0-9]*$/g) != -1)
      {
        let patt = /[1-9][0-9]*$/g;
        let num = parseInt(patt.exec(details.input),10);
        searchJisho(details.input.replace(/\s[1-9][0-9]*/g, ''),num - 1);
        return;
      }
      else
      {
        searchJisho(details.input, 0);
        return;
      }
    }
  }, requires);
};
