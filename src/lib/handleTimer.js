module.exports = (db, bot, config) => {
  const handler = {};
  function searchForMuted(roles) {
    roles.includes(config.mute_role_id)
  }
  function unmuteUser(userID) {
    const user = bot.guilds.get(config.home_server_id).members.get(userID);
    if(user !== undefined) {
      const isMuted = user.roles.includes(config.mute_role_id);
      if(isMuted) {
        user.removeRole(config.mute_role_id, 'Mute timer expired');
        bot.createMessage(config.public_log_channel, {content: `<@${userID}>, you have been unmuted.`});
      }
    }
  }
  function processPassed(passed) {
    passed.forEach(timer => {
      switch(timer.type) {
        case 'mute':
          unmuteUser(timer.userID);
      }
    });
  }
  handler.processTick = () => {
    const now = new Date;
    console.log('tick');
    db.findPassed(now).then(passedTimers => {
      processPassed(passedTimers);
      // do something, then delet passed Timers
      db.removePassed(now).then(numRemoved => {
        console.log(numRemoved);
      }).catch(console.log);
    }).catch(console.log);
  };
  return handler;
}