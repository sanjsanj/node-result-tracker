const totalWrapper = document.getElementById("total__wrapper");

function buildTotal(results) {
  const confirmedResults = results.filter(result => result.confirmed);
  const winners = _.uniq(confirmedResults.map(result => result.winner));
  const resultsObject = winners.reduce((acc, val) => {
    acc[val] = confirmedResults.filter(result => result.winner === val).length;
    return acc;
  }, {});

  winners.forEach(winner => {
    const text = document.createElement("p");
    text.innerText = `${winner}: ${resultsObject[winner]} wins`;
    totalWrapper.appendChild(text);
  });
}

export { buildTotal };
