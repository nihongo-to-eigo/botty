//setting up the database(s)
'use strict';
module.exports = function utility(requires) {
  const bot = requires.bot;
  const info = requires.info;
  const config = info.config;

  const Datastore = require('nedb');
  const db = {};
  /**
   * DB setup for roles
   */
  db.roles = new Datastore('./src/lib/databases/roles.db');
  db.roles.loadDatabase();
  //set autocompaction to compact every 10 minutes
  db.roles.persistence.setAutocompactionInterval(600000);
  /**
   * DB functions for roles
   */
  bot.on('guildRoleDelete', (roleData) => {
    db.removeRoleByID(roleData.role_id);
  });
  //Removes the role, searches by roleID
  db.removeRoleByID = (roleID) => {
    return new Promise((resolve, reject) => {
      db.roles.remove({_id: roleID}, {}, (err, numRemoved) => {
        if(err) {
          reject(err);
        }
        resolve(numRemoved);
      }); 
    });
  };
  //Removes the role, searches by name in DB. Name referring to the autoRole name, not role name.
  db.removeRoleByName = (name) => {
    return new Promise((resolve, reject) => {
      db.roles.remove({name: name}, {}, (err, numRemoved) => {
        if(err) {
          reject(err);
        }
        resolve(numRemoved);
      }); 
    });
  };
  db.addRole = (roleID, nameTag) => {
    return new Promise((resolve, reject) => {
      db.roles.insert({_id: roleID, name: nameTag}, (err, doc) => {
        if(err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }
  db.searchRoleByID = (roleID) => {
    return new Promise((resolve, reject) => {
      db.roles.findOne({_id: roleID}, (err, role) => {
        if(err) {
          reject(err);
        }
        resolve(role); 
      });
    });
  }
  db.listRoles = () => {
    return new Promise((resolve, reject) => {
      db.roles.find({}, (err, docs) => {
        if(err) {
          reject(err);
        }
        resolve(docs.map(roleEntry => roleEntry.name));
      });
    });
  }
  /**
   * DB setup for permissions
   */
  db.permissions = new Datastore('./src/lib/databases/permissions.db');
  db.permissions.loadDatabase();
  //autocompaction every 10 minutes
  db.permissions.persistence.setAutocompactionInterval(600000);
  /**
   * DB functions for permissions
   */
  // Type is the type of ID, either role or user ID, permLevel is either 
  db.addPermID = (id, permLevel, type) => {
    return new Promise((resolve, reject) => {
      db.permissions.insert({_id: id, permLevel, type}, (err, doc) => {
        if(err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }
  db.removePermID = (id) => {
    return new Promise((resolve, reject) => {
      db.permissions.remove({_id: id}, {}, (err, numRemoved) => {
        if(err) {
          reject(err);
        }
        resolve(numRemoved);
      });
    });
  }
  /**
   * DB setup for tags
   */
  db.tags = new Datastore('./src/lib/databases/tags.db');
  db.tags.loadDatabase();
  //autocompaction every 10 minutes
  db.tags.persistence.setAutocompactionInterval(600000);
  /**
   * DB functions for roles
   */
  db.addTag = (tagName, content) => {
    return new Promise((resolve, reject) => {
      db.tags.insert({_id: tagName, content: content}, (err, doc) => {
        if(err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }
  db.removeTag = (tagName) => {
    return new Promise((resolve, reject) => {
      db.tags.remove({_id: tagName}, {}, (err, numRemoved) => {
        if(err) {
          reject(err);
        }
        resolve(numRemoved);
      });
    });
  }
  db.searchTag = (tagName) => {
    return new Promise((resolve, reject) => {
      db.tags.findOne({_id: tagName}, (err, doc) => {
        if(err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }
  db.listTags = () => {
    return new Promise((resolve, reject) => {
      db.tags.find({}, (err, docs) => {
        if(err) {
          reject(err);
        }
        resolve(docs.map(tagEntry => tagEntry._id));
      });
    });
  }
  return db;
};
