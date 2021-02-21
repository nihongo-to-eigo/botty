module.exports = (requires) => {
  const {info, bot} = requires;

  const handler = {};
  function unmuteUser(userID) {
    const user = bot.guilds.get(info.settings.home_server_id).members.get(userID);
    if(user !== undefined) {
      const isMuted = user.roles.includes(info.settings.mute_role_id);
      if(isMuted) {
        user.removeRole(info.settings.mute_role_id, 'Mute timer expired');
        bot.createMessage(info.settings.public_log_channel, {content: `<@${userID}>, you have been unmuted.`});
      }
    }
  }
  function resetReadingSquad() {
    const readingSquad = info.utility.useSource('readingSquad');
    readingSquad.reset();
  }
  function processPassed(passed) {
    passed.forEach(timer => {
      switch(timer.type) {
      case 'mute':
        unmuteUser(timer.userID);
        break;
      case 'reading':
        resetReadingSquad();
        break;
      }
    });
  }
  handler.processTick = () => {
    const now = new Date;
    info.db.findPassed(now).then(passedTimers => {
      processPassed(passedTimers);
      // do something, then delete passed Timers
      info.db.removePassed(now).then(() => {
      }).catch(console.log);
    }).catch(console.log);
  };
  return handler;
};
