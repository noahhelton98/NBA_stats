//get variables
var url = 'https://www.balldontlie.io/api/v1/'
var buttonTab = $('#allTeams')
var currentdate = moment().format('YYYY-MM-DD');

var dateEl = $('#currentDayDisplay')
//set the date on top of the 
dateEl.text( moment().format("MMM Do, YYYY"));
let teams = [];



//Fetch the teams and display them as buttons like a nav bar vertically
fetch('https://www.balldontlie.io/api/v1/teams', {
  method: 'GET'
}).then(function (response) {
    return response.json();
}) .then(function (data) {
  
  for (var i = 0; i < data.data.length; i++){
    teams.push(data.data[i]) 
  }

  for (var i = 0; i <teams.length; i++){
    buttonTab.append(`<button class="btn btn-primary" type="button">${teams[i]['full_name']} </button>`)
  }
  var teamBtns = $('#allTeams button')
//Tell the btn what to do on click event
  teamBtns.on('click', function(event){
    event.preventDefault();
    var t = $(this).index() + 1
    displayTeams(t)

  })

  }) 



//Display the team names function (for the buttons in the initial fetch statement)
function displayTeams(teamName){
  fetch(`https://www.balldontlie.io/api/v1/teams/${teamName}`, {
    method: 'GET'
  }).then(function (response) {
      return response.json();
  }) .then(function (data) {
    console.log(data)
  })
}


function getPlayers (teamName){
  //fetch('https://www.balldontlie.io/api/v1/players')
  return true
}

function getStats(team, player){
  //fetch
  return true
}


//Get the average of a single player if full name is typed in
function getSeasonAverageSinglePlayer(player){
  //fetch ('https://www.balldontlie.io/api/v1/season_averages?season=2020', {
   
  fetch (`https://www.balldontlie.io/api/v1/players?search=${player}`, {  
    method: 'GET'
  }).then (function (response) { 
    return response.json();
  }).then(function (data){
    console.log(data.data)
    var id = data.data[0].id

    //Maybe make a drop down menu of all the seasons and allow you to choose which one you want to look at, have default be the last 5
    var currentYear = moment().format('YYYY')
    var seasons = []
    console.log(seasons)
    for (var i =1; i < 6; i++){
      seasons.push(currentYear - i)
    }

    for (var i =0; i < seasons.length; i++){
      console.log(seasons[i])
  fetch (`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${id}&season=${seasons[i]}`, {  
      method: 'GET'
  }).then(function (response){
    return response.json();
  }).then (function (data){
    console.log(data.data)

  })
}
})
};

getSeasonAverageSinglePlayer('Anthony Davis')


//Get the score for the current date and then add 
function getTodaysScores(date){
  fetch(`https://www.balldontlie.io/api/v1/games?start_date=[]${date}&end_date=[]${date}`, {
  method: 'GET'
}).then(function (response) {
    return response.json();
}) .then(function (data) {
    console.log(data.data[0].home_team.full_name);
    for (var i = 0; i < data.data.length; i++){
      console.log(data.data[i].home_team.full_name, data.data[i].visitor_team.full_name)
      console.log(data.data[i].home_team_score, data.data[i].visitor_team_score)
      console.log(data.data[i].period)
    }
  });

}

function getLastFiveScores(date, team){
  return true;
}


function setScores(){
  return true;
}

getTodaysScores(currentdate);


