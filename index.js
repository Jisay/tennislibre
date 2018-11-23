require('./tennislibre.constants.js');

const request = require('request-promise');
const moment = require('moment');
require('dotenv').config();

function login() {
  return request({
    method: 'POST',
    uri: `${CONSTANTS.urls.tennislibre}${CONSTANTS.scripts.login}`,
    form: {
      email: process.env.LOGIN_EMAIL,
      pwd: process.env.LOGIN_PASSWORD,
    },
    resolveWithFullResponse: true,
  }).catch((responseBody) => {
    if (responseBody.statusCode === 302) {
      return responseBody;
    }

    console.log('Something went wrong during login');
    process.exit(1);
  });
}

function reserve(cookies) {
  let phpSessIdCookie;

  // try to get PHPSESSID
  cookies.forEach((cookie) => {
    if (cookie.indexOf('PHPSESSID') > -1) {
      phpSessIdCookie = cookie;
    }
  });

  if (!phpSessIdCookie) {
    return null;
  }

  phpSessIdCookie = phpSessIdCookie.split('=');

  // get the next week day of the reservation (next sunday for example)
  const nextReservationWeekDay = moment().day(process.env.RESERVE_WEEKDAY);

  return request({
    method: 'POST',
    uri: `${CONSTANTS.urls.tennislibre}${CONSTANTS.scripts.reserve}`,
    resolveWithFullResponse: true,
    headers: {
      Cookie: `PHPSESSID=${phpSessIdCookie[1].split(';')[0]};`
    },
    form: {
      couleurbordure: '',
      idcourt: 2363,
      dateday: nextReservationWeekDay.format('YYYYMMDD'),
      page: 1,
      tmstdeb: nextReservationWeekDay.clone().hour(process.env.RESERVE_BEGIN_HOUR).startOf('hour').format('X'),
      tmstfin: nextReservationWeekDay.clone().hour(process.env.RESERVE_END_HOUR).startOf('hour').format('X'),
      pagetoredirect: 'responsive_day.php',
      typepartner: 'dubble',
      idmember: null,
      commentvalue_member: '',
      nominvite: '',
      commentvalue_invite: '',
      commentvalue_tournament: '',
      nb_db_invite: 0,
      name_dubble_1: process.env.RESERVE_DUBBLE_NAME_1,
      dubble_1: process.env.RESERVE_DUBBLE_1,
      name_dubble_2: process.env.RESERVE_DUBBLE_NAME_2,
      dubble_2: process.env.RESERVE_DUBBLE_2,
      name_dubble_3: process.env.RESERVE_DUBBLE_NAME_3,
      dubble_3: process.env.RESERVE_DUBBLE_3,
      name_dubble_4: process.env.RESERVE_DUBBLE_NAME_4,
      dubble_4: process.env.RESERVE_DUBBLE_4,
      commentvalue_dubble: '',
    }
  }).catch((responseBody) => {
    if (responseBody.statusCode === 302) {
      return responseBody;
    }

    console.log('Something went wrong during reservation', responseBody);
    process.exit(1);

  });
}

console.log('AUTO RESERVE COURT ON TENNISLIBRE.COM');
console.log('Trying to login');

return login(true).then((body) => {
  console.log('Login success');
  console.log('Trying to reserve court');

  const reserveResponse = reserve(body.response.headers['set-cookie']);

  if (!reserveResponse) {
    console.log('Something went wrong during reserve, no PHPSESSID cookie found.');
    return null;
  }

  return reserveResponse.then((response) => {
    console.log('Reservation success!');
  });
});
