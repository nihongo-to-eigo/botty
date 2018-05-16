//Feather for the jisho API
'use strict';
module.exports = function feather(requires)
{
  //feather obj
  const feather = {};
  //set variable for config
  const config = feather.config;
  //requires
  const snekfetch = require('snekfetch');
  const urlencode = require('urlencode');
  
  //feather functions
  feather.searchKanji = function(kanji)
  {
    return new Promise((resolve, reject) =>
    {
      kanjiReq(kanji).then((data) =>
      {
        resolve(prettyDisplay(data));
      }).catch(reject);
    });
  }
  //helper functions
  const kanjiReq = function(kanji)
  {
    return new Promise((resolve, reject) =>
    {
      let url = 'http://api.nihongoresources.com/kanji/find/' + urlencode(kanji);
      snekfetch.get(url).set('Content-type', 'application/json')
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
  }
  const prettyDisplay = function(body)
  {
    let emb = {};
    if(body.length > 0)
    {
      if(body[0].literal != undefined)
      {
        emb.title = body[0].literal;
        if(body[0].jlpt == undefined && body[0].grade == undefined)
        {
          emb.description = `\n _ _`;
        }
        else if(body[0].jlpt == undefined && body[0].grade != undefined)
        {
          emb.description = `Grade ${body[0].grade}`;
        }
        else if(body[0].jlpt != undefined && body[0].grade == undefined)
        {
          emb.description = `JLPT N${body[0].jlpt}`;
        }
        else if(body[0].jlpt != undefined && body[0].grade != undefined)
        {
          emb.description = `JLPT N${body[0].jlpt}, Grade ${body[0].grade}`;
        }
        
        let fields = [];
        let strokes = {name: 'Strokes', value: body[0].strokeCount, inline: true};
        fields.push(strokes);
        let radical = {name: 'Radical', value: body[0].radical, inline: true};
        fields.push(radical);
        if(body[0].parents.length > 0)
        {
          let parents = {name: 'Elements', value: body[0].parents.join('\n'), inline: true};
          fields.push(parents);
        }
        if(body[0].children.length > 0)
        {
          let related = {name: 'Related Kanji', value: body[0].children.join(', '), inline: true};
          fields.push(related);
        }
        let readings = {name: 'Readings', value: body[0].readings.join('\n'), inline: true};
        fields.push(readings);
        let meanings = {name: 'Meanings', value: body[0].meanings.join('\n'), inline: true};
        fields.push(meanings);
        emb.fields = fields;
        console.log(emb);
        return emb;
      }
      else
      {
        emb.title = 'Error';
        emb.description = 'There was no result for what you searched. If this is an error of the command, please contact CyberRonin';
        return emb;
      }
      
    }
    else
    {
      emb.title = 'Error';
      emb.description = 'There was no result for what you searched. If this is an error of the command, please contact CyberRonin';
      return emb;
    }
  }

  return feather;
};
