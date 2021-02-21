//Feather for the stroke order API
'use strict';
module.exports = function feather() {
  //feather obj
  const feather = {};
  //set variable for config
  const config = require(`${process.cwd()}/feathers.json`).kanjiAPI;
  
  //requires
  const snekfetch = require('snekfetch');
  const urlencode = require('urlencode');
  
  //feather functions
  feather.searchKanji = function(kanji) {
    return kanjiReq(kanji);
  };
  //helper functions
  const kanjiReq = function(kanji) {
    return new Promise((resolve, reject) => {
      let url = 'https://skurt.me/api/kanji/stroke/' + urlencode(kanji);
      snekfetch.get(url).set('Content-type', 'application/json').set('authorization', config.key)
        .then((response) => {
          if(response.statusCode === 200) {
            resolve(response.body);
          } else {
            reject(response);
          }
        }).catch(reject);
    });
  };

  return feather;
};
