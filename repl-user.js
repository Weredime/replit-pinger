const fetch = require("cross-fetch");

module.exports = async function (user) {
  const res = await fetch(`https://replit.com/graphql`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json"
    }
  })
}