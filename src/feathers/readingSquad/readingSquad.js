//Feather for reading squad services
'use strict';

module.exports = function feather(requires)
{
  //feather obj
  const feather = {};
  
  //requires
  const {bot, info} = requires;
  let squadRole, reportsChannel;

  //feather functions
  feather.onReady = async function() {
    if (info.settings == null)
      return;
      
    squadRole = info.settings.reading_squad_role_id;
    reportsChannel = info.settings.reading_reports_channel;

    if (squadRole != null && reportsChannel != null) {
      bot.on('messageReactionAdd', onReadingReportReaction.bind(this));

      const count = await info.db.countTimers('reading');
      if (count === 0)
        await feather.setUpcomingDeadline();
    }
  };

  feather.reset = async function() {
    await postResetMessage();
    const expiredMembers = await getMembersToClear();
    await clearRoles(expiredMembers);
    await info.db.clearReadingSquad();
    await feather.setUpcomingDeadline();
  };

  feather.approve = async function(member, user) {
    if (!member) {
      await bot.createMessage(info.settings.info_log_channel, {
        embed: {
          title: 'Reading report approval failed',
          fields: [{ name: 'Details', value: 'User is no longer in the server' }, {name: 'User', value: `<@${user ? user.id : ''}>`}],
          color: info.utility.red
        }
      });
      return false;
    }
    
    try {
      if (!member.roles.includes(squadRole))
        await member.addRole(squadRole, 'Reading report approved');

      await info.db.addToReadingSquad(member.id);
      
      await bot.createMessage(info.settings.info_log_channel, {
        embed: {
          title: 'Reading report approved',
          fields: [{name: 'User', value: `<@${member.id}>`}],
          color: info.utility.readingSquadCoolBlue
        }
      });

      return true;
    } catch (e) {
      await bot.createMessage(info.settings.info_log_channel, {
        embed: {
          title: 'Reading report approval failed',
          fields: [{name: 'User', value: `<@${member.id}>`}, { name: 'Details', value: e.toString() }],
          color: info.utility.red
        }
      });

      return false;
    }
  };

  feather.setUpcomingDeadline = async function() {
    const deadline = getUpcomingDeadline();
    await info.db.addTimer(null, 'reading', deadline);
    return deadline;
  };

  //helper functions
  function postResetMessage() {
    return bot.createMessage(reportsChannel, {
      embed: {
        title: 'It is now Tuesday 00:00 JST (Monday 15:00 UTC), which means a new week has started.',
        description: 'Anyone who posted a report last week that doesn\'t post a new report until the same time next week will lose the Reading Squad 🔥🔥 role.\n\nRoles will be cleared from people who didn\'t post a report last week now.',
        color: info.utility.readingSquadCoolBlue
      }
    });
  }

  async function getMembersToClear() {
    const approvedIDs = await info.db.listApprovedReadingSquad();

    //  get all users with the reading squad role
    const server = bot.guilds.get(info.settings.home_server_id);
    const currentSquad = server.members.filter(x => x.roles.includes(squadRole));

    //  get ids of users who didn't post a report this week
    return currentSquad.filter(x => !approvedIDs.includes(x.id));
  }

  async function clearRoles(expiredMembers) {
    //  remove roles from people who didn't post a report
    
    let success = [], fail = [];
    for (const member of expiredMembers) {
      try {
        await member.removeRole(squadRole, 'Reading report expired');
        success.push(member.id);
      } catch (e) {
        fail.push(member.id);
      }
    }

    await bot.createMessage(info.settings.info_log_channel, {
      embed: {
        color: info.utility.readingSquadCoolBlue,
        title: 'Reading Report expired ',
        fields: [
          { name: 'Role ID', value: squadRole },
          { name: 'Removed', value: success.map(x => `<@${x}>`).join(',') || "None" },
          { name: 'Failed to remove', value: fail.map(x => `<@${x}>`).join(',') || "None" },
        ],
      }});
  }

  function getUpcomingDeadline() {
    const deadline = new Date();
    deadline.setUTCHours(15); //  15 UTC = midnight in Japan
    deadline.setUTCMinutes(0);
    deadline.setUTCSeconds(0);
    deadline.setUTCMilliseconds(0);
    deadline.setUTCDate(deadline.getUTCDate() + (7 - deadline.getUTCDay()) % 7 + 1) //  upcoming Monday
    return deadline;
  }

  /**
   * Handles reactions in the reading report channel
   * @param {*} message The message that was reacted to
   * @param {*} emoji The that was used as a reaction
   */
  async function onReadingReportReaction(message, emoji) {
    //  only process reactions in the reading reports channel
    if (message.channel.id !== reportsChannel)
      return;

    //  only process the checkmark emoji
    if (emoji.name !== '✅')
      return;

    const fullMessage = await bot.getMessage(message.channel.id, message.id);
    const checks = fullMessage.reactions['✅'] || {count: 0};
    if (checks.count != 1)
      return; //  only take action the first time somebody reacts
    
    const success = await feather.approve(fullMessage.member, fullMessage.author);
    if (success) {
      //  if someone blocked the bot for some reason, this will fail
      //  but we probably don't really care
      try { await fullMessage.addReaction('✅'); } catch { }
    }
  }

  return feather;
};
