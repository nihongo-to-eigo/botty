//Feather for getting user info to display nice
'use strict';
module.exports = function feather(requires) {
  //feather obj
  const feather = {};
  
  //requires
  const bot = requires.bot;
  //feather functions
  feather.getInfo = async function(details, uid) {
    let embed = {};

    let user = bot.users.get(uid);
    if (!user) {
      user = await bot.getRESTUser(uid);
    }

    embed.title = user.username + '\'s Info';
    embed.description = '\n _ _';
    embed.thumbnail = {url: getAvatar(uid, user)};
    embed.fields = [];

    const server = bot.guilds.get(details.serverID);
    const member = server && server.members.get(uid);

    if(member) {
      if(member.nick)
        embed.fields.push({name: 'Nickname:', value: member.nick});

      embed.fields.push({name: 'Joined', value: getJoinedTime(member)});
      embed.fields.push({name: 'Created:', value: getCreatedTime(uid)});

      if(member.game)
        embed.fields.push({name: 'Playing:', value: member.game.name});
    }

    return {embed, user};
  };

  //helper functions
  const getCreatedTime = function(uid) {
    let t = (uid / 4194304) + 1420070400000;
    let created = new Date(t);
    return `${created.toUTCString()}`;
  };
  const getJoinedTime = function(member) {
    let d = new Date(member.joinedAt);
    return `${d.toUTCString()}`;
  };
  const getAvatar = function(uid, user) {
    let ava = undefined;
    let userAva = user.avatar;
    if(userAva === null) return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator, 10) % 5}.png`;
    if(userAva.startsWith('a_')) {
      ava = 'https://cdn.discordapp.com/avatars/' +uid+'/'+userAva+'.gif';
    } else {
      ava = 'https://cdn.discordapp.com/avatars/' +uid+'/'+userAva+'.webp';
    }
    return ava;
  };

  return feather;
};
