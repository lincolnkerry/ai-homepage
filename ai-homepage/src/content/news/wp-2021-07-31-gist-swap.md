---
title: "GIST Swap"
date: "2021-07-31"
author: "heungno"
category: "web3"
summary: "GIST Swap Service Testing Site GIST Swap은 Uniswap을 기반으로 합니다. Swap은 간단하게 말하면 자동화된 토큰 환전소입니다. Uniswap에 관한 자세한 내용은 공식 Uniswap 웹 사이트( https://uniswap.org/ )를 참조하십시오. GIST Swap 서비스는 비상업…"
source: "heungno.net WordPress archive"
---

[GIST Swap Service Testing Site](https://gistswap.org)

```
 
```

GIST Swap은 Uniswap을 기반으로 합니다. Swap은 간단하게 말하면 자동화된 토큰 환전소입니다. Uniswap에 관한 자세한 내용은 공식 Uniswap 웹 사이트(<https://uniswap.org/>)를 참조하십시오. GIST Swap 서비스는 비상업용 라이선스로 제공됩니다. 즉, GIST는 상업적 이득을 추구하지 않으며 연구 및 교육 목적으로 활용할 계획입니다. 현재 Ropsten 네트워크라는 이더리움 테스트넷에서 실행됩니다. 추후 이더리움 메인넷에서 스왑 서비스가 실행되는 고급 옵션이 포함된 버전을 출시할 예정입니다. 고급 옵션에서 참가자는 토큰 스왑을 사용할 수 있을 뿐만 아니라 유동성을 제공하여 수익도 얻을 수 있습니다.

GIST Swap은 주로 Pool과 Swap으로 구성됩니다. 누구나 새로운 풀을 열거나 기존 풀에 추가할 수 있습니다. 각 풀은 한 쌍의 토큰으로 구성됩니다. 특정 풀은 유동성이 제공되면 스왑 요청에 응할 수 있는 상태가 됩니다. 한 쌍의 토큰이 풀에 충분한 량으로 공급되면 유동성이 제공됩니다. GIST Swap에서 스왑 대상이 되는 토큰은 이더리움 기반 토큰(ERC-20)입니다. 한 쌍의 토큰(예: 토큰 A와 토큰 B)으로 구성된 풀을 가정해 봅시다. 충분한 량의 토큰A와 토큰B가 풀에 제공되어 있다고 가정합니다. 가령, 토큰A가 100개가 있고, 토큰B는 50개 입니다. 이제 토큰 A 한 개를 토큰 B와 교환하려는 거래자 철수가 있다고 가정해 봅니다. 환율은 자동화된 시장 형성 (AMM) 알고리즘에 의해 결정됩니다. 교환비율은 풀에 남아 있는 두 자산의 양을 기준으로 각 거래에 따라 조정됩니다.

상기한 예에 따르면, 토큰 A를 B로 교환할 때 환율은 100:50 입니다. 즉, 철수는 토큰A 1.0 개를 풀에 제공하고, 토큰B를 0.5개 교환 받습니다. 철수는 거래 수수료(토큰 A 1.0개의 0.3%), 즉 토큰A 0.003개를 풀에 제공해야합니다. 풀은 수수료로 받은 토큰A 0.003개를 풀에 저장합니다.

요약하면 철수는 이 거래를 위해 토큰A 1.003개를 제공했고 토큰B 0.5개를 지급 받습니다. 거래가 완료된 후 풀의 상태는 토큰 A 101.003개 와 토큰B 49.5개가 됩니다. 다음거래에 적용되는 교환비율은 101.003:49.5가 되므로, 토큰B는 약간 비싸지고, 토큰 A는 약간 값싸게 됨을 알 수 있습니다. 교환거래를 거듭하면, 수요가 높은 토큰의 값은 비싸게되고, 수요가 낮은 토큰의 값은 싸게 되는 것 입니다. 유동성을 제공한 참가자는 추후 언제든지 풀에 축적된 교환 수수료를 징수할 수 있습니다.

각각 고유한 토큰 쌍을 가진 다양한 풀을 만들 수 있습니다.

GIST Swap is based on Uniswap. It is a decentralized token exchange. For more information about Uniswap, visit the official Uniswap website (https://uniswap.org/). The GIST Swap service is provided under a non-commercial license. In other words, GIST does not seek commercial gain but intends to utilize it for research and educational purposes. It currently runs on an Ethereum testnet called the Ropsten network. In the future, we plan to release a version with an Advanced option to run the swap service on the Ethereum mainnet. The Advanced option will allow participants to use swaps as well as provide liquidity to earn profits.

GIST Swap mainly consists of Pool and Swap. Anyone can open a new pool or add to an existing one. Each pool consists of a pair of tokens. Any pool will be ready to respond to swap requests as long as liquidity is provided into it. Liquidity provision is made when a pair of tokens is supplied each in sufficient quantity to the pool. The tokens serviced for GIST Swap are Ethereum-based tokens (ERC-20).

Let us give an example. We have a pool for a pair of tokens, token A and token B. It is assumed that "sufficient" amounts of tokens A and B have been provided into the pool. For example, there are 100 tokens A and 50 tokens B. Now suppose there is a trader who wants to exchange 1 token A for token B.

The exchange rate is determined by an automated market making (AMM) algorithm. The exchange rate is determined for each transaction based on the amounts of the two assets currently remaining in the pool.

According to the example above, the token A to B exchange ratio is 100:50. In other words, the trader shall give 1.0 token A to the pool in order to get 0.5 token B in return. The trader shall also pay the transaction fee (0.3% of the input asset token A), i.e. 0.003 tokens A, to the pool.

In summary, the trader provided a total of 1.003 tokens A to the pool and received 0.5 tokens B from the pool. After the transaction is completed, the status of the pool is 101.003 tokens A and 49.5 tokens B (Version 2). The pool stores the fee into the pool. Participants who have provided liquidity to this pool can collect at any time the accumulated exchange fees from the pool.

You can create as many different pools as you want, each with its own token pair.
