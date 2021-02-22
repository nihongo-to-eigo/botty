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
  feather.onReady = function() {
    if (info.settings == null)
      return;
      
    squadRole = info.settings.reading_squad_role_id;
    reportsChannel = info.settings.reading_reports_channel;

    if (squadRole != null && reportsChannel != null) {
      bot.on('messageReactionAdd', onReadingReportReaction.bind(this));
      info.db.countTimers('reading').then(count => {
        if (count === 0)
          feather.setUpcomingDeadline();
      });
    }
  };

  feather.reset = function() {
    postResetMessage()
      .then(() => getMembersToClear())
      .then(expiredMembers => clearRoles(expiredMembers))
      .then(() => info.db.clearReadingSquad())
      .then(() => feather.setUpcomingDeadline());
  };

  feather.approve = function(member) {
    if (member) {
      if (!member.roles.includes(squadRole)) {
        member.addRole(squadRole, 'Reading report approved');
      }
      info.db.addToReadingSquad(member.id);
    }
  };

  feather.setUpcomingDeadline = function() {
    const deadline = getUpcomingDeadline();
    info.db.addTimer(null, 'reading', deadline);
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

  function getMembersToClear() {
    return info.db.listApprovedReadingSquad().then(approvedIDs => {
      //  get all users with the reading squad role
      const server = bot.guilds.get(info.settings.home_server_id);
      const currentSquad = server.members.filter(x => x.roles.includes(squadRole));

      //  get ids of users who didn't post a report this week
      return currentSquad.filter(x => !approvedIDs.includes(x.id));
    });
  }

  function clearRoles(expiredMembers) {
    //  remove roles from people who didn't post a report
    for (const member of expiredMembers) {
      member.removeRole(squadRole, 'Reading report expired');
    }
  }

  function getUpcomingDeadline() {
    const deadline = new Date();
    
    // deadline.setMinutes(deadline.getMinutes() + 1); return deadline; // for testing

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
  function onReadingReportReaction(message, emoji) {
    //  only process reactions in the reading reports channel
    if (message.channel.id !== reportsChannel)
      return;

    //  only process the checkmark emoji
    if (emoji.name !== '✅')
      return;

    bot.getMessage(message.channel.id, message.id).then(fullMessage => {
      const checks = fullMessage.reactions['✅'] || {count: 0};
      if (checks.count != 1)
        return; //  only take action the first time somebody reacts
      
      feather.approve(fullMessage.member);
    });
  }

  return feather;
};
