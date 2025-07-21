window.calcAverage = (grades) => {
  if (!grades.length) return null;
  let total = 0, weight = 0;
  for (const { grade, credits } of grades) {
    if (!isNaN(grade)) {
      total += grade * credits;
      weight += credits;
    }
  }
  return weight ? (total / weight).toFixed(2) : null;
};