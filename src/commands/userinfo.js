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
        emb.title = bot.users.get(uid).username + "'s Info";
        emb.description = '\n _ _';
        let server = bot.guilds.get(details.serverID);
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
          emb.color = bot.guilds.get(details.serverID).members.get(uid).color;
          if(bot.guilds.get(details.serverID).members.get(uid).nick)
          {
            let nickname = {name: "Nickname:", value: bot.guilds.get(details.serverID).members.get(uid).nick};
            fields.push(nickname);
          }          
          let joined = {name: "Joined", value: getJoinedTime(uid)};
          fields.push(joined);
        }

        let created = {name: "Created:", value: getCreatedTime(uid)};
        fields.push(created);
        if(bot.users.get(uid).game != null)
        {
          let playing = {name: 'Playing:', value: bot.users.get(uid).game.name};
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
        let d = new Date(bot.guilds.get(details.serverID).members.get(uid).joinedAt);
        let localOffset = 5 * 60000;
        let utc = d.getTime() + localOffset;
        let dUTC = new Date(utc);
        return `${d.toUTCString()}`;
      };
      const getAvatar = function(uid)
      {
        let ava = undefined;
        let userAva = bot.users.get(uid).avatar;
        if(userAva === null) return `https://cdn.discordapp.com/embed/avatars/${parseInt(bot.users.get(uid).discriminator, 10) % 5}.png`
        if(userAva.startsWith('a_'))
        {
          ava = 'https://cdn.discordapp.com/avatars/' +uid+'/'+userAva+'.gif';
        }
        else
        {
          ava = 'https://cdn.discordapp.com/avatars/' +uid+'/'+userAva+'.webp';
        }
        return ava;
      };
      if(details.input === '')
      {
        bot.createMessage(details.channelID, {
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
            bot.createMessage(details.channelID, {
              message: 'The user has a default avatar.'
            });
          }
          else
          {
            bot.createMessage(details.channelID, {
              embed: getInfo(uid)
            });
          }
        }
      }
      else
      {
        bot.createMessage(details.channelID, {
          message: 'Please look at the help menu to see how to properly use the command.'
        });
      }
    }
  }, requires);
};
