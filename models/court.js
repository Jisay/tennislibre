const { formatWeekDay } = require('../helpers/date');
const { checkCourtDisponibility } = require('../helpers/court');

const useCourt = (courtId) => {
  const checkDisponibility = async (
    sessionId,
    momentDay,
    beginHour,
    endHour,
  ) => {
    const data = await checkCourtDisponibility(sessionId, courtId, {
      day: formatWeekDay(momentDay),
      beginHour,
      endHour,
    });

    return {
      enabled: data.statusSuccess ? true : false,
      courtId,
    };
  };

  return {
    courtId,
    checkDisponibility,
  };
};

module.exports = useCourt;
