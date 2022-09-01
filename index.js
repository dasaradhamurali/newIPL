const csv = require('csv-parser')
const fs = require('fs')

const path = require('path')
//const pathFile=path.join(__dirname,'../data/matches.csv')
const matches = [];

fs.createReadStream('../data/matches.csv')
  .pipe(csv())
  .on('data', (data) => matches.push(data))
  .on('end', () => {
    //console.log(matches);



    const deliveries = [];

    fs.createReadStream('../data/deliveries.csv')
      .pipe(csv())
      .on('data', (data) => deliveries.push(data))
      .on('end', () => {
        //console.log(deliveries);
        numberFoMatchsPlayedAllSeason(matches)
        numberFoMatchsEachTeamWonEachYear(matches)
        ExtraRunEachTeam2016(matches, deliveries)
        topEconomicalBowersIn2015(matches, deliveries)
      })


  });


function numberFoMatchsPlayedAllSeason(matches) {
  let dataOfAllSeason = {}
  for (let i = 0; i < matches.length; i++)
    if (dataOfAllSeason[matches[i].season]) {
      dataOfAllSeason[matches[i].season] += 1

    } else {
      dataOfAllSeason[matches[i].season] = 1
    }

  //console.log(dataOfAllSeason);
}


//Number of matches won per team per year in IPL.

function numberFoMatchsEachTeamWonEachYear(matches) {
  let wonPerTeamPerYear = {}

  for (let i = 0; i < matches.length; i++) {

    if (wonPerTeamPerYear[matches[i].season]) {
      if (wonPerTeamPerYear[matches[i].season][matches[i].winner]) {

        wonPerTeamPerYear[matches[i].season][matches[i].winner] += 1

      } else {
        wonPerTeamPerYear[matches[i].season][matches[i].winner] = 1
      }
    } else {
      let matchesEachYear = {}

      matchesEachYear[matches[i].winner] = 1
      wonPerTeamPerYear[matches[i].season] = matchesEachYear
    }

  }
  //console.log(wonPerTeamPerYear)
}


//Extra runs conceded per team in the year 2016


function ExtraRunEachTeam2016(matches, deliveries) {
  let extraRunsEachTeam = {}
  for (let i = 0; i < matches.length; i++) {

    if (matches[i].season == 2016) {

      for (let index = 0; index < deliveries.length; index++) {

        if (matches[i].id === deliveries[index].match_id) {

          if (extraRunsEachTeam[deliveries[index].bowling_team]) {

            extraRunsEachTeam[deliveries[index].bowling_team] += parseInt(deliveries[index].extra_runs)

          } else {
            extraRunsEachTeam[deliveries[index].bowling_team] = parseInt(deliveries[index].extra_runs)
          }
        }
      }
    }


  }
  //console.log(extraRunsEachTeam)
}


//Top 10 economical bowlers in the year 2015


function topEconomicalBowersIn2015(matches, deliveries) {

  let economicalBowers = {}

  for (let i = 0; i < matches.length; i++) {

    if (matches[i].season == 2015) {

      for (let index = 0; index < deliveries.length; index++) {

        if (matches[i].id === deliveries[index].match_id) {

          if (economicalBowers[deliveries[index].bowler]) {

            economicalBowers[deliveries[index].bowler].balls += 1

            economicalBowers[deliveries[index].bowler].runs += parseInt(deliveries[index].total_runs)
          } else {

            let runsAndBalls = {}

            runsAndBalls.balls = 1

            runsAndBalls.runs = parseInt(deliveries[index].total_runs)
            
            economicalBowers[deliveries[index].bowler] = runsAndBalls
          }
        }
      }

    }
  }
  //console.log(economicalBowers)
  let econonicData = {}
  for (key in economicalBowers) {
    let total = Math.floor([economicalBowers[key].runs] / [economicalBowers[key].balls / 6] * 10) / 10

    econonicData[key] = total

  }
  let result = Object.entries(econonicData).sort((a, b) => a[1] - b[1]).slice(0, 10);

  console.log(result)
}






