'use strict';
const Command = require('../structures/Command');

//For getting bot stats (uptime, servers, etc)
module.exports = function command(requires)
{
  return new Command({
    name: 'Stats',
    inline: true,
    alias: ['s'],
    description: 'Returns stats on the bot.',
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let bObj = requires.bObj;

      let now = new Date();
      const convertDate = function(ms)
      {
        let str = '';
        let x = ms / 1000;
        let seconds = Math.floor(x % 60);
        x /= 60;
        let minutes = Math.floor(x % 60);
        x /= 60;
        let hours = Math.floor(x % 24);
        x /= 24;
        let days = Math.floor(x);
        if(days > 0)
        {
          str += `${days}d`;
        }
        if(hours > 0)
        {
          str += `${hours}h`;
        }
        if(minutes > 0)
        {
          str += `${minutes}m`;
        }
        if(seconds > 0)
        {
          str += `${seconds}s`;
        }
        return str;
      };
      const countUsers = function()
      {
        let num = 0;
        Object.keys(bot.servers).forEach(function(key)
        {
          num += bot.servers[key].member_count;
        });
        return num;
      };
      const getFeathers = function()
      {
        let s = Object.keys(info.feathers).map((key) => 
        {
          return key;
        }).join(', ');
        return s;
      };
      bot.sendMessage(details.channelID, {
        embed: {
          title: `${bot.username}'s Stats`,
          description: '',
          footer: {
            text: 'Created by CyberRonin#5517'
          },
          thumbnail: {
            url: `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp`
          },
          fields:[
            {
              name: 'Servers',
              value: Object.keys(bot.servers).length,
              inline: true
            },
            {
              name: 'Channels',
              value: Object.keys(bot.channels).length,
              inline: true
            },
            {
              name: 'Users',
              value: countUsers(),
              inline: true
            },
            {
              name: 'Commands',
              value: Object.keys(info.commands).length,
              inline: true
            },
            {
              name: 'Uptime',
              value: convertDate(now - bObj.startTime),
              inline: true
            },
            {
              name: 'Discord Server',
              value: 'https://discord.gg/jDpR9PD',
              inline: true
            },
            {
              name: 'About',
              value: info.config.description,
              inline: false
            },
            {
              name: 'Version',
              value: info.config.version,
              inline: true
            },
            {
              name: 'Feathers Loaded',
              value: getFeathers()
            }
          ]
        }
      });
    }
  }, requires);
};
