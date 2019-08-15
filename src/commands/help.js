'use strict';
const Command = require('../structures/Command');

//Help command
module.exports = function command(requires)
{
  return new Command({
    name: 'Help',
    inline: true,
    alias: ['?', 'h'],
    blurb: 'See usage details for commands with `!help <command>` or bring up a list of available commands',
    longDescription: '',
    usages: ['`!help` ― Shows list of commands with short descriptions', '`!help {command}` ― Shows full help message for a specific command'],
    permission: 'public',
    action: function(details)
    {
      let bot = requires.bot;
      let info = requires.info;
      let utility = info.utility;
      let emb = {};
      emb.fields = [];
      emb.title = 'Help';
      emb.description = "You can DM the bot :heart:";
      
      const listCommands = function()
      {
        emb.title = 'Help';
        emb.blurb = "You can DM the bot :heart:";
        Object.keys(info.commands).forEach((commandName,index) => {
          let command = info.commands[commandName];
          let commandLevel = command.getPerm();
          // details.permissionLevel should have the user's permission level
          // see bot.js `processCommand`         
          if(!utility.hasPermission(commandLevel, details.permissionLevel)) {
            return;
          }
          //create the entry in the embed
          let prefix = info.config.prefix;
          let aliases = prefix + command.getAlias().join(', ' + prefix);
          let field = {};
          field.name = `${prefix}${commandName}, ${aliases}`;
          field.value = command.blurb;
          field.inline = false; //info.commands[command].inline;
          emb.fields.push(field);
        });
        //seeeeend it once all of the commands are iterated through
        bot.createMessage(details.channelID, {
          embed: emb
        });     
      };
      
      const sendDetails = function(commandName)
      {
        let command = utility.getCommand(commandName);
        if(command == null
           || !utility.hasPermission(command.getPerm(), details.permissionLevel)) {
          bot.createMessage(details.channelID, {
            embed: {
              title: 'No Such Command',
              description: 'Command could not be found or you do not have permission to use this command'
            }            
          });
        } else {
          emb.title = 'Info: ' + command.name;
          emb.description = command.blurb;
          let fieldIdx = 0;
          if(command.longDescription != '') {       
            emb.fields[field] = {
              name: 'Description:',
              value: command.longDescription
            };
            fieldIdx += 1;
          };
          if(command.usages) {
            emb.fields[fieldIdx] = {
              name: 'Usages:',
              value: command.usages.join('\n')
            };            
          }
          bot.createMessage(details.channelID, {
            embed: emb
          });
        }
      };

      if(details.input === '') {
        listCommands();
      } else {
        sendDetails(details.input);
      }      
    }
  }, requires);
};
