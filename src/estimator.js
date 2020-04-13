export const getNumberOfDays = (periodType, timeToElapse) => {
  let days;
  switch (periodType) {
    case 'days':
      days = timeToElapse;
      break;
    case 'weeks':
      days = timeToElapse * 7;
      break;
    case 'months':
      days = timeToElapse * 30;
      break;
    default:
      days = 0;
      break;
  }
  return Math.trunc(days);
};

const covid19ImpactEstimator = (data) => {
  // CHALLENGE 1
  const result = {
    data,
    impact: {},
    severeImpact: {}
  };

  result.impact.currentlyInfected = Math.trunc(data.reportedCases * 10);
  result.severeImpact.currentlyInfected = Math.trunc(data.reportedCases * 50);

  const days = getNumberOfDays(data.periodType, data.timeToElapse);
  const factor = Math.trunc(days / 3);

  result.impact.infectionsByRequestedTime = Math.trunc(result.impact.currentlyInfected
    * (2 ** factor));
  result.severeImpact.infectionsByRequestedTime = Math.trunc(result.severeImpact.currentlyInfected
    * (2 ** factor));

  // CHALLENGE 2

  result.impact.severeCasesByRequestedTime = Math.trunc(
    result.impact.infectionsByRequestedTime * 0.15
  );
  result.severeImpact.severeCasesByRequestedTime = Math.trunc(
    result.severeImpact.infectionsByRequestedTime * 0.15
  );

  const availableBeds = data.totalHospitalBeds * 0.35;
  result.impact.hospitalBedsByRequestedTime = Math.trunc(availableBeds
    - result.impact.severeCasesByRequestedTime);
  result.severeImpact.hospitalBedsByRequestedTime = Math.trunc(availableBeds
    - result.severeImpact.severeCasesByRequestedTime);

  // CHALLENGE 3

  result.impact.casesForICUByRequestedTime = Math.trunc(result.impact.infectionsByRequestedTime
    * 0.05);
  result.severeImpact.casesForICUByRequestedTime = Math.trunc(
    result.severeImpact.infectionsByRequestedTime * 0.05
  );

  result.impact.casesForVentilatorsByRequestedTime = Math.trunc(
    result.impact.infectionsByRequestedTime * 0.02
  );
  result.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    result.severeImpact.infectionsByRequestedTime * 0.02
  );

  result.impact.dollarsInFlight = Math.trunc((result.impact.infectionsByRequestedTime
    * data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation) / days);
  result.severeImpact.dollarsInFlight = Math.trunc((result.severeImpact.infectionsByRequestedTime
    * data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation) / days);

  return result;
};

export default covid19ImpactEstimator;
