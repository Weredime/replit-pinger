const fetch = require("cross-fetch")

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
/**
  @param {string} username The username of the repl owner
  @param {string} repl The repl name
  @param {number} block The repl block
*/
const ping = module.exports.ping = async (username, repl, block) => {
  const startTime = Date.now()
  const res = await fetch(getReplURL(username, repl));

  console.log(`[BLOCK ${block}]: ${username}/${repl}(${(Date.now() - startTime) / 1000})`);
}

module.exports.main = async (getRepls) => {
  while (true) {
    const repls = await getRepls();
    const chunks = [[]];
    let i = 0;

    for (const repl of repls) {
      i++;
      if (chunks[chunks.length - 1].length === 10) {
        chunks.push([])
      }

      chunks[chunks.length - 1].push([repl.user, repl.name])
    }

    i = 0;
    for (const chunk of chunks) {
      i++
      await Promise.all(chunk.map(dt => ping(...dt, i)))
    }

    await sleep(10000)
  }
}

function getReplURL(username, repl) {
  let url = `${username.toLowerCase()}.repl.co/`
  if (username.toLowerCase() === repl.toLowerCase()) {
    return `https://${url}`
  }
  return `https://${repl.toLowerCase()}.${url}`
}