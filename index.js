const fs = require("fs-extra");
const express = require("express");
const { ping, main } = require("./ping.js");
const fetch = require("cross-fetch");

const app = express();

app.use(express.static('site'));

app.put("/", express.json(), async (req, res) => {
  let username = req.body.username;
  let repl = req.body.repl;

  if ((await fetch(`https://replit.com/@${username}/${repl}`)).status === 404) {
    return res.json({ error: "You literally entered an incorrect repl"})
  }

  const replData = {
    user: username,
    name: repl
  }

  const dt = JSON.parse(fs.readFileSync("repls.json"));
  dt.push(replData);

  fs.writeFileSync("repls.json", JSON.stringify(dt));

  return res.json({ ok: "done"})
})

app.listen(3000, () => {
  console.log(`Started server`);
  const json = require("./uptime.json");
  json.push((new Date()).toISOString());

  fs.writeFileSync("uptime.json", JSON.stringify(json));
})


main(async () => {
  return JSON.parse(fs.readFileSync("repls.json"))
})