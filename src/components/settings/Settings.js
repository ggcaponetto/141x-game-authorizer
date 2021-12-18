import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import * as loglevel from 'loglevel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { AppContext, defaultAppContext } from '../../App'
import { Storage } from "../storage/Storage";
import { getBlockfrostFromContext } from "../util/util";
const ll = loglevel.getLogger('main');

if (process.env.NODE_ENV === 'production' && !window.logleveldebug) {
  ll.setLevel(ll.levels.ERROR);
} else {
  ll.setLevel(ll.levels.DEBUG);
}

export function SettingsLoader() {
  const storage = useRef(null);
  const context = useContext(AppContext);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);
  useEffect(() => {
    let tempStorage = new Storage();
    storage.current = tempStorage;

    // get the network settings from the storage
    let tempSettings = storage.current.get("settings") || defaultAppContext.settings;

    // get the accounts from the storage
    let tempAccounts = storage.current.get("accounts") || defaultAppContext.accounts;

    if(
      context.dispatch && hasLoadedSettings === false
    ){
      context.dispatch({
        type: defaultAppContext.actions.replace,
        payload: {
          settings: tempSettings,
          accounts: tempAccounts
        }
      });
      setHasLoadedSettings(true);
    }
  }, [context, hasLoadedSettings]);
  return null
}

export function Settings() {
  const storage = useRef(null);
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const initStorage = useCallback(async function initStorage(){
    let tempStorage = new Storage();
    storage.current = tempStorage;
  }, [storage])
  useEffect(() => {
    initStorage();
  }, [initStorage])

  const getNetworkOptions = () => {
    return [
      "mainnet", "testnet"
    ].map(network => {
      return (
        <MenuItem value={network} key={network}>{network}</MenuItem>
      )
    })
  }
  const getNetworkFromContext = () => {
    try {
      return context.settings.network;
    } catch (e){
      ll.debug("could not parse the nework setting from the context", context);
      return null;
    }
  }
  const getServerFromContext = () => {
    try {
      return context.settings.server;
    } catch (e){
      ll.debug("could not parse the server setting from the context", context);
      return null;
    }
  }
  const getAppIdFromContext = () => {
    try {
      return context.settings.appId;
    } catch (e){
      ll.debug("could not parse the server setting from the context", context);
      return null;
    }
  }

  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <Typography variant={'h5'}>Settings</Typography>
      <Typography variant={"h6"}>{t(`settings:network`)}</Typography>
      <br/>
      <Select
        style={{width: "100%"}}
        value={getNetworkFromContext() || ""}
        label="Age"
        onChange={(event) => {
          let tempSettings = context.settings;
          tempSettings.network = event.target.value;
          if(context.dispatch){
            storage.current.set("settings", tempSettings);
            context.dispatch({
              type: defaultAppContext.actions.replace,
              payload: {
                settings: tempSettings
              }
            });
          }
        }}
      >
        {getNetworkOptions()}
      </Select>
      <br />
      <TextField
        style={{width: "100%"}}
        label={t("settings:server")}
        value={getServerFromContext() || ""}
        onChange={(event) => {
          let tempSettings = context.settings;
          tempSettings.server = event.target.value;
          if(context.dispatch){
            storage.current.set("settings", tempSettings);
            context.dispatch({
              type: defaultAppContext.actions.replace,
              payload: {
                settings: tempSettings
              }
            });
          }
        }}
        InputProps={{endAdornment: (
            <Button
              onClick={()=>{
                let tempSettings = context.settings;
                tempSettings.server = window._env_.REACT_APP_SERVER;
                if(context.dispatch){
                  storage.current.set("settings", tempSettings);
                  context.dispatch({
                    type: defaultAppContext.actions.replace,
                    payload: {
                      settings: tempSettings
                    }
                  });
                }
              }}
            >{t(`settings:reset-server`)}</Button>
          )}}
      />
      <br />
      <TextField
        style={{width: "100%"}}
        label={t("settings:app-id")}
        value={getAppIdFromContext() || ""}
        onChange={(event) => {
          let tempSettings = context.settings;
          tempSettings.appId = event.target.value;
          if(context.dispatch){
            storage.current.set("settings", tempSettings);
            context.dispatch({
              type: defaultAppContext.actions.replace,
              payload: {
                settings: tempSettings
              }
            });
          }
        }}
        InputProps={{endAdornment: (
            <Button
              onClick={()=>{
                let tempSettings = context.settings;
                tempSettings.appId = window._env_.REACT_APP_APP_ID;
                if(context.dispatch){
                  storage.current.set("settings", tempSettings);
                  context.dispatch({
                    type: defaultAppContext.actions.replace,
                    payload: {
                      settings: tempSettings
                    }
                  });
                }
              }}
            >{t(`settings:reset-app-id`)}</Button>
          )}}
      />
      <br />
      <TextField
        style={{width: "100%"}}
        label={t("settings:blockfrost-mainnet")}
        value={getBlockfrostFromContext(context).apikey.mainnet || ""}
        onChange={(event) => {
          let tempSettings = context.settings;
          tempSettings.blockfrost.apikey.mainnet = event.target.value;
          if(context.dispatch){
            storage.current.set("settings", tempSettings);
            context.dispatch({
              type: defaultAppContext.actions.replace,
              payload: {
                settings: tempSettings
              }
            });
          }
        }}
        InputProps={{endAdornment: (
            <Button
              onClick={()=>{
                let tempSettings = context.settings;
                tempSettings.blockfrost.apikey.mainnet = window._env_.REACT_APP_BLOCKFROST_API_KEY_MAINNET;
                if(context.dispatch){
                  storage.current.set("settings", tempSettings);
                  context.dispatch({
                    type: defaultAppContext.actions.replace,
                    payload: {
                      settings: tempSettings
                    }
                  });
                }
              }}
            >{t(`settings:reset`)}</Button>
          )}}
      />
      <br />
      <TextField
        style={{width: "100%"}}
        label={t("settings:blockfrost-testnet")}
        value={getBlockfrostFromContext(context).apikey.testnet || ""}
        onChange={(event) => {
          let tempSettings = context.settings;
          tempSettings.blockfrost.apikey.testnet = event.target.value;
          if(context.dispatch){
            storage.current.set("settings", tempSettings);
            context.dispatch({
              type: defaultAppContext.actions.replace,
              payload: {
                settings: tempSettings
              }
            });
          }
        }}
        InputProps={{endAdornment: (
            <Button
              onClick={()=>{
                let tempSettings = context.settings;
                tempSettings.blockfrost.apikey.testnet = window._env_.REACT_APP_BLOCKFROST_API_KEY_TESTNET;
                if(context.dispatch){
                  storage.current.set("settings", tempSettings);
                  context.dispatch({
                    type: defaultAppContext.actions.replace,
                    payload: {
                      settings: tempSettings
                    }
                  });
                }
              }}
            >{t(`settings:reset`)}</Button>
          )}}
      />
      {/*
      <pre>
        {JSON.stringify(context, null, 4)}
      </pre>
      */}
    </div>
  )
}
