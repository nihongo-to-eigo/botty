//Feather for the jisho API
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
    return new Promise((resolve, reject) => {
      kanjiReq(kanji).then((data) => {
        resolve(prettyDisplay(data));
      }).catch(reject);
    });
  };
  //find random kanji
  feather.randomKanji = () => {
    return new Promise((resolve, reject) => {
      randomKanjiReq().then((data) => {
        resolve(prettyDisplay(data));
      }).catch(reject);
    });
  };
  const randomKanjiReq = () => {
    return new Promise((resolve, reject) => {
      let url = 'https://skurt.me/api/kanji/random';
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
  //helper functions
  const kanjiReq = function(kanji) {
    return new Promise((resolve, reject) => {
      let url = 'https://skurt.me/api/kanji/find/' + urlencode(kanji);
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
  const prettyDisplay = function(body) {
    let emb = {};
    if(body) {
      if(body._id != undefined) {
        emb.title = body._id;
        if(body.jlpt == undefined && body.grade == undefined) {
          emb.description = '\n _ _';
        } else if(body.jlpt == undefined && body.grade != undefined) {
          emb.description = `Grade ${body.grade}`;
        } else if(body.jlpt != undefined && body.grade == undefined) {
          emb.description = `JLPT N${body.jlpt}`;
        } else if(body.jlpt != undefined && body.grade != undefined) {
          emb.description = `JLPT N${body.jlpt}, Grade ${body.grade}`;
        }
        
        let fields = [];
        let strokes = {name: 'Strokes', value: body.stroke_count[0], inline: true};
        fields.push(strokes);
        let radical = {name: 'Radical', value: body.radical.literal, inline: true};
        fields.push(radical);
        
        if(body.parents) {
          let parents = {name: 'Elements', value: body.parents.join('\n'), inline: true};
          fields.push(parents);
        }
        if(body.children) {
          let parents = {name: 'Related Kanji', value: body.children.join(','), inline: true};
          fields.push(parents);
        }
        if(body.nanori) {
          let related = {name: 'Nanori', value: body.nanori.join(', '), inline: true};
          fields.push(related);
        }
        let readings = {name: 'Readings', value: `${body.reading.ja_on.join('\n')}\n${body.reading.ja_kun.join('\n')}`, inline: true};
        fields.push(readings);
        if(body.meanings) {
          let meanings = {name: 'Meanings', value: body.meanings.join('\n'), inline: true};
          fields.push(meanings);
        }
        emb.fields = fields;
        return emb;
      } else {
        emb.title = 'Error';
        emb.description = 'There was no result for what you searched. If this is an error of the command, please contact CyberRonin';
        return emb;
      }
      
    } else {
      emb.title = 'Error';
      emb.description = 'There was no result for what you searched. If this is an error of the command, please contact CyberRonin';
      return emb;
    }
  };

  return feather;
};
