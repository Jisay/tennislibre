const axios = require('axios');

const { URLS, SCRIPTS } = require('../constants');

const checkCourtDisponibility = async (
  sessionId,
  courtId,
  { day, beginHour, endHour },
) => {
  const response = await axios.get(
    `${URLS.tennislibre}${SCRIPTS.checkDisponibility}`,
    {
      params: {
        jdateday: day,
        jheuredeb: beginHour,
        jminutedeb: 0,
        jheurefin: endHour,
        jminutefin: 0,
        jismo: 0,
        jisdb: 0,
        jidcourt: courtId,
      },
      withCredentials: true,
      headers: {
        Cookie: `PHPSESSID=${sessionId};`,
      },
    },
  );

  return response.data;
};

module.exports = {
  checkCourtDisponibility,
};
