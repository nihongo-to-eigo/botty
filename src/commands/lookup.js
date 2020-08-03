'use strict';
const Command = require('../structures/Command');

//Searching japanese-english dictionary
module.exports = function command(requires)
{
  return new Command({
    name: 'Lookup',
    inline: false,
    alias: ['l'],
    blurb: 'Looks up word using Skurt.me API',
    longDescription: 'Searches Skurt.me API for word definitions. Can search with both English and Japanese input, the interpretation of the input is left for jisho. \nBy default this returns the first result only, which may not always be what you want. You can grab results further down the list by adding a number after the word. You can get a list of results by adding `--list`. \nThis is especially useful when searching English words, as often the top result may not be what you actually want',
    usages: ['`%prefixlookup {word}` ― Returns top result for this word in the dictionary', '`%prefixlookup {word} --list` ― Returns a list of results from this lookup', '`%prefixlookup {word} {number}` ― Return {number}th result for this word'],
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let lookup = info.utility.useSource('lookupAPI');

      const searchLookup = function(w,n)
      {
        lookup.searchLookup(w,n).then((emb) =>
        {
          console.log(emb);
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

      const listLookup = function (w) {
        lookup.listLookup(w).then((emb) => {
          console.log(emb);
          bot.createMessage(details.channelID, {
            embed: emb
          })
        }).catch((err) => {
          bot.createMessage(details.channelID, {
            embed: {
              title: 'Error',
              description: err
            }
          });
        });
      }
      //processes the command
      //to better understand this part, take a look at the parameters at the top of the page
      if(details.input === '') {return;}
      else if(details.input.search(/.+\s(--list)/g) != -1) {
        listLookup(details.input.replace(' --list', ''));
        return;
      } else if(details.input.search(/^.+\s[1-9][0-9]*$/g) != -1) {
        let patt = /[1-9][0-9]*$/g;
        let num = parseInt(patt.exec(details.input),10);
        searchLookup(details.input.replace(/\s[1-9][0-9]*/g, ''),num - 1);
        return;
      }
      else
      {
        searchLookup(details.input, 0);
        return;
      }
    }
  }, requires);
};
