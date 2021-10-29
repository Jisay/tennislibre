const axios = require('axios');
const querystring = require('querystring');

const { URLS, SCRIPTS } = require('../constants.js');

const login = (email, pwd) => {
  return axios
    .post(
      `${URLS.tennislibre}${SCRIPTS.login}`,
      querystring.stringify({
        email,
        pwd,
      }),
      {
        maxRedirects: 0,
      },
    )
    .catch((error) => {
      return error.response;
    });
};

const getPhpSessId = async (email, pwd) => {
  try {
    const { headers } = await login(email, pwd);

    return headers['set-cookie'][0].split('=')[1].split(';')[0];
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  login,
  getPhpSessId,
};
