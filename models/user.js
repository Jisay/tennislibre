const find = require('lodash/find');

const { getPhpSessId } = require('../helpers/session');
const {
  getPendingBookings,
  makeBooking,
  cancelBooking,
} = require('../helpers/booking');
const { formatWeekDay } = require('../helpers/date');

const useCourt = require('./court');

const useUser = async (email, password) => {
  const sessionId = await getPhpSessId(email, password);
  const pendingBookings = await getPendingBookings(sessionId);

  const getNextPendingBooking = (momentDay, start, end, double = true) => {
    return find(pendingBookings, ({ day, beginHour, endHour, isDouble }) => {
      return (
        day === formatWeekDay(momentDay) &&
        beginHour === start &&
        endHour === end &&
        isDouble === double
      );
    });
  };

  const cancelPendingBooking = async (pendingBooking) => {
    return cancelBooking(
      sessionId,
      pendingBooking.id,
      pendingBooking.courtId,
      pendingBooking.day,
    );
  };

  const makeBestBooking = async (
    { momentDay, beginHour, endHour },
    courtIds,
    isDouble = true,
    pendingBooking = null,
  ) => {
    const disponibilitiesPromises = courtIds.map(async (courtId) => {
      const { checkDisponibility } = useCourt(courtId);
      return await checkDisponibility(sessionId, momentDay, beginHour, endHour);
    });

    const disponibilities = await Promise.all(disponibilitiesPromises);
    const betterDisponibilityAvailable = find(disponibilities, {
      enabled: true,
    });

    if (betterDisponibilityAvailable) {
      // cancel pending booking
      if (pendingBooking) {
        await cancelPendingBooking(pendingBooking);
      }
      return makeBooking(
        sessionId,
        betterDisponibilityAvailable.courtId,
        { momentDay, beginHour, endHour },
        isDouble,
      );
    }

    return Promise.resolve(false);
  };

  return {
    // public properties
    email,
    password,
    sessionId,
    pendingBookings,
    // public methods
    getNextPendingBooking,
    makeBestBooking,
    cancelPendingBooking,
  };
};

module.exports = useUser;
