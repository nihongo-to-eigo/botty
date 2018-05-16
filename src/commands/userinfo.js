'use strict';
const Command = require('../structures/Command');

//For getting user information (account creation date, server join date, etc.)
module.exports = function command(requires)
{
  return new Command({
    name: 'User Info',
    inline: false,
    alias: ['ui'],
    description: '[<mention user>]Gets information for a user that is mentioned, or the person that used the command. If there is no mention, then it will get the information of the person who used the command.',
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      
      const getInfo = function(uid)
      {
        let emb = {};
        emb.title = bot.users[uid].username + "'s Info";
        emb.description = '\n _ _';
        let server = bot.servers[details.serverID];
        let extras = false;
        if(server != undefined)
        {
          extras = true;
        }
        let thumbnail = {url: getAvatar(uid)};
        emb.thumbnail = thumbnail;

        let fields = [];

        if(extras)
        {
          emb.color = bot.servers[details.serverID].members[uid].color;
          if(bot.servers[details.serverID].members[uid].nick)
          {
            let nickname = {name: "Nickname:", value: bot.servers[details.serverID].members[uid].nick};
            fields.push(nickname);
          }          
          let joined = {name: "Joined", value: getJoinedTime(uid)};
          fields.push(joined);
        }

        let created = {name: "Created:", value: getCreatedTime(uid)};
        fields.push(created);
        if(bot.users[uid].game != null)
        {
          let playing = {name: 'Playing:', value: bot.users[uid].game.name};
          fields.push(playing);
        }

        emb.fields = fields;
        return emb;
      };
      const getCreatedTime = function(uid)
      {
        let t = (uid / 4194304) + 1420070400000;
        let created = new Date(t);
        return `${created.toUTCString()}`;
      };
      const getJoinedTime = function(uid)
      {
        let d = new Date(bot.servers[details.serverID].members[details.userID].joined_at);
        let localOffset = 5 * 60000;
        let utc = d.getTime() + localOffset;
        let dUTC = new Date(utc);
        return `${d.toUTCString()}`;
      };
      const getAvatar = function(uid)
      {
        let ava = undefined;
        if(bot.users[uid].avatar.startsWith('a_'))
        {
          ava = 'https://cdn.discordapp.com/avatars/' +uid+'/'+bot.users[uid].avatar+'.gif';
        }
        else
        {
          ava = 'https://cdn.discordapp.com/avatars/' +uid+'/'+bot.users[uid].avatar+'.webp';
        }
        return ava;
      };
      if(details.input === '')
      {
        bot.sendMessage(details.channelID, {
          embed: getInfo(details.userID)
        });
      }
      else if(details.args.length == 2)
      {
        let uid = info.utility.stripUID(details.args[1]);
        if(uid)
        {
          let link = getAvatar(uid);
          if(link.includes('null.jpg'))
          {
            bot.sendMessage(details.channelID, {
              message: 'The user has a default avatar.'
            });
          }
          else
          {
            bot.sendMessage(details.channelID, {
              embed: getInfo(uid)
            });
          }
        }
      }
      else
      {
        bot.sendMessage(details.channelID, {
          message: 'Please look at the help menu to see how to properly use the command.'
        });
      }
    }
  }, requires);
};
