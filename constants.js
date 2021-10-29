require('dotenv').config();

const URLS = {
  tennislibre: 'https://www.tennislibre.com',
};

const SCRIPTS = {
  login: '/tennis/front/dologin.php',
  book: '/tennis/front/reserve/take_m_reservation.php',
  checkDisponibility: '/tennis/front/reserve/verifajaxresa.php',
  myBookings: '/tennis/front/reserve/myresa.php',
  deleteBooking: '/tennis/front/common/ajdeleteresa.php',
};

const COOKIE = {
  domain: 'www.tennislibre.com',
};

const COURTS = [2363, 2364, 2366];
const COURTS_NAMES = {
  'Court Daniel Lagast': 2363,
  'Court 2': 2364,
  Bulle: 2366,
};

const BOOKING = {
  weekDay: 3,
  beginHour: 20,
  endHour: 21,
};

const PLAYERS = [
  {
    id: process.env.PLAYER1_ID,
    name: process.env.PLAYER1_NAME,
  },
  {
    id: process.env.PLAYER2_ID,
    name: process.env.PLAYER2_NAME,
  },
  {
    id: process.env.PLAYER3_ID,
    name: process.env.PLAYER3_NAME,
  },
  {
    id: process.env.PLAYER4_ID,
    name: process.env.PLAYER4_NAME,
  },
];

module.exports = {
  URLS,
  SCRIPTS,
  COOKIE,
  BOOKING,
  COURTS,
  COURTS_NAMES,
  PLAYERS,
};
