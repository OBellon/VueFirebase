const comparatorRank = function(a, b) {
  a.points = parseInt(a.points);
  a.matches = parseInt(a.matches);
  a.key = parseInt(a.key);
  b.points = parseInt(b.points);
  b.matches = parseInt(b.matches);
  b.key = parseInt(b.key);
  if (a.points > b.points) {
    return -1;
  } else if (a.points < b.points) {
    return 1;
  } else if (a.matches < b.matches) {
    return 1;
  } else if (a.matches > b.matches) {
    return -1;
  } else {
    return a.key < b.key;
  }
} 

export default comparatorRank;