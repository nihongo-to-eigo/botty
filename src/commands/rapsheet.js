'use strict';
const Command = require('../structures/Command');

//command to get a users infractions
module.exports = function command(requires)
{
  return new Command({
    name: 'Rapsheet',
    inline: true,
    alias: ['rs'],
    description: 'Get\'s a user\'s infractions.',
    permission: 'low',
    action: function(details)
    {
      const bot = requires.bot;
      const info = requires.info;
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
      function processInfractions(infractions, id) {
        const len = infractions.length;
        const user = bot.users.get(id);
        const lastFive = len - 5;
        let warns = 0, mutes = 0;
        let emb = {};
        emb.fields = [];
        let lastInfractions = {name: 'Latest infractions'};
        let lastFiveInfractions = [];
        infractions.forEach((infraction, index) => {
          if(infraction.type === 'mute') {
            mutes ++;
          } else if(infraction.type === 'warn') {
            warns ++;
          }
          if(index >= lastFive) {
            lastFiveInfractions.push(`${infraction.type}: ${infraction.reason} - ${infraction.time.toUTCString()}`);
          }
        });
        lastInfractions.value = lastFiveInfractions.join('\n');
        emb.title = `${user.username}'s Rapsheet`;
        emb.fields.push({name: 'Mute(s)', value: mutes, inline: true});
        emb.fields.push({name: 'Warn(s)', value: warns, inline: true});
        emb.fields.push(lastInfractions);
        emb.thumbnail = {url: getAvatar(id)};
        emb.color = 0xFF0000;
        return emb;
      }

      //processes input
      if(details.input === "") {return;}
      else {
        if(details.args.length === 2) {
          const userTest = info.utility.stripUID(details.args[1]);
          if(userTest) {
            info.db.getInfractions(userTest, userTest).then(stuff => {
              if(stuff === null) {
                bot.createMessage(details.channelID, {content: 'The user has no infractions.'});
              } else {
                bot.createMessage(details.channelID, {embed: processInfractions(stuff.infractions, userTest)});
              }
              
            })
          }
        }
      }
    }
  }, requires);
};
