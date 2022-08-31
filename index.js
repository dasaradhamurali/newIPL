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
           if(matches[i].id === deliveries[index].match_id){
               if(extraRunsEachTeam[deliveries[index].bowling_team]){
                    extraRunsEachTeam[deliveries[index].bowling_team] += parseInt(deliveries[index].extra_runs)
               }else{
                extraRunsEachTeam[deliveries[index].bowling_team] = parseInt(deliveries[index].extra_runs)
               }
           }
      }
    }
  

  }
  console.log(extraRunsEachTeam)
}




