import { io } from "socket.io-client";
// eslint-disable-next-line no-unused-vars
import React from 'react'
import * as loglevel from 'loglevel';

const ll = loglevel.getLogger('main');

if (process.env.NODE_ENV === 'production' && !window.logleveldebug) {
  ll.setLevel(ll.levels.ERROR);
} else {
  ll.setLevel(ll.levels.DEBUG);
}

export default function Socket(){
  this.socket = null;
  this.init = function (serverUrl){
    const socket = io(serverUrl);
    this.socket = socket;
  }
  this.getSocket = function (){ return this.socket }
  return null;
}
