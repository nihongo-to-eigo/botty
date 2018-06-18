'use strict';
const Command = require('../structures/Command');

//command to test role stuff
module.exports = function command(requires)
{
  return new Command({
    name: 'Test Role',
    inline: true,
    alias: ['tr'],
    description: 'Tests role things',
    permission: 'private',
    action: function(details)
    {
      const bot = requires.bot;
      const info = requires.info;

      //processes input
      if(details.input === "") {return;}
      else
      {
        info.utility.getRoleByName(details.serverID, details.input).then((roleID) =>
        {
          console.log(roleID);
          info.db.addRole(roleID, details.input).then((dbrole) =>
          {
            let emb = {};
            emb.title = 'Success';
            emb.description = `You have added the __${details.input}__ role to the user selectable roles.`;
            emb.color = info.utility.green;
            bot.sendMessage(details.channelID, {embed: emb});
          }).catch((err) =>
          {
            if(err.errorType === 'uniqueViolated')
            {
              info.db.removeRoleByID(roleID).then((numRemoved) => {
                bot.sendMessage(details.channelID, {embed: {title: 'Removed', description: `You have removed the __${details.input}__ role fro the user selectable roles`,
                color: info.utility.red}});
                console.log(numRemoved);
              }).catch((err) => {
                console.log(err);
              })
            }
            console.log(err.errorType);
          })
        }).catch((err) =>
        {
          console.log(err);
        });
      }
    }
  }, requires);
};
