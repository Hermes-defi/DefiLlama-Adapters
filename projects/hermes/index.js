const sdk = require("@defillama/sdk");
const { getCompoundV2Tvl } = require("../helper/compound");
const { staking } = require("../helper/staking");
const hermesBar = "0x28A4E128f823b1b3168f82F64Ea768569a25a37F";
const sHermes = "0x8812420fb6E5d971C969CcEF2275210AB8D014f0";
const hermesToken = "0xba4476a302f5bc1dc4053cf79106dc43455904a3";
//LENDING
const comptroller = "0x0000000000000000000000000000000000000000";
const { getChainTvl } = require("../helper/getUniSubgraphTvl");
const graphUrls = {
  harmony: "https://graph.hermesdefi.io/subgraphs/name/exchange",
};

module.exports = {
  timetravel: true,
  doublecounted: false,
  misrepresentedTokens: true,
  methodology:
    'We calculate liquidity on all pairs with data retreived from the "hermes-defi/hermes-graph" subgraph. The staking portion of TVL includes the HermesTokens within the HermesBar contract.',
  harmony: {
    tvl: sdk.util.sumChainTvls([
      getChainTvl(graphUrls, "factories", "liquidityUSD")("harmony"),
      //LENDING
      getCompoundV2Tvl(
        comptroller,
        "harmony",
        (addr) => `harmony:${addr}`,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000"
      ),
    ]),
    //LENDING
    borrowed: getCompoundV2Tvl(
      comptroller,
      "harmony",
      (addr) => `harmony:${addr}`,
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
      true
    ),
    staking:
      staking(hermesBar, hermesToken, "harmony") +
      staking(sHermes, hermesToken, "harmony"),
  },
};
