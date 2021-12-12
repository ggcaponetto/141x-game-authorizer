import * as loglevel from 'loglevel';

const ll = loglevel.getLogger('wallet.js');
if (process.env.NODE_ENV === 'production' && !window.logleveldebug) {
  ll.setLevel(ll.levels.ERROR);
} else {
  ll.setLevel(ll.levels.DEBUG);
}

export default function Wallet(CardanoWasm, BIP39){
  // its a map with seeds as keys
  this.accounts = {
    mainnet: {

    },
    testnet: {

    }
  };
  this.addressMap = {
    mainnet: {},
    testnet: {}
  }
  this.CardanoWasm = CardanoWasm;
  this.BIP39 = BIP39;
  this.getAddressPrefix = function (network){
    if(network === "mainnet"){
      return "addr";
    } else if(network === "testnet") {
      return "addr_test";
    } else {
      throw new Error("unknown network");
    }
  }
  this.harden = function harden(num){
    return 0x80000000 + num;
  }
  this.createAddresses = function (options = {
    quantity: 1, seed: null, network: undefined
  }){
    if(options.network === undefined){
      throw new Error("please specify a network");
    }
    try {
      // generate the seed
      let seed;
      if(
        options.seed === null
        || options.seed.trim() === ""
      ){
        // generate a 24 word mnemonic
        // https://github.com/bitcoinjs/bip39/issues/147
        // seed = this.BIP39.generateMnemonic(256);
        seed = this.BIP39.generateMnemonic(256);
      } else {
        seed = options.seed
      }
      let entropy = this.BIP39.mnemonicToEntropy(seed);
      let wallet = this.CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(entropy, 'hex'),
        Buffer.from(''),
      );
      // eslint-disable-next-line no-unused-vars
      const master_key =  wallet.to_raw_key().to_bech32('addr');
      let account = wallet
        .derive(this.harden(1852))
        .derive(this.harden(1815))
        .derive(this.harden(0))
      const stake_key_private = wallet
        .derive(this.harden(2)) //chimeric
        .derive(this.harden(0))
      const stake_key_public = stake_key_private
        .to_public();
      const stake_key_public_raw = stake_key_public.to_raw_key();
      // eslint-disable-next-line no-unused-vars
      const stake_key_public_raw_hash = stake_key_public_raw.hash();
      const stake_key_public_bech32 = stake_key_public.to_bech32();

      // eslint-disable-next-line no-unused-vars
      let account_public = account.to_public();
      // external chain
      let chain_prv = account.derive(0);
      const newAddresses = {

      };

      let key_prv = null;
      let key_prv_bech32 = null;
      let key_prv_raw = null;
      let key_pub = null;
      let key_pub_bech32 = null;
      let key_pub_raw = null;
      let key_pub_raw_hash = null;
      let base_address = null;
      let enterprise_address = null;
      let base_address_bech32 = null;
      let enterprise_address_bech32 = null;
      let tempAddressData = null;
      let quantity = options.quantity;
      let addedCount = 0;
      let derivationIndex = 0;
      while(addedCount < quantity) {
        if(
          this.accounts[options.network][seed] && (this.accounts[options.network][seed][derivationIndex] !== undefined)
        ){
          ll.debug(`address: skipping address at index ${derivationIndex}, it already exists`);
          derivationIndex++;
          continue;
        } else {
          ll.debug(`address: generating address at index ${derivationIndex}`);
        }

        // private keys
        key_prv = chain_prv.derive(derivationIndex);
        key_prv_bech32 = key_prv.to_bech32();
        // eslint-disable-next-line no-unused-vars
        key_prv_raw = key_prv.to_raw_key();

        // public keys
        key_pub = key_prv.to_public();
        key_pub_bech32 = key_pub.to_bech32();
        // eslint-disable-next-line no-unused-vars
        key_pub_raw = key_pub.to_raw_key();
        // eslint-disable-next-line no-unused-vars
        key_pub_raw_hash = key_pub.to_raw_key().hash();
        base_address = this.CardanoWasm.BaseAddress.new(
          this.CardanoWasm.NetworkInfo[`${options.network}`]().network_id(),
          this.CardanoWasm.StakeCredential.from_keyhash(key_pub.to_raw_key().hash()),
          this.CardanoWasm.StakeCredential.from_keyhash(stake_key_public.to_raw_key().hash()),
        ).to_address();
        enterprise_address = this.CardanoWasm.EnterpriseAddress.new(
          this.CardanoWasm.NetworkInfo[`${options.network}`]().network_id(),
          this.CardanoWasm.StakeCredential.from_keyhash(key_pub.to_raw_key().hash())
        ).to_address();
        base_address_bech32 = base_address.to_bech32(this.getAddressPrefix(options.network));
        enterprise_address_bech32 = enterprise_address.to_bech32(this.getAddressPrefix(options.network));
        tempAddressData = {
          private: {
            key_prv_bech32,
          },
          public: {
            key_pub_bech32,
            stake_key_public_bech32,
            base_address_bech32,
            enterprise_address_bech32
          }
        }
        newAddresses[derivationIndex] = tempAddressData;
        addedCount++;
      }
      if(this.accounts[options.network][seed]){
        this.accounts[options.network][seed] = {...this.accounts[options.network][seed], ...newAddresses};
      } else {
        this.accounts[options.network][seed] = newAddresses
      }
      this.updateAddressMap();
      return newAddresses;
    } catch (e){
      ll.warn("could not create the adddresses", e.message);
      return {}
    }
  }
  this.deleteAccount = function (network, seed){
    delete this.accounts[network][seed];
    this.updateAddressMap();
  }
  this.deleteAddress = function (network, seed, derivationIndex){
    delete this.accounts[network][seed][derivationIndex];
    this.updateAddressMap();
  }
  this.setAccounts = function (newAccounts){
    this.accounts = newAccounts;
    this.updateAddressMap();
  };
  this.updateAddressMap = function (){
    let newAddressMap = {
      mainnet: {}, testnet: {}
    };
    ["mainnet", "testnet"].forEach((network) => {
      Object.keys(this.accounts[network]).forEach((seedKey) => {
        Object.keys(this.accounts[network][seedKey]).forEach((derivationIndexKey) => {
          let tempAddress = this.accounts[network][seedKey][derivationIndexKey].public.base_address_bech32;
          newAddressMap[network][tempAddress] = true;
        })
      })
    })
    this.addressMap = newAddressMap;
  }
  this.hasPrivateKeyOfAddress = function (network, address){
    return this.addressMap[network][address] === true
  };
  this.getAccounts = function () {
    return this.accounts
  };
  this.unsafeSign = function (network, message, address){
    ll.debug(`siging message for address ${address}.`);
    let key_prv_bech32;
    let publicKeys;
    Object.keys(this.accounts[network]).forEach((seedKey) => {
      Object.keys(this.accounts[network][seedKey]).forEach((derivationIndexKey) => {
        let tempAddress = this.accounts[network][seedKey][derivationIndexKey].public.base_address_bech32;
        if(tempAddress === address){
          ll.debug(`found the address ${address} among all accounts`);
          key_prv_bech32 = this.accounts[network][seedKey][derivationIndexKey].private.key_prv_bech32;
          let tempPublicKeys = this.accounts[network][seedKey][derivationIndexKey].public;
          publicKeys = tempPublicKeys;
        } else {
          ll.debug(`comparing ${address} to ${tempAddress}`);
        }
      })
    })

    let signed = null;
    if(key_prv_bech32){
      let key_prv = this.CardanoWasm.Bip32PrivateKey.from_bech32(key_prv_bech32);
      signed = key_prv.to_raw_key().sign(message).to_hex();
      ll.debug(`the message ${message} was signed: ${signed}`);
    } else {
      throw new Error(`Could not sign the message.`, { cause: `The private key for address ${address} is missing.` });
    }
    return JSON.stringify({
      headers: {
        "public-keys": publicKeys
      },
      payload: signed
    });
  }
  this.safeSign = function (network, message, address, appId){
    ll.debug(`siging message for address ${address}.`);
    let key_prv_bech32;
    let publicKeys;
    Object.keys(this.accounts[network]).forEach((seedKey) => {
      Object.keys(this.accounts[network][seedKey]).forEach((derivationIndexKey) => {
        let tempAddress = this.accounts[network][seedKey][derivationIndexKey].public.base_address_bech32;
        if(tempAddress === address){
          ll.debug(`found the address ${address} among all accounts`);
          key_prv_bech32 = this.accounts[network][seedKey][derivationIndexKey].private.key_prv_bech32;
          let tempPublicKeys = this.accounts[network][seedKey][derivationIndexKey].public;
          publicKeys = tempPublicKeys;
        } else {
          ll.debug(`comparing ${address} to ${tempAddress}`);
        }
      })
    })

    // check if the message contains the appId header.
    // the message has to be a valid json with the following structure
    try {
      let sampleMessage = JSON.stringify({
        headers: {
          "app-id": "the-meta",
          "address": "some-address"
        },
        payload: {
          some: "property"
        }
      });
      let parsedMessage = JSON.parse(message);
      let parsedAppId = parsedMessage.headers["app-id"];
      if(!parsedAppId || parsedAppId.trim() === ""){
        throw new Error(`Will not sign a message without a valid app-id header. Example of a valid message: ${JSON.stringify(sampleMessage)}`)
      }
      if(appId !== parsedAppId){
        throw new Error(`Will not sign a message because the app-id header does not match with the settings. You provided: ${JSON.stringify({
          appId,
          parsedAppId
        })}`)
      }
    } catch (e){
      throw e;
    }

    let signed = null;
    if(key_prv_bech32){
      let key_prv = this.CardanoWasm.Bip32PrivateKey.from_bech32(key_prv_bech32);
      signed = key_prv.to_raw_key().sign(message).to_hex();
      ll.debug(`the message ${message} was signed: ${signed}`);
    } else {
      throw new Error(`Could not sign the message.`, { cause: `The private key for address ${address} is missing.` });
    }
    return JSON.stringify({
      headers: {
        "public-keys": publicKeys
      },
      payload: signed
    });
  }
  this.verify = function (network, message, verificationResponseMessage, originatorAddress){
    let parsedSigned = JSON.parse(verificationResponseMessage);
    let payload = parsedSigned.payload;
    let headers = parsedSigned.headers;
    let publicKeys = headers["public-keys"];

    let signatureIsVerified = false;
    let addressCanBeDerivedFromPublicKeys = false;
    if(
      publicKeys.key_pub_bech32 !== undefined
      && publicKeys.stake_key_public_bech32 !== undefined
    ){
      let key_pub = this.CardanoWasm.Bip32PublicKey.from_bech32(publicKeys.key_pub_bech32);
      let stake_key_pub = this.CardanoWasm.Bip32PublicKey.from_bech32(publicKeys.stake_key_public_bech32);

      let signatureObject = this.CardanoWasm.Ed25519Signature.from_hex(payload);
      signatureIsVerified = key_pub.to_raw_key().verify(message, signatureObject);

      let reconstructedBaseAddress = this.CardanoWasm.BaseAddress.new(
        this.CardanoWasm.NetworkInfo[`${network}`]().network_id(),
        this.CardanoWasm.StakeCredential.from_keyhash(key_pub.to_raw_key().hash()),
        this.CardanoWasm.StakeCredential.from_keyhash(stake_key_pub.to_raw_key().hash()),
      ).to_address();
      let reconstructedBaseAddress_bech32 = reconstructedBaseAddress.to_bech32(this.getAddressPrefix(network));
      addressCanBeDerivedFromPublicKeys = reconstructedBaseAddress_bech32 === originatorAddress;
    } else {
      throw new Error("could not verify the message signature. ensure that the public keys include the key_pub_bech32 and stake_key_public_raw_hash keys.");
    }
    ll.debug(`the message ${message} has a valid signature ${payload} from address ${originatorAddress}: ${signatureIsVerified}`);
    ll.debug(`the address ${originatorAddress} can be reconstructed from the public keys in the header: ${addressCanBeDerivedFromPublicKeys}`);
    return signatureIsVerified && addressCanBeDerivedFromPublicKeys;
  }
}
