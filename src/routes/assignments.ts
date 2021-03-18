import express from "express";
import { query } from "express-validator";
import { AuthorizedReq } from "../types";
import { validate } from "../validate";
const router = express.Router();

const ps1 = `

Vasya came to the store to buy goods for his friends for the New Year. It turned out that he was very lucky — today the offer "k of goods for the price of one" is held in store.
<br/>
Using this offer, Vasya can buy exactly k of any goods, paying only for the most expensive of them. Vasya decided to take this opportunity and buy as many goods as possible for his friends with the money he has.
<br/>
More formally, for each good, its price is determined by ai — the number of coins it costs. Initially, Vasya has p coins. He wants to buy the maximum number of goods. Vasya can perform one of the following operations as many times as necessary:

    Vasya can buy one good with the index i if he currently has enough coins (i.e p≥ai). After buying this good, the number of Vasya's coins will decrease by ai, (i.e it becomes p:=p−ai).
    Vasya can buy a good with the index i, and also choose exactly k−1 goods, the price of which does not exceed ai, if he currently has enough coins (i.e p≥ai). Thus, he buys all these k goods, and his number of coins decreases by ai (i.e it becomes p:=p−ai). 

<b><p>Please note that each good can be bought no more than once.</p></b>
<br/>
For example, if the store now has n=5 goods worth a1=2,a2=4,a3=3,a4=5,a5=7, respectively, k=2, and Vasya has 6 coins, then he can buy 3 goods. A good with the index 1 will be bought by Vasya without using the offer and he will pay 2 coins. Goods with the indices 2 and 3 Vasya will buy using the offer and he will pay 4 coins. It can be proved that Vasya can not buy more goods with six coins.
`;

router.get("/", query("assignmentId").exists(), validate, async function (req: AuthorizedReq, res) {
  console.log("HERE");
  res.json({
    id: 0,
    name: "Assignment I",
    start: new Date(0).toString(),
    end: new Date(Date.now() + 36000).toString(),
    problems: [
      {
        name: "Problem A",
        statement: ps1,
        language: "C",
        testcases: [
          {
            input: "42",
            output: "42",
          },
        ],
      },
      {
        name: "Problem B",
        statement: "<b>Problem Statement II</b>",
        language: "C",
        testcases: [
          {
            input: "43",
            output: "43",
          },
        ],
      },
    ],
  });
});

export default router;
