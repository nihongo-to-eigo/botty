'use strict';
const Command = require('../structures/Command');

//Kills the bot, just in case it's acting up ;)
module.exports = function command(requires)
{
  return new Command({
    name: 'Jisho',
    inline: false,
    alias: ['j'],
    description: '[<word/sentence>, <word/sentence> --list, <word/sentence> <number from --list>] Looks up a word from Jisho.org, you may use jisho <word> --list to get a list of definitions. Then use jisho <word> <number> and that will display the definition',
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
      const listJisho = function(w)
      {
        jisho.listJisho(w, details.isDirectMessage).then((data) =>
        {
          if(data.shouldDM)
          {
            bot.sendMessage(details.channelID, {
              embed: {
                title: 'Too Many Results',
                description: 'There were more than 10 results, sent results via DM.'
              }
            });
            bot.sendMessage(details.userID, {
              embed: data.embed
            });
          }
          else
          {
            bot.sendMessage(details.channelID, {
              embed: data.embed
            });
          }
        }).catch((err) =>
        {
          bot.sendMessage(details.channelID, {
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
      else if(details.input.search(/.+\s(--list)/g) != -1)
      {
        listJisho(details.input.replace(' --list', ''));
        return;
      }
      else if(details.input.search(/^.+\s[1-9][0-9]*$/g) != -1)
      {
        let patt = /[1-9][0-9]*$/g;
        let num = parseInt(patt.exec(details.input),10);
        console.log('Num is ' + num + ' details is ' + details.input);
        console.log('Searching for ' + details.input.replace(/\s[1-9][0-9]*/g, ''));
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
