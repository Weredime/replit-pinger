const fetch = require("cross-fetch")

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
/**
  @param {string} username The username of the repl owner
  @param {string} repl The repl name
  @param {number} block The repl block
*/
const ping = module.exports.ping = async (username, repl, block) => {
  const startTime = Date.now()
  try {
    const res = await fetch(getReplURL(username, repl || username));
  } catch {
    // I dont care what happens
  }

  console.log(`[BLOCK ${block}]: ${username}/${repl || username}(${(Date.now() - startTime) / 1000})`);
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

    console.log(`There are ${chunks.length} chunks`)

    Promise.all(chunks.map((chunk, ind) => Promise.all(chunk.map(dt => ping(...dt, ind+1)))))

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