const axios = require('axios');
const { parse } = require('node-html-parser');
const querystring = require('querystring');

const { formatWeekDay } = require('./date');
const useBooking = require('../models/booking');

const { URLS, SCRIPTS, COURTS_NAMES, PLAYERS } = require('../constants');

const getDoubleBookingData = (data) => {
  return {
    ...data,
    typepartner: 'dubble',
    idmember: null,
    commentvalue_member: '',
    nominvite: '',
    commentvalue_invite: '',
    commentvalue_tournament: '',
    nb_db_invite: 0,
    name_dubble_1: PLAYERS[0].name,
    dubble_1: PLAYERS[0].id,
    name_dubble_2: PLAYERS[1].name,
    dubble_2: PLAYERS[1].id,
    name_dubble_3: PLAYERS[2].name,
    dubble_3: PLAYERS[2].id,
    name_dubble_4: PLAYERS[3].name,
    dubble_4: PLAYERS[3].id,
    commentvalue_dubble: '',
  };
};

const getSimpleBookingData = (data) => {
  return {
    ...data,
    typepartner: 'member',
    commentvalue_member: '',
    nominvite: '',
    commentvalue_invite: '',
    commentvalue_tournament: '',
    nb_db_invite: 0,
    name_idmember: PLAYERS[2].name,
    idmember: PLAYERS[2].id,
    commentvalue_dubble: '',
  };
};

const makeBooking = async (
  sessionId,
  courtId,
  { momentDay, beginHour, endHour },
  isDouble,
) => {
  const sharedData = {
    couleurbordure: '',
    idcourt: courtId,
    dateday: formatWeekDay(momentDay),
    page: 1,
    tmstdeb: momentDay.clone().hour(beginHour).startOf('hour').format('X'),
    tmstfin: momentDay.clone().hour(endHour).startOf('hour').format('X'),
    pagetoredirect: 'responsive_day.php',
  };

  const data = isDouble
    ? getDoubleBookingData(sharedData)
    : getSimpleBookingData(sharedData);

  return axios.post(
    `${URLS.tennislibre}${SCRIPTS.book}`,
    querystring.stringify(data),
    {
      headers: {
        Cookie: `PHPSESSID=${sessionId};`,
      },
    },
  );
};

const getPendingBookings = async (sessionId) => {
  const myBookingsResult = await axios.get(
    `${URLS.tennislibre}${SCRIPTS.myBookings}`,
    {
      params: {
        delay: 'not',
      },
      headers: {
        Cookie: `PHPSESSID=${sessionId};`,
      },
    },
  );

  const root = parse(myBookingsResult.data);
  const resaTable = root.getElementsByTagName('table')[1];

  if (!resaTable) {
    return [];
  }

  const bookings = [];

  const resaLines = resaTable.getElementsByTagName('tr');
  resaLines.shift();
  resaLines.forEach((line) => {
    const cols = line.getElementsByTagName('td');
    const lastCol = cols.pop();
    if (lastCol.getElementsByTagName('img').length) {
      const hours = cols[1].innerHTML.split('�');
      bookings.push(
        useBooking({
          id: lastCol.id.replace('my_td_', ''),
          courtId: COURTS_NAMES[cols[2].innerHTML],
          day: cols[0]
            .getElementsByTagName('a')[0]
            .getAttribute('href')
            .split('=')[1],
          beginHour: parseInt(hours[0].trim().split('h')[0], 10),
          endHour: parseInt(hours[1].trim().split('h')[0], 10),
          isDouble: cols[4].innerHTML.includes(','),
        }),
      );
    }
  });

  return bookings;
};

const cancelBooking = async (sessionId, id, courtId, day) => {
  return axios.post(
    `${URLS.tennislibre}${SCRIPTS.deleteBooking}`,
    querystring.stringify({
      idresaplm: id,
      idcourt: courtId,
      dateday: day,
    }),
    {
      headers: {
        Cookie: `PHPSESSID=${sessionId};`,
      },
    },
  );
};

module.exports = {
  cancelBooking,
  makeBooking,
  getPendingBookings,
};
