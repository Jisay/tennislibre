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
    id: 166852,
    name: 'ALLEMAN Jean-Christophe',
  },
  {
    id: 167853,
    name: 'CNOCKAERT Aurélien',
  },
  {
    id: 167477,
    name: 'DELBECQ Davy',
  },
  {
    id: 167793,
    name: 'DECONINCK François',
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
