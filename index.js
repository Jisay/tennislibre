const find = require('lodash/find');
require('dotenv').config();

const useUser = require('./models/user');
const { getNextReservationDay } = require('./helpers/date');

const { BOOKING, COURTS } = require('./constants');

const run = async () => {
  try {
    // init users:
    // - get their php session id
    // - get their pending bookings
    const doubleUser = await useUser(
      process.env.DOUBLE_USER_EMAIL,
      process.env.DOUBLE_USER_PASSWORD,
    );
    const simpleUser = await useUser(
      process.env.SIMPLE_USER_EMAIL,
      process.env.SIMPLE_USER_PASSWORD,
    );

    await Promise.all([doubleUser, simpleUser]);

    // define the next reservation day
    const nextResevationDay = getNextReservationDay();

    // launch the magic :-)
    // get next pending resa for double
    const nextPendingDoubleBooking = doubleUser.getNextPendingBooking(
      nextResevationDay,
      BOOKING.beginHour,
      BOOKING.endHour,
    );

    const nextPendingSimpleBooking = simpleUser.getNextPendingBooking(
      nextResevationDay,
      BOOKING.beginHour,
      BOOKING.endHour,
      false,
    );

    // if pending double resa
    if (nextPendingDoubleBooking) {
      // this mean there is a pending resa in double
      // check if there is a better court
      const courtIndex = COURTS.indexOf(nextPendingDoubleBooking.courtId);
      if (courtIndex > 0) {
        await doubleUser.makeBestBooking(
          {
            momentDay: nextResevationDay,
            beginHour: BOOKING.beginHour,
            endHour: BOOKING.endHour,
          },
          COURTS.slice(0, courtIndex),
          true,
          nextPendingDoubleBooking,
        );
      }
    } else {
      // no pending double
      // check if simple is booked
      if (nextPendingSimpleBooking) {
        // cancel it
        const res = await simpleUser.cancelPendingBooking(
          nextPendingSimpleBooking,
        );
      }

      // make the best book for double
      await doubleUser.makeBestBooking(
        {
          momentDay: nextResevationDay,
          beginHour: BOOKING.beginHour,
          endHour: BOOKING.endHour,
        },
        COURTS,
      );

      // and book in simple for next week
      await simpleUser.makeBestBooking(
        {
          momentDay: nextResevationDay.clone().add(1, 'week'),
          beginHour: BOOKING.beginHour,
          endHour: BOOKING.endHour,
        },
        COURTS,
        false,
      );
    }

    const nextWeekReservationDay = nextResevationDay.clone().add(1, 'week');
    const nextWeekPendingSimpleBooking = simpleUser.getNextPendingBooking(
      nextWeekReservationDay,
      BOOKING.beginHour,
      BOOKING.endHour,
      false,
    );

    if (nextWeekPendingSimpleBooking) {
      const nextCourtIndex = COURTS.indexOf(
        nextWeekPendingSimpleBooking.courtId,
      );
      if (nextCourtIndex > 0) {
        await simpleUser.makeBestBooking(
          {
            momentDay: nextWeekReservationDay,
            beginHour: BOOKING.beginHour,
            endHour: BOOKING.endHour,
          },
          COURTS.slice(0, nextCourtIndex),
          false,
          nextWeekPendingSimpleBooking,
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

run();
