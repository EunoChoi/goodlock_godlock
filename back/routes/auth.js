const express = require("express");
const axios = require("axios");
const router = express.Router();

//naver login
router.post("/naverlogin", async (req, res) => {
  const { client_id, client_secret, redirect_uri, code, state } = req.body;

  let getTokenUrl = "https://nid.naver.com/oauth2.0/token";
  getTokenUrl += `?grant_type=authorization_code`;
  getTokenUrl += `&client_id=${client_id}`;
  getTokenUrl += `&client_secret=${client_secret}`;
  getTokenUrl += `&redirect_uri=${redirect_uri}`;
  getTokenUrl += `&code=${code}`;
  getTokenUrl += `&state=${state}`;

  access_token = await axios.get(getTokenUrl).then(res => res.data.access_token);
  console.log(access_token);
  const user = await axios.get('https://openapi.naver.com/v1/nid/me',
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  const email = user.data.response.email;
  const profilePic = user.data.response.pprofile_image;

  res.status(200).json({ email, profilePic })
});

module.exports = router;