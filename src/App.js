import './App.css';
import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import * as loglevel from 'loglevel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Routes, Route } from "react-router-dom";

import * as BIP39 from "bip39"
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import ButtonGroup from '@mui/material/ButtonGroup'
import Wallet from "./components/wallet/Wallet";
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { Navigate, useNavigate } from 'react-router'
import axios from "axios";
import Socket from "./components/socket/Socket";
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import packageJson from "./../package.json";
import { Settings, SettingsLoader } from './components/settings/Settings'
import { Storage } from "./components/storage/Storage";
import { getBlockfrostFromContext } from "./components/util/util";
import mainLogo from'./components/logo/141x-logo.png';
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'


const ll = loglevel.getLogger('main');
let CardanoWasm = null;

if (process.env.NODE_ENV === 'production' && !window.logleveldebug) {
  ll.setLevel(ll.levels.ERROR);
} else {
  ll.setLevel(ll.levels.DEBUG);
}
const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#8d4eff',
    },
    secondary: {
      main: '#c5e1a5',
    },
    background: {
      default: '#d2d2d2',
      paper: '#eeeeee',
    },
    error: {
      main: '#d50000',
    },
    success: {
      main: '#00e676',
    },
    warning: {
      main: '#ff651f',
    },
    info: {
      main: '#00bcd4',
    },
  },
});

function SeedDisplayer(props){
  const [isDisplayed, setIsDisplayed] = useState(false);
  const getUI = () => {
    if(isDisplayed){
      return (
        <div>
          {props.seed}
        </div>
      )
    } else {
      return (
        <div>
          {props.seed.trim().split(/[ ]+/).map((token, tokenIndex) => {
            return <b key={tokenIndex}>{" * "}</b>;
          })}
        </div>
      )
    }
  };
  return (
    <div style={{
      display: "flex",
      flexDirection: "row"
    }}>
      <div style={{flex: 1}}>
        {getUI()}
      </div>
      <div style={{display: "block"}}>
        {(()=>{
          if(isDisplayed){
            return (
              <IconButton color="warning" onClick={() => { setIsDisplayed(!isDisplayed) }}>
                <VisibilityOffIcon />
              </IconButton>
            )
          }
          return (
            <IconButton color="warning" onClick={() => { setIsDisplayed(!isDisplayed) }}>
              <VisibilityIcon />
            </IconButton>
          )
        })()}
      </div>
    </div>
  );
}

function AddressInfo(props){
  const [res, setRes] = useState(null);
  const { t } = useTranslation();
  const context = useContext(AppContext);
  useEffect(() => {
    if(context.settings && context.settings.network !== undefined){
      const update = async (address) => {
        let res = await axios({
          method: 'get',
          url: `https://cardano-${context.settings.network}.blockfrost.io/api/v0/addresses/${address}`,
          headers: {
            "project_id": `${getBlockfrostFromContext(context).apikey[`${context.settings.network}`]}`
          }
        }).catch(e => e);
        setRes(res);
      }
      update(props.address);
    }
  }, [context, context.settings, props.address])
  return (
    <div>
      {(()=>{
        if(res && res.data){
          return res.data.amount.map((amountElement, amountElementIndex) => {
            return (
              <div style={{display: "flex", alignItems: "center", flexDirection: "column"}} key={amountElementIndex}>
                <Typography variant={'body1'}><b>{amountElement.unit}</b></Typography>
                <Typography variant={'body1'}>{amountElement.quantity}</Typography>
              </div>
            )
          })
        } else {
          return (
            <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
              <Typography variant={'body1'}>{t("home:unused-address")}</Typography>
            </div>
          )
        }
      })()}
    </div>
  )
}

const dividerStyle = {marginLeft: "20px", marginRight: "20px", marginTop: "5px", marginBottom: "5px"};
function Accounts() {
  const context = useContext(AppContext);
  const wallet = useRef(null);
  const storage = useRef(null);
  const [seed, setSeed] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function initWallet(){
      CardanoWasm = CardanoWasm || await import("@emurgo/cardano-serialization-lib-browser");
      let tempWallet = new Wallet(CardanoWasm, BIP39);
      wallet.current = tempWallet;
      // restore the wallet accounts from redux
      wallet.current.setAccounts(context.accounts);
    }
    async function initStorage(){
      let tempStorage = new Storage();
      storage.current = tempStorage;
    }
    initWallet();
    initStorage();
  }, [context.accounts])

  const isValidSeed = useCallback(() => {
    try {
      return seed.trim().split(" ").length === 24;
    } catch (e){
      return false;
    }
  }, [seed])
  return (
    <div style={{
      width: "100%"
    }}>
      <div style={{
        display: "flex", flex: 1
      }}>
        <div style={{
          display: "flex", flex: 1, maxWidth: "600px", margin: "0 auto", flexDirection: "column"
        }}>
          <div className={"new-account"} style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex"}}>
              <TextField
                label={t("home:seed")}
                variant="standard"
                style={{flex: 1}}
                value={seed || ''}
                onChange={(event) => {
                  setSeed(event.target.value)
                }}
                multiline
              />
            </div>
            {(()=>{
              if(!isValidSeed()){
                return (
                  <Alert severity="info">{t(`home:not-a-valid-seed`)}</Alert>
                )
              }
            })()}
            <Button style={{width: "100%"}} disabled={!isValidSeed()} onClick={() => {
              ll.debug(`creating account/addresses on ${context.settings.network}`, {});
              let newAddresses = wallet.current.createAddresses({
                network: context.settings.network,
                quantity: 1,
                seed
              });
              let newAccounts = wallet.current.getAccounts();
              wallet.current.setAccounts(newAccounts);
              storage.current.set("accounts", newAccounts);
              context.dispatch({
                type: defaultAppContext.actions.replace,
                payload: {
                  accounts: newAccounts
                }
              });
              ll.debug("imported account/addresses", {
                newAddresses,
                newAccounts,
              });
            }}>{t("home:import-wallet")}</Button>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
              <Typography>{t("home:or")}</Typography>
            </div>
            <div style={{display: "flex"}}>
              {(()=>{
                if(context.settings && context.settings.network){
                  return (
                    <Button style={{width: "100%"}} onClick={() => {
                      ll.debug(`creating account/addresses on ${context.settings.network}`, {});
                      let newAddresses = wallet.current.createAddresses({
                        network: context.settings.network,
                        quantity: 1,
                        seed: null
                      });
                      let newAccounts = wallet.current.getAccounts();
                      wallet.current.setAccounts(newAccounts);
                      storage.current.set("accounts", newAccounts);
                      context.dispatch({
                        type: defaultAppContext.actions.replace,
                        payload: {
                          accounts: newAccounts
                        }
                      });
                      ll.debug("created account/addresses", {
                        newAddresses,
                        newAccounts,
                      });
                    }}>{t("home:new-game-account")}</Button>
                  )
                }
                return null;
              })()}
            </div>
          </div>
          <br />
          {(()=>{
            if(context.settings && context.settings.network){
              let accounts = context.accounts[context.settings.network];
              if(Object.keys(accounts).length > 0){
                return (
                  <div className={"accounts"} style={{display: "flex", flexDirection: "column", wordBreak: "break-word"}}>
                    {
                      (()=>{
                        const seedComponents = [];
                        Object.keys(accounts).forEach((seedKey, seedKeyIndex) => {
                          const addressesComponents = [];
                          Object.keys(accounts[seedKey]).forEach(derivationIndexKey => {
                            let address = accounts[seedKey][derivationIndexKey];
                            addressesComponents.push(
                              <div key={`address_derivation_${derivationIndexKey}`}>
                                <Typography variant={'h6'}>
                                  {t("home:accordion-title-address")} {parseInt(derivationIndexKey) + 1} {
                                  <Button
                                    onClick={() => {
                                      wallet.current.deleteAddress(context.settings.network, seedKey, derivationIndexKey);
                                      let newAccounts = wallet.current.getAccounts();
                                      wallet.current.setAccounts(newAccounts);
                                      storage.current.set("accounts", newAccounts);
                                      context.dispatch({
                                        type: defaultAppContext.actions.replace,
                                        payload: {
                                          accounts: newAccounts
                                        }
                                      });
                                    }}
                                  >{t("home:delete-address")}</Button>
                                }
                                </Typography>
                                <p>
                                  {address.public.base_address_bech32}
                                </p>
                                <AddressInfo
                                  address={address.public.base_address_bech32}
                                />
                                <br />
                              </div>
                            )
                          })
                          seedComponents.push(
                            <div key={`seed_${seedKeyIndex}`}>
                              <Accordion>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                >
                                  <Typography variant={'h5'}>{t("home:accordion-title-seed")} {seedKeyIndex + 1} {context.settings.network} {
                                    <Button
                                      color={"warning"}
                                      onClick={() => {
                                        wallet.current.deleteAccount(context.settings.network, seedKey);
                                        let newAccounts = wallet.current.getAccounts();
                                        wallet.current.setAccounts(newAccounts);
                                        storage.current.set("accounts", newAccounts);
                                        context.dispatch({
                                          type: defaultAppContext.actions.replace,
                                          payload: {
                                            accounts: newAccounts
                                          }
                                        });
                                      }}
                                    >{t("home:delete-account")}</Button>
                                  }</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <SeedDisplayer seed={seedKey} />
                                  <span style={{marginTop: "1em"}} />
                                  {addressesComponents}
                                </AccordionDetails>
                              </Accordion>
                            </div>
                          )
                        })
                        return seedComponents;
                      })()
                    }
                  </div>
                )
              }
            }
            return null;
          })()}
        </div>
      </div>
      {/*<pre>
        {JSON.stringify(context, null, 4)}
      </pre>*/}
    </div>
  )
}

function Utilities() {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const wallet = useRef(null);
  const storage = useRef(null);
  const [signAddress, setSignAddress] = useState(null);
  const [signMessage, setSignMessage] = useState(null);
  const [signSignature, setSignSignature] = useState(null);

  const [verifyAddress, setVerifyAddress] = useState(null);
  const [verifyMessage, setVerifyMessage] = useState(null);
  const [verifySignature, setVerifySignature] = useState(null);

  const [verifies, setVerifies] = useState(null);

  useEffect(() => {
    async function initWallet(){
      CardanoWasm = CardanoWasm || await import("@emurgo/cardano-serialization-lib-browser");
      let tempWallet = new Wallet(CardanoWasm, BIP39);
      wallet.current = tempWallet;
      // restore the wallet accounts from redux
      wallet.current.setAccounts(context.accounts);
    }
    async function initStorage(){
      let tempStorage = new Storage();
      storage.current = tempStorage;
    }
    initStorage();
    initWallet();
  }, [context.accounts]);

  useEffect(() => {
    let firstAddress = null;
    if(context.accounts && context.settings && context.settings.network){
      Object.keys(context.accounts[context.settings.network]).forEach(seedKey => {
        Object.keys(context.accounts[context.settings.network][seedKey]).forEach(derivationIndexKey => {
          let tempAddress = context.accounts[context.settings.network][seedKey][derivationIndexKey].public.base_address_bech32;
          if(firstAddress === null){
            firstAddress = tempAddress;
          }
        })
      })
      setSignAddress(firstAddress)
    }
  }, [context.accounts, context.settings.network]);

  const getAddressMenuItems = () => {
    let addresses = [];
    let accounts = context.accounts[context.settings.network];
    if(accounts && Object.keys(accounts).length > 0){
      Object.keys(accounts).forEach((seedKey, seedKeyIndex) => {
        Object.keys(accounts[seedKey]).forEach(derivationIndexKey => {
          let address = accounts[seedKey][derivationIndexKey];
          addresses.push(address.public.base_address_bech32);
        })
      })
    }
    return addresses.map(address => {
      return (
        <MenuItem value={address} key={address}>{address}</MenuItem>
      )
    })
  }
  const sign = () => {
    let signed = wallet.current.unsafeSign(context.settings.network, signMessage, signAddress);
    setSignSignature(signed);
  }
  const verify = () => {
    let tempVerifies = wallet.current.verify(context.settings.network, verifyMessage, verifySignature, verifyAddress);
    setVerifies(tempVerifies);
  }
  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <Typography variant={'h5'}>Utilities</Typography>
      <span style={{marginTop: "1em"}} />
      <Typography variant={"h5"}>{t(`utilities:sign`)}</Typography>
      <span style={{marginTop: "1em"}} />
      <Select
        style={{width: "100%"}}
        value={signAddress || ""}
        label="Age"
        onChange={(event) => {
          setSignAddress(event.target.value);
        }}
      >
        {getAddressMenuItems()}
      </Select>
      <br />
      {(()=>{
        if(signAddress){
          return (
            <div className={"signing address info"} style={{wordBreak: "break-all"}}>
              {t("utilities:your-are-signign-with-address")} <b>{signAddress}</b> {t(`utilities:on-the`)} <b>{context.settings.network}</b>
            </div>
          )
        }
        return null;
      })()}
      <span style={{marginTop: "1em"}} />
      <TextField
        style={{width: "100%"}}
        label={t("utilities:sign-message")}
        value={signMessage || ""}
        onChange={(event) => {
          setSignMessage(event.target.value);
        }}
        multiline
        rows={4}
      />
      <span style={{marginTop: "1em"}} />
      <TextField
        style={{width: "100%"}}
        label={t("utilities:sign-signature")}
        disabled
        value={signSignature || ""}
        onChange={(event) => {
          setSignSignature(event.target.value);
        }}
        multiline
        rows={4}
      />
      <span style={{marginTop: "1em"}} />
      <Button
        style={{width: "100%"}}
        onClick={()=>{
          sign();
        }}
      >{t("utilities:sign")}</Button>
      <span style={{marginTop: "1em"}} />
      <Divider />
      <span style={{marginTop: "1em"}} />
      <Typography variant={"h5"}>{t(`utilities:verify`)}</Typography>
      <span style={{marginTop: "1em"}} />
      <TextField
        style={{width: "100%"}}
        label={t("utilities:verify-address")}
        value={verifyAddress || ""}
        onChange={(event) => {
          setVerifyAddress(event.target.value);
        }}
      />
      <span style={{marginTop: "1em"}} />
      <TextField
        style={{width: "100%"}}
        label={t("utilities:verify-message")}
        value={verifyMessage || ""}
        onChange={(event) => {
          setVerifyMessage(event.target.value);
        }}
        multiline
        rows={4}
      />
      <span style={{marginTop: "1em"}} />
      <TextField
        style={{width: "100%"}}
        label={t("utilities:verify-signature")}
        value={verifySignature || ""}
        onChange={(event) => {
          setVerifySignature(event.target.value);
        }}
        multiline
        rows={4}
      />
      <span style={{marginTop: "1em"}} />
      <div className={"verifies"} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        {(()=>{
          if(verifies !== null){
            if(verifies === true){
              return <Chip label={t("utilities:signature-ok")} color="success" />
            } else {
              return <Chip label={t("utilities:signature-error")} color="error" />
            }
          } else {
            return null;
          }
        })()}
      </div>
      <span style={{marginTop: "1em"}} />
      <Button
        style={{width: "100%"}}
        onClick={()=>{
          verify();
        }}
      >{t("utilities:verify")}</Button>
      {/*<pre>
        {JSON.stringify(context, null, 4)}
      </pre>*/}
    </div>
  )
}

export const defaultAppContext = {
  accounts: {
    mainnet: {

    },
    testnet: {

    }
  },
  settings: {
    network: window._env_.REACT_APP_NETWORK,
    server: window._env_.REACT_APP_SERVER,
    appId: window._env_.REACT_APP_APP_ID,
    blockfrost: {
      apikey: {
        mainnet: window._env_.REACT_APP_BLOCKFROST_API_KEY_MAINNET,
        testnet: window._env_.REACT_APP_BLOCKFROST_API_KEY_TESTNET
      }
    },
  },
  actions: {
    replace: "replace"
  }
}
function reducer(state, action) {
  switch (action.type) {
    case defaultAppContext.actions.replace:
      return {...state, ...action.payload};
    default:
      throw new Error();
  }
}
export const AppContext = React.createContext(defaultAppContext);

function Navbar (){
  const { t } = useTranslation();
  let navigate = useNavigate();
  return (
    <div style={{
      display: "flex", flex: 1
    }}>
      <div style={{
        display: "flex", flex: 1, maxWidth: "600px", margin: "0 auto", flexDirection: "column", alignItems: "center"
      }}>
        <Paper style={{
          padding: "15px",
          marginTop: "15px"
        }}>
          <img src={mainLogo} style={{maxWidth: "160px"}}/>
        </Paper>
        <Typography
          style={{textAlign: "center"}}
          variant="h6" component="h2"
        >
          {t(`home:title`)}
        </Typography>
        <Typography variant={"body2"}>141x.io - version {packageJson.version}</Typography>
        <ButtonGroup variant="text" aria-label="text button group">
          <Button onClick={() => {
            navigate("/accounts");
          }}>
            Accounts
          </Button>
          <Button onClick={() => {
            navigate("/utilities");
          }}>
            Utilities
          </Button>
          <Button onClick={() => {
            navigate("/settings");
          }}>
            Settings
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
function RouterContainer(props){
  const [socket, setSocket] = useState(null);
  const context = useContext(AppContext);
  const wallet = useRef(null);
  const storage = useRef(null);

  useEffect(() => {
    async function initWallet(){
      CardanoWasm = CardanoWasm || await import("@emurgo/cardano-serialization-lib-browser");
      let tempWallet = new Wallet(CardanoWasm, BIP39);
      wallet.current = tempWallet;
      // restore the wallet accounts from redux
      wallet.current.setAccounts(context.accounts);
    }
    async function initStorage(){
      let tempStorage = new Storage();
      storage.current = tempStorage;
    }
    initWallet();
    initStorage();
  }, [context.accounts])

  useEffect(() => {
    ll.info("recreating the socket connection (settings changed)");
    let tempSocketInstance = new Socket();
    tempSocketInstance.init(context.settings.server);
    let tempSocket = tempSocketInstance.getSocket();
    // client-side
    tempSocket.on("connect", () => {
      ll.debug("socket: connect", tempSocket.id);
      tempSocket.emit("set-client-type", { payload: "auth-client" })
    });
    tempSocket.on("auth-req", (data, callback) => {
      ll.debug("socket: auth-req", data);
      if(wallet.current){
        try {
          if(
            wallet.current.hasPrivateKeyOfAddress(context.settings.network, data.headers.address)
            && context.settings.appId === data.headers["app-id"]
          ){
            let signed = wallet.current.safeSign(context.settings.network, JSON.stringify(data), data.headers.address, context.settings.appId);
            callback({
              data: JSON.stringify(data),
              signed
            })
          } else if(
            context.settings.appId !== data.headers["app-id"]
          ){
            ll.debug(`socket: auth-req skip. Ignoring auth request for address ${data.headers.address} because we dont trust the appId. Got: ${JSON.stringify({
              data,
              allowedAppId: context.settings.appId
            })}`,);
          } else {
            ll.debug(`socket: auth-req skip. Ignoring auth request for address ${data.headers.address} because we didn't import the private keys for it.`,);
          }
        } catch (e){
          ll.error("socket: auth-req error", `${e.message}: ${e.cause}`);
        }
      } else {
        ll.info("the wallet is not yet ready to sign the message");
      }
    });
    setSocket(tempSocketInstance);
    return () => {
      tempSocket.disconnect();
      tempSocket.close();
    }
  }, [JSON.stringify(context)]);

  let getChildren = useCallback(() => {
    if(Array.isArray(props.children)){
      return props.children;
    } else if(props.children){
      return [props.children]
    } else {
      return [];
    }
  }, [props.children])
  return (
    <div>
      {getChildren().map((child, childIndex) => {
        if(React.isValidElement(child)){
          return React.cloneElement(child, {
            key: childIndex,
            socket
          });
        }
        return child;
      })}
    </div>
  )
}
function PageContainer(props){
  return (
    <div
      style={{
        display: "flex", flex: 1, maxWidth: "600px", margin: "0 auto", flexDirection: "column", alignItems: "center", padding: "10px"
      }}
    >
      <SettingsLoader />
      {props.children.map((child, childIndex) => {
        if(React.isValidElement(child)){
          return React.cloneElement(child, {
            key: childIndex,
          });
        }
        return child;
      })}
    </div>
  )
}
function AppRouter(){
  const [state, dispatch] = useReducer(reducer, defaultAppContext);
  useEffect(() => {
    dispatch({
      type: defaultAppContext.actions.replace,
      payload: {
        dispatch
      }
    })
  }, [])
  const routeStyle = {
    width: "100%"
  }
  return (
    <AppContext.Provider value={state}>
      <ThemeProvider theme={darkTheme}>
        <RouterContainer>
          <Routes>
            <Route path="/" element={<Navigate replace to="/accounts" />} />
            <Route path="/accounts" element={
              <div style={routeStyle}>
                <PageContainer>
                  <Navbar />
                  <Accounts />
                </PageContainer>
              </div>
            } />
            <Route path="/settings" element={
              <div style={routeStyle}>
                <PageContainer>
                  <Navbar />
                  <Settings />
                </PageContainer>
              </div>
            } />
            <Route path="/utilities" element={
              <div style={routeStyle}>
                <PageContainer>
                  <Navbar />
                  <Utilities />
                </PageContainer>
              </div>
            } />
          </Routes>
        </RouterContainer>
      </ThemeProvider>
    </AppContext.Provider>
  )
}
export default AppRouter;
