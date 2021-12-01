export function Storage(){
  this.set = function (key, value){
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  this.get = function (key){
    return JSON.parse(window.localStorage.getItem(key));
  }
  this.delete = function (key){
    window.localStorage.removeItem(key);
  }
}
