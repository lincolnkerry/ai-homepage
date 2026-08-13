---
title: "Zero-Knowledge Proofs"
date: "2020-06-01"
author: "seungminkim"
category: "web3"
summary: "영지식 증명관련 국문설명자료 링크 영지식 증명의 정의와, 활용 예: 비대면 의사결정 (온라인 투표) 시스템 영지식 증명의 분류: 대화형, NIZK, zk-SNARK 대화형 영지식 증명: Schnorr 프로토콜 NIZK: Fiat-Shamir Heuristic ZK-SNARK: Groth16 프로토콜 (1) ZK-SNARK…"
source: "heungno.net WordPress archive"
---

영지식 증명관련 [국문설명자료](https://heungno.net/wp-content/uploads/2020/06/GIST-ZKP-기술보고서5.pdf) 링크

1. [영지식 증명의 정의와, 활용 예: 비대면 의사결정 (온라인 투표) 시스템](https://jehyukss.wordpress.com/2020/09/12/306/)
2. [영지식 증명의 분류: 대화형, NIZK, zk-SNARK](https://jehyukss.wordpress.com/2020/09/12/%ec%98%81%ec%a7%80%ec%8b%9d-%ec%a6%9d%eb%aa%85%ec%9d%98-%eb%b0%9c%ec%a0%84%eb%90%9c-%ec%a0%95%ec%9d%98%ec%99%80-%eb%b6%84%eb%a5%98-nizk-zk-snark/)
3. [대화형 영지식 증명: Schnorr 프로토콜](https://jehyukss.wordpress.com/2020/09/15/493/)
4. [NIZK: Fiat-Shamir Heuristic](https://jehyukss.wordpress.com/2020/09/16/698/)
5. [ZK-SNARK: Groth16 프로토콜 (1)](https://jehyukss.wordpress.com/2020/09/16/zk-snark-groth16-%ed%94%84%eb%a1%9c%ed%86%a0%ec%bd%9c-1/)
6. [ZK-SNARK: Groth16 프로토콜 (2)](https://jehyukss.wordpress.com/2020/09/17/884/)
7. [ZK-SNARK: Groth16 프로토콜 (3)](https://jehyukss.wordpress.com/2020/09/17/1001/)
8. [ZK-SNARK: Groth16 프로토콜 (4)](https://jehyukss.wordpress.com/2020/09/20/1232/)
9. [Groth16 프로토콜의 MATLAB 구현과 실습](https://jehyukss.wordpress.com/2020/09/20/1452/)

[Groth16 프로토콜의 MATLAB 구현체 다운로드 & 실행 (Download and run a MATLAB implementation of Groth16 protocol)](https://codeocean.com/capsule/8850121/tree)

---

What is zero-knowledge proof?

In cryptography, a zero-knowledge proof or zero-knowledge protocol is a method by which one party (the prover) can prove to another party (the verifier) that they know a value x, without conveying any information apart from the fact that they know the value x. The essence of zero-knowledge proofs is that it is trivial to prove that one possesses knowledge of certain information by simply revealing it; the challenge is to prove such possession without revealing the information itself or any additional information. (Wikipedia)

---

**Formal definition**

Suppose a prover proves to a verifier that a statement is true. Both prover and verifier follow a proving protocol. The protocol is a zero-knowledge proof if and only if it satisfies the following three properties:

1. **Completeness**: if the statement is true, the verifier will be convinced of this statement by the protocol.
2. **Soundness**: if the statement is false, the protocol never convince the verifier that it is true.
3. **Zero-knowledge**: if the statement is true, the verifier learns nothing other than the fact that the statement is true. For example, when the statement is "Prover knows the secret password *x* to open a door," the verifier never learn the secret information *x*.

The first two of these are properties of general proof systems. The third is what makes the proof zero-knowledge.

---

**Simple example: Fining Waldo (Wally)** *(https://blockgeeks.com/guides/what-is-zksnarks/)*

Finding Waldo is a game where you have to find “Waldo” among a sea of people. It is a simple “Spot the guy” game:

![What is zkSNARKs: Funny Moon Math ](https://heungno.net/wp-content/uploads/2017/08/image3.jpg)

And Waldo looks like this:

![What is zkSNARKs: Funny Moon Math ](https://heungno.net/wp-content/uploads/2017/08/image2.jpg)

Ok, so where does the concept of Zero Knowledge come in here? Imagine there are two people Anna and Carl. Anna tells Carl that she knows where Wally is but she doesn’t want to show him where exactly he is. So, how can she prove to him that she has found Wally without showing his exact position?

There was, an interesting paper by Naor, Naor and Reingold which shows two Zero Knowledge solutions to this problem. There is a “Mid-Tech Solution” and a “Low-Tech Solution”. Let’s discuss both of them.

## **Mid-Tech Solution**

The reason why this solution is “mid-tech” is because our prover and verifier need access to a photocopy machine to make this work. So this is how it goes. First, Anna and Carl would make a photocopy of the original game. Then Anna, whilst making sure that Carl isn’t looking, will cut out Waldo from the photocopy and then destroy the leftovers. After that she can show the Waldo cut out to Carl and prove that she did know where Waldo was after all without pinpointing his exact location to Carl.

There are problems with this solution. While it does fulfill the “Zero Knowledge” criteria, it doesn’t fulfill the “Soundness” criteria. There are many ways that Anna could have cheated here. She could have had a random Waldo cut out with her from the very beginning and could have just shown it to Carl without actually knowing where Waldo was. So what is the solution to this?

The solution to this is meticulous and careful testing. Firstly, Anna and Carl will take a photocopy of the game. Then Carl will draw a distinctive pattern at the back of the photocopy. After that, Carl will escort Anna to a room where she will be isolated and have no chance of cheating whatsoever. If Anna comes out with a cutout of Waldo, then Carl can be convinced that she actually knew where Waldo was without revealing the solution. They can repeat this experiment multiple times and Carl can compare the different cutouts of Waldo to be even further sure about the validity of Anna’s claim.

## **Low-Tech Solution**

This solution required very basic equipment. The idea is simple. Get a huge cardboard, one that is twice the size of the game and cut out a small rectangle on it. Now, when Carl isn’t looking, Anna can move the cardboard on the game in such a way that the rectangle is directly on top of Waldo. Now, she can tell Carl to have a look and this is what he will see:

![What is zkSNARKs: Funny Moon Math ](https://heungno.net/wp-content/uploads/2017/08/image5-3.png)

Image Courtesy: Applied Kid Cryptography by Naor And Reingold

So, while Carl may get a very basic idea of where Waldo actually can be, he doesn’t know the exact location. Anna has hence proved to Carl that she knows where Waldo is without pinpointing his exact location.
