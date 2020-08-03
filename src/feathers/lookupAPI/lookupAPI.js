//Feather for the my dictionary lookup API
'use strict';
module.exports = function feather(requires)
{
  //feather obj
  const feather = {};
  //set variable for config
  const config = require(`${process.cwd()}/feathers.json`).lookupAPI;
  //requires
  const snekfetch = require('snekfetch');
  const urlencode = require('urlencode');

  //feather functions
  feather.searchLookup = function(word, num)
  {
    return new Promise((resolve, reject) =>
    {
      lookupReq(word).then((data) =>
      {
        resolve(prettyDisplay(data, num));
      }).catch(reject);
    });
  };

  feather.listLookup = function(word, num) {
    return new Promise((resolve, reject) => {
      lookupReq(word).then((data) => {
        resolve(list(data));
      }).catch(reject);
    });
  };

  //helper functions
  const lookupReq = function(word)
  {
    return new Promise((resolve, reject) =>
    {
      let url = 'https://skurt.me/api/word/' + urlencode(word);
      snekfetch.get(url).set('Content-type', 'application/json').set('authorization', config.key)
        .then((response) =>
        {
          if(response.statusCode === 200)
          {
            resolve(response.body);
          }
          else
          {
            reject(response);
          }
        }).catch(reject);
    });
  };

  function list (data) {
    if(data) {
      let list = [];
      data.forEach((entry, index) => {
        let entries =  entry.japanese.map((word) => {
          if(word.word && word.reading) {
            return `${word.word} (${word.reading})`;
          } else if(word.word) {
            return word.word;
          } else if(word.reading) {
            return word.reading;
          }
        }).join(', ');
        list.push(`${index + 1} ${entries}`);
      });
      return {title: 'Reading List', description: list.join('\n'), color: 0xa7fcd0};

    }
  }

  function getReadings(japanese) {
    let readings = [];
    japanese.forEach((word) => {
      if(word.word && word.reading) {
        readings.push(`${word.word}(${word.reading})`);
      } else if (word.word) {
        readings.push(word.word);
      } else if(word.reading) {
        readings.push(word.reading)
      }
    })
    return readings.join(', ');
  }

  function getDefinitions(defs) {
    let definitions = [];
    defs.forEach((definition, index) => {
      let def = `${index + 1}. `;
      if(definition.pos) {
        def += `*${definition.pos}:* `;
      }
      def += definition.definitions.join(', ');
      def += ' -';
      if(definition.misc) {
        def += ` *${definition.misc}* `;
      }
      if(definition.field) {
        def += ` ${definition.field} `;
      }
      if(definition.info) {
        def += ` _${definition.info}_ `;
      }
      if(definition.ant) {
        def += ` _Antonym of_ ${definition.ant}`;
      }
      if(definition.refer) {
        def += ` _Refer to_ ${definition.refer.join(', ')}`;
      }
      if(definition.restriction) {
        def += ` _Only applies to_ ${definition.restriction}`;
      }
      definitions.push(def);
    })
    return definitions.join('\n');
  }

  function prettyDisplay(data, num) {
    let embed = {title: '', description: '', color: 0xa7fcd0};
    embed.fields = [];
    let readField = {name: 'Reading(s)', inline: true};
    if(data) {
      if(data[num]) {
        readField.value = getReadings(data[num].japanese);
        embed.fields.push(readField);
        let definition = {name: 'Definition(s)', inline: false};
        definition.value = getDefinitions(data[num].sense);
        embed.fields.push(definition);
      }
      return embed;
    }
  }
  return feather;
};
