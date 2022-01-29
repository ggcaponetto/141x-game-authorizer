import * as loglevel from 'loglevel';
const ll = loglevel.getLogger('main');

if (process.env.NODE_ENV === 'production' && !window.logleveldebug) {
  ll.setLevel(ll.levels.ERROR);
} else {
  ll.setLevel(ll.levels.DEBUG);
}

export function Storage(){
  this.set = function (key, value){
    try {
      ll.debug(`Storage - set key ${key} with value ${value}`);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e){
      ll.error(`Storage error - set key ${key} with value ${value} :`, e);
    }
  }
  this.get = function (key){
    try {
      ll.debug(`Storage - get key ${key}`);
      return JSON.parse(window.localStorage.getItem(key));
    } catch (e){
      ll.error(`Storage error - get key ${key} :`, e);
    }
  }
  this.delete = function (key){
    try {
      ll.debug(`Storage - delete key ${key}`);
      window.localStorage.removeItem(key);
    } catch (e){
      ll.error("Storage error - delete:", e);
    }
  }
}
