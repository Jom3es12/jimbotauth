const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://jom3es12.com:50451/api/discord/callback');

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify+email+guilds&response_type=code&redirect_uri=${redirect}`);
});
router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  const json = await response.json();
const response2 = await fetch(`http://discordapp.com/api/users/@me`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${json.access_token}`,
      },
    });

const json2 = await response2.json()
console.log(json)
console.log(json2)

//console.log(json.access_token)
  res.redirect(`/`);
}));

module.exports = router;
