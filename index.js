const fs = require("fs-extra");
const express = require("express");
const { ping, main } = require("./ping.js");
const fetch = require("cross-fetch");

const app = express();

app.use(express.static('site'));

app.put("/", express.json(), async (req, res) => {
  let username = req.body.username;
  let repl = req.body.repl;

  const re = await fetch(`https://replit.com/@${username}/${repl}`, {
    headers: {
      "User-Agent": "Mozilla 5.0"
    }
  });

  const { status } = re;

  const dt = JSON.parse(fs.readFileSync("repls.json"));
  
  if (status !== 200) {
    console.log(`Somebody tried to add ${username}/${repl} but it didnt work :haha: - ${status}`)
    return res.json({ error: "invalid repl"})
  } else {

    const ids = dt.map(d => `@${d.user}/${d.name || d.user}`.toLowerCase());

  if (ids.indexOf(`@${username}/${repl}`.toLowerCase()) != -1) {
    return res.json({ error: "This repl has already been added!" })
  }
  }
  console.log(`Somebody is adding ${username}/${repl}`)

  const replData = {
    user: username,
    name: repl
  }

  
  
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