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
  feather.searchJisho = function(word, num)
  {
    return new Promise((resolve, reject) =>
    {
      jishoReq(word).then((data) =>
      {
        resolve(prettyDisplay(data, num));
      }).catch(reject);
    });
  }
  feather.listJisho = function(word, dmBool)
  {
    return new Promise((resolve, reject) =>
    {
      jishoReq(word).then((data) =>
      {
        resolve(listJapanese(data,dmBool));
      }).catch(reject);
    });
  }
  //helper functions
  const jishoReq = function(word)
  {
    return new Promise((resolve, reject) =>
    {
      let url = 'http://jisho.org/api/v1/search/words?keyword=' + urlencode(word);
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
  //list the japanese readings
  const listJapanese = function(api, dmBool)
  {
    let emb = {title: 'Reading List:', color:0xa7fcd0, footer: {text: 'Results provided by jisho.org'}};
    let list = '';
    let goingToDM = undefined;
    let dataLen = api.data.length;
    for(let i = 0; i < dataLen; i ++)
    {
      let line = '';
      line += (i+1) + '.' + getJapanese(api.data[i].japanese);
      if(i != (dataLen - 1))
      {
        line += '\n';
      }
      list += line;
    }
    emb.description = list + '\nUse jisho(j) <word> <number on list> to get that definition';
    if(!dmBool && dataLen > 10)
    {
      emb.footer = {text: 'You have been DMed due to the amount of results'};
      goingToDM = true;
    }
    else
    {
      goingToDM = false;
    }
    
    return {embed: emb, shouldDM: goingToDM};
  };
  //grab the japanese readings
  const getJapanese = function(japaneseArr)
  {
    let ret = '';
    let arrLen = japaneseArr.length;
    for(let i = 0; i < arrLen; i ++)
    {
      let line = '';
      if(japaneseArr[i].word == undefined)
      {
        line += ' (' + japaneseArr[i].reading + ')';
      }
      else if(japaneseArr[i].reading == undefined)
      {
        line += ' ' + japaneseArr[i].word;
      }
      else
      {
        line += ' ' + japaneseArr[i].word + ' (' + japaneseArr[i].reading + ')';
      }
      if(i != arrLen - 1)
      {
        line += ',';
      }
      ret += line;
    }
    return ret;
  };
  //gets the definitions
  const getDefinitions = function(sensesArr)
  {
    let definitions = '';
    let numDefs = 0;
    let arrLen = sensesArr.length;
    for(var i = 0; i < arrLen; i ++)
    {
      if(sensesArr[i].english_definitions !== undefined)
      {
        definitions += (numDefs+1) + '. ';
        numDefs ++;
        if(concatArr(sensesArr[i].parts_of_speech) == '')
        {
          if(concatArr(sensesArr[i].tags) == '')
          {
            definitions += concatArr(sensesArr[i].english_definitions) +'\n';
          }
          else
          {
            definitions+= concatArr(sensesArr[i].english_definitions) + ' - ' + concatArr(sensesArr[i].tags) + '. ' + concatArr(sensesArr[i].info) + '\n';
          }
        }
        else
        {
          definitions += '*' + concatArr(sensesArr[i].parts_of_speech) + '*: ';
          if(concatArr(sensesArr[i].tags) == '')
          {
            definitions += concatArr(sensesArr[i].english_definitions) + '\n';
          }
          else
          {
            definitions+= concatArr(sensesArr[i].english_definitions) + ' - ' + concatArr(sensesArr[i].tags) + '. '+ concatArr(sensesArr[i].info) + '\n';
          }
        }
      }
      
      
    }
    return definitions;
  };
  //concatenates an array to one line
  const concatArr = function(arr)
  {
    let s = '';
    if(arr !== undefined)
    {
      let arrLen = arr.length;
      for(let i = 0; i < arrLen; i++)
      {
        if(arr[i] != null)
        {
          if(i == (arrLen - 1))
          {
            s += arr[i];
          }
          else
          {
            s += arr[i] + ', ';
          }
        }
      }
    }
    
    return s;
  };
  //takes all of the data found and displays it nicely
  const prettyDisplay = function(api, num)
  {
    let readField = {name: 'Reading(s):',inline: true};
    let tagField = {name: 'Tag(s):',inline: true};
    let defField = {name: 'Definition(s):', inline: false};
    let embed = {title: '', description: '', color: 0xa7fcd0, footer: { text:'Results from jisho.org'}};
    let fields = [];
    try
    {
      if(api.meta === undefined || api.meta.status != 200) {
        throw 'Bad API response';
      } if(api.data.length == 0)
      {
        fields = [{name: 'Error', value:'No results found for this query, it may not exist in the dictionary. Check on jisho.org; if it does exist there, please contact CyberRonin', inline:true}];
      }
      else if(num >= api.data.length)
      {
        let v = 'There aren\'t enough entries in the dictionary to grab number ' + (num+1)+'.'
        if(api.data.length == 1)
        {
          v += 'There is only one entry'
        }
        else
        {
          v += 'There are only  '+(api.data.length)+' entry.';
        }
        fields = [{name: 'Error', value:v, inline:true}];
      }
      else
      {
        const tags = getTags(api.data[num]);
        readField.value = getJapanese(api.data[num].japanese);
        fields.push(readField);
        if(tags != '')
        {
          tagField.value = tags;
          fields.push(tagField);
        }
        defField.value = getDefinitions(api.data[num].senses);
        if(api.data.length > 10)
        {
          defField.value += 'The lookup has more than 10 items from Jisho. Try jisho(j) <word> --list for the list.';
        }
        fields.push(defField);
        
      }
    }
    catch(err)
    {
      console.log( 'Error occured: Error Code ' + err +' - something was looked up that would break bot. Writing to dump file.' + new Date());
      fields = [{name:'Error',value: 'Error occured with that lookup. Try the command again. If that command doesn\'t work, please contact CyberRonin',inline:true}];
    }
    
    embed.fields = fields;
    return embed;
  };
  //grabs the tags from the call
  const getTags = function(dataArr)
  {
    let tags = '';
    if(dataArr.is_common == true)
    {
      tags += '`Common` ';
    }
    tags += concatTags(dataArr.tags);
    return tags;
  };
  //lists the tags a little nicer
  const concatTags = function(arr)
  {
    let utility = requires.info.utility;
    let s = '';
    let arrLen = arr.length;
    for(let i = 0; i < arrLen; i++)
    {
      if(i == (arrLen - 1))
      {
        s += utility.codeInline(arr[i]);
        s += ' ';
      }
      else
      {
        s += utility.codeInline(arr[i]);
        s += ' ';
      }
    }
    return s;
  };

  return feather;
};
