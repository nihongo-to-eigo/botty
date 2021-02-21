module.exports = (requires) => {
  const {info} = requires;

  /**
   * function that runs when the bot is ready
   */
  function ready() {
    const readingSquad = info.utility.useSource('readingSquad');

    readingSquad.onReady();
  }

  return ready;
};
