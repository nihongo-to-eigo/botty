//Feather for reading squad services
'use strict';
module.exports = function feather(requires)
{
  //feather obj
  const feather = {};
  
  //requires
  const { bot, info } = requires;

  //feather functions
  feather.reset = function() {
    postResetMessage()
      .then(() => getMembersToClear())
      .then(expiredMembers => clearRoles(expiredMembers))
      .then(() => info.db.clearReadingSquad())
      .then(() => feather.setUpcomingDeadline());
  }

  feather.approve = function(member) {
    if (member) {
      if (!member.roles.includes(info.config.reading_role)) {
        member.addRole(info.config.reading_role, 'Reading report approved');
      }
      info.db.addToReadingSquad(member.id);
    }
  }

  feather.setUpcomingDeadline = function() {
    const deadline = getUpcomingDeadline();
    info.db.addTimer(null, 'reading', deadline);
    return deadline;
  }

  //helper functions
  function postResetMessage() {
    return bot.createMessage(info.config.reading_reports_channel, {embed: {
      title: 'It is now Tuesday 00:00 JST (Monday 15:00 UTC), which means a new week has started.',
      description: `Anyone who posted a report last week that doesn't post a new report until the same time next week will lose the Reading Squad 🔥🔥 role.\n\nRoles will be cleared from people who didn't post a report last week now.`,
      color: info.utility.readingSquadCoolBlue}
    });
  }

  function getMembersToClear() {
    return info.db.listApprovedReadingSquad().then(approvedIDs => {
      //  get all users with the reading squad role
      const server = bot.guilds.get(info.settings.home_server_id);
      const currentSquad = server.members.filter(x => x.roles.includes(info.config.reading_role));

      //  get ids of users who didn't post a report this week
      return currentSquad.filter(x => !approvedIDs.includes(x.id));
    });
  }

  function clearRoles(expiredMembers) {
    //  remove roles from people who didn't post a report
    const squadRole = info.config.reading_role;
    for (const member of expiredMembers) {
        member.removeRole(squadRole, 'Reading report expired');
    }
  }

  function getUpcomingDeadline() {
    const deadline = new Date();
    deadline.setUTCHours(15); //  15 UTC = midnight in Japan
    deadline.setUTCMinutes(0);
    deadline.setUTCSeconds(0);
    deadline.setUTCMilliseconds(0);
    deadline.setUTCDate(deadline.getUTCDate() + (7 - (deadline.getUTCDay() - 1))) //  upcoming Monday
    return deadline;
  }

  return feather;
};
