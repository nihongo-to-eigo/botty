module.exports = (requires) => {
  const { info, bot } = requires;

  /**
   * function that runs when the bot is ready
   */
  function ready() {
    const readingSquad = info.utility.useSource('readingSquad');

    readingSquad.onReady();
    log();
  };

  function log () {
    console.log('Testing shiiiit');
  };

  return ready;
}
