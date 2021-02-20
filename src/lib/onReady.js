module.exports = (requires) => {
  const { info, bot } = requires;

  /**
   * function that runs when the bot is ready
   */
  function ready() {
    log();
  };

  function log () {
    console.log('Testing shiiiit');
  };

  return ready;
}
