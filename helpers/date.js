const moment = require('moment');

const { BOOKING } = require('../constants');

const getNextReservationDay = (
  weekDay = BOOKING.weekDay,
  endHour = BOOKING.endHour,
) => {
  const curDate = moment();
  const curWeekDay = curDate.isoWeekday();

  if (curWeekDay < weekDay) {
    // the resa is for current week
    return moment().day(weekDay);
  }

  if (
    curWeekDay > weekDay ||
    (curWeekDay === curDate.weekDay && hour() >= endHour)
  ) {
    // if day is passed or if current day is the resa day and hour is passed
    // this mean we need to add one week
    return curDate.add(1, 'week').day(weekDay);
  }

  return moment();
};

const formatWeekDay = (weekDayMoment) => {
  return weekDayMoment.format('YYYYMMDD');
};

module.exports = {
  getNextReservationDay,
  formatWeekDay,
};
