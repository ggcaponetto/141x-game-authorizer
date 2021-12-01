import * as BIP39 from "bip39"

import chai from "chai";
import WalletModule from "../src/components/wallet/Wallet.js";
import * as CardanoWasmModule from "@emurgo/cardano-serialization-lib-nodejs";

const Wallet = WalletModule.default;
const CardanoWasm = CardanoWasmModule.default;

let mockAccounts = {
  "mainnet": {
    "sense edit prize october affair click process tail face room rifle blanket quick arrow guide quantum vendor slim eye wine melody volume slam marriage": {
      "0": {
        "private": {
          "key_prv_bech32": "xprv1wr0y6zu4gpdavpm9ftsfw88rpd7udch8rs23uzx4eec4qqlfj9ghwdsshjwdadlspn4csaxvel9rwc8c2nv5pkrlk3af44mmxregds3qa36gc5ew6a95nrwm3fqyeglpz4kfa8p6k94dp3za7rmg695u7gtzdkfg"
        },
        "public": {
          "key_pub_bech32": "xpub1m7ujchneqrkc7sxr6wmqfpy2rgeq38pmnlay2p2x6efhkde4kejjpmr533fja46tfxxahzjqfj37z9tvn6wr4vt26rz9mu8k35tfeus27cgs9",
          "stake_key_public_bech32": "xpub1hmfn3y9thuqdl6l6lcgvplv95lmq73mxa9ppg70qrjx7dgd740yfnkak89jmat933xdvzs205j4wr6kzy7fs9rty7x4n77yxe8zvvrs6ptx5z",
          "base_address_bech32": "addr1qx4fp8s09hd4t9zz2ghxcs9a0rtjdr6lhj6ewjyf54fvp77mnztj2w42z9ah5a6zxuw36vldakq6yaphqdhzq3sv9qws5n0cnx",
          "enterprise_address_bech32": "addr1vx4fp8s09hd4t9zz2ghxcs9a0rtjdr6lhj6ewjyf54fvp7c568jyd"
        }
      }
    },
    "math frequent team alien change adjust rich tumble apple capital please sustain scale aspect exhaust off must nerve business shove sibling gadget post nation": {
      "0": {
        "private": {
          "key_prv_bech32": "xprv1gpve9gkgpelqp2fvpx6crav403aqz6tmwdjzpc6suhymjy2fnfzrejmntcnw35hp4trcwpynf2fznjxsg89q7tvmvugn3v3dvtjggr5xxua0e6e6ewrf56jxs8g26ra4v99lkxaq8k9pldasqc20z362k5ngqvhw"
        },
        "public": {
          "key_pub_bech32": "xpub1fx635dfuzk4yrss85us7w7y7yxl7q9mpqxyhn3d5dmq9az4gyx0gvde6ln4n4juxnf4ydqws458m2c2tlvd6q0v2r7mmqps579r54dg4c9rw8",
          "stake_key_public_bech32": "xpub1s54zjl30e85kssl84zv8ld0nzc2xlg65dnldajhwpu8mdr8lqzqjmsrc3d8lysx4w92jlyfevcdwjhy2gf63urr3saefepxmdss5wqcpfk25w",
          "base_address_bech32": "addr1q96y806xrl8ejede8qfe00gnxzunm2a9m4egle6654eu99z58uv0jrl74qkxug5nfun5w9ejecq7j53qpk5e2ygvpxwsdyafrq",
          "enterprise_address_bech32": "addr1v96y806xrl8ejede8qfe00gnxzunm2a9m4egle6654eu99qy9drgd"
        }
      }
    }
  },
  "testnet": {
    "wolf dawn confirm toss disease dial plate garlic execute achieve shoulder jump junior pottery depend uphold city anchor junior obvious palace mountain broom moral": {
      "0": {
        "seed": "wolf dawn confirm toss disease dial plate garlic execute achieve shoulder jump junior pottery depend uphold city anchor junior obvious palace mountain broom moral",
        "private": {
          "key_prv_bech32": "xprv1qzctulrn3j49e8krc5xq56p0329xe65ls8zs0hhla5vq7hjsj9z2p4wgugfdvnawx8mvvd0mz0z6xt5a3d847y45902rnyzxzpq3sm5xg07asnkucc4vjv9g7cehskaqtn3vvwzww7uzayuw3utpxkpaw537epa8"
        },
        "public": {
          "key_pub_bech32": "xpub1rx9m9ky59uwfqgerveqxvtvvav9wah94r56pajjd3fv9ufcjg0wcvslamp8de332eyc23a3n0pd6qh8zccuyuaac96fcarckzdvr6ag66rezj",
          "stake_key_public_bech32": "xpub1ak3lsnc5kylzwwky6xv58p4hn2kgtcuv63jd94wygeaqxxl5h4sz9w34ea6dthwws46j76zz7td2cpq0t47w069fwcsdc9lldulkmzq29rg9n",
          "base_address_bech32": "addr1qryukcxjtpz0zm80ngu5wakghkjmn0uwqshl66ggau7uc7e6xpk0valuer52efjpjxrjhm995qat89j5y2qnpu463cvsm4tjzc",
          "enterprise_address_bech32": "addr1vryukcxjtpz0zm80ngu5wakghkjmn0uwqshl66ggau7uc7cy2antg"
        }
      }
    },
    "pigeon position proof small fit loyal panther like erupt start brother moral truly stem school staff student net universe focus message radio burger sun": {
      "0": {
        "seed": "pigeon position proof small fit loyal panther like erupt start brother moral truly stem school staff student net universe focus message radio burger sun",
        "private": {
          "key_prv_bech32": "xprv1qpv7v90k9u8uy9jl246xufvgxmgddpzswxrg4nwa8catclvzfpdm30t9l7xvpa5ajus96n2n50pta55ah2lv566c4fv47pyuqaezpdqsd69e64fsr2w0duvxts8zmxla0ap5hcxwhqp62670049gtejf75ydv3c5"
        },
        "public": {
          "key_pub_bech32": "xpub1qdv5ffpef2nwlpv6vfa2lrplukfphrpkn5y3ywxjrnul22c9w8fpqm5tn42nqx5u7mccvhqw9kdl6l6rf0svawqr544u7l22shnynagn6grz4",
          "stake_key_public_bech32": "xpub122sclt9njhggtsntjeyw0tjgqjy98gfav3svh9msaw6dzccvw6s8zwwhs27xxr3y00eaptc5z4mpd8y0yymd4dvwn9luqzalzmd4mrsdp8f5f",
          "base_address_bech32": "addr1qzelu7xsnka7qg86km4kmk9smprkvk23zae8ple0j5a3zfd34sjqx45haufm9eq36gl7q4xu02fvp333cef5gyma6vzs8qpqfy",
          "enterprise_address_bech32": "addr1vzelu7xsnka7qg86km4kmk9smprkvk23zae8ple0j5a3zfg6vj702"
        }
      }
    },
  }
}

describe('Wallet', function() {
  describe('#new()', function() {
    it('creates a wallet', async function() {
      let wallet = new Wallet(CardanoWasm, BIP39, "mainnet");
      chai.expect(typeof wallet).to.equal("object");
    });
  });
  describe('#setAccounts()', function() {
    it('should be able to set and get accounts', async function() {
      let wallet = new Wallet(CardanoWasm, BIP39, "mainnet");
      wallet.setAccounts(mockAccounts);
      let returnedAccounts = wallet.getAccounts();
      chai.expect(JSON.stringify(mockAccounts)).to.equal(JSON.stringify(returnedAccounts));
    });
  });
  describe('#sign()', function() {
    it('should be able to sign arbitrary data on the mainnet', async function() {
      let wallet = new Wallet(CardanoWasm, BIP39);
      wallet.setAccounts(mockAccounts);
      let network = "mainnet";
      // message signing
      let message = "hello world";
      let seedKeys = Object.keys(mockAccounts[network]);
      let derivationIndexKeys =  Object.keys(mockAccounts[network][seedKeys[0]]);
      let address = mockAccounts[network][`${seedKeys[0]}`][derivationIndexKeys[0]].public.base_address_bech32;
      let signed = wallet.unsafeSign(network, message, address);
      let returnedAccounts = wallet.getAccounts();
      chai.expect(JSON.stringify(mockAccounts)).to.equal(JSON.stringify(returnedAccounts));
      let vefifies = wallet.verify(network, message, signed, address);
      chai.expect(vefifies).to.equal(true);
    });
    it('should be able to sign arbitrary data on the testnet', async function() {
      let wallet = new Wallet(CardanoWasm, BIP39);
      wallet.setAccounts(mockAccounts);
      let network = "testnet";
      // message signing
      let message = "hello world";
      let seedKeys = Object.keys(mockAccounts[network]);
      let derivationIndexKeys =  Object.keys(mockAccounts[network][seedKeys[0]]);
      let address = mockAccounts[network][`${seedKeys[0]}`][derivationIndexKeys[0]].public.base_address_bech32;
      let signed = wallet.unsafeSign(network, message, address);
      let returnedAccounts = wallet.getAccounts();
      chai.expect(JSON.stringify(mockAccounts)).to.equal(JSON.stringify(returnedAccounts));
      let vefifies = wallet.verify(network, message, signed, address);
      chai.expect(vefifies).to.equal(true);
    });
    it('should not sign unsafe messages on the main and testnet (no appId)', async function() {
      let wallet = new Wallet(CardanoWasm, BIP39);
      wallet.setAccounts(mockAccounts);
      let networks = [
        "mainnet", "testnet"
      ];
      networks.forEach((network) => {
        // message signing
        let message = JSON.stringify({
          headers: {
            "app-id": "the-hoskyverse"
          },
          payload: {
            some: "property"
          }
        });
        let seedKeys = Object.keys(mockAccounts[network]);
        let derivationIndexKeys =  Object.keys(mockAccounts[network][seedKeys[0]]);
        let address = mockAccounts[network][`${seedKeys[0]}`][derivationIndexKeys[0]].public.base_address_bech32;
        chai.expect(()=>{wallet.safeSign(network, message, address)}).to.throw();
      })
    });
    it('should not sign unsafe messages on the main and testnet (empty appId)', async function() {
      let wallet = new Wallet(CardanoWasm, BIP39);
      wallet.setAccounts(mockAccounts);
      let networks = [
        "mainnet", "testnet"
      ];
      networks.forEach((network) => {
        // message signing
        let message = JSON.stringify({
          headers: {
            "app-id": "the-hoskyverse"
          },
          payload: {
            some: "property"
          }
        });
        let seedKeys = Object.keys(mockAccounts[network]);
        let derivationIndexKeys =  Object.keys(mockAccounts[network][seedKeys[0]]);
        let address = mockAccounts[network][`${seedKeys[0]}`][derivationIndexKeys[0]].public.base_address_bech32;
        chai.expect(()=>{wallet.safeSign(network, message, address, "")}).to.throw();
      })
    });
    it('should not sign unsafe messages on the main and testnet (empty appId)', async function() {
      let wallet = new Wallet(CardanoWasm, BIP39);
      wallet.setAccounts(mockAccounts);
      let networks = [
        "mainnet", "testnet"
      ];
      networks.forEach((network) => {
        // message signing
        let message = JSON.stringify({
          headers: {
            "app-id": "the-hoskyverse"
          },
          payload: {
            some: "property"
          }
        });
        let seedKeys = Object.keys(mockAccounts[network]);
        let derivationIndexKeys =  Object.keys(mockAccounts[network][seedKeys[0]]);
        let address = mockAccounts[network][`${seedKeys[0]}`][derivationIndexKeys[0]].public.base_address_bech32;
        chai.expect(()=>{wallet.safeSign(network, message, address, "the-hoskyverse")}).to.not.throw();
      })
    });
  });
});
