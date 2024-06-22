function getCurrentSemesterAndYear() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentSemester = currentMonth < 5 ? 'Spring' : currentMonth < 8 ? 'Summer' : 'Fall';

  return { currentSemester, currentYear };
}

function isPastSemester(semester, year) {
  const { currentSemester, currentYear } = getCurrentSemesterAndYear();
  if (year < currentYear) {
    return true;
  } else if (year === currentYear) {
    const semesterOrder = { "Spring": 1, "Summer": 2, "Fall": 3 };
    return semesterOrder[semester] < semesterOrder[currentSemester];
  }
  return false;
}

module.export = {
  getCurrentSemesterAndYear,
  isPastSemester
}