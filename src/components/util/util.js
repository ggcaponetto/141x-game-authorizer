import * as loglevel from 'loglevel';

const ll = loglevel.getLogger('main');

if (process.env.NODE_ENV === 'production' && !window.logleveldebug) {
  ll.setLevel(ll.levels.ERROR);
} else {
  ll.setLevel(ll.levels.DEBUG);
}

const getBlockfrostFromContext = (context) => {
  try {
    return context.settings.blockfrost;
  } catch (e){
    ll.debug("could not parse the server setting from the context", context);
    return null;
  }
}

export {
  getBlockfrostFromContext
};
