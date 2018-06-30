'use strict';
const Command = require('../structures/Command');

//command to enable selectable roles
module.exports = function command(requires)
{
  return new Command({
    name: 'Set Roles',
    inline: true,
    alias: ['sr'],
    description: 'Sets available user roles.',
    permission: 'custom',
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
                let remEmb = {};
                remEmb.title = 'Removed';
                remEmb.description = `You have removed the __${details.input}__ role for the user selectable roles`;
                remEmb.color = info.utility.red;
                bot.sendMessage(details.channelID, {embed: remEmb});
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
