//get variables
var url = 'https://www.balldontlie.io/api/v1/'
var buttonTab = $('#allTeams')
var currentdate = moment().format('YYYY-MM-DD');
var dateEl = $('#currentDayDisplay');
var mainPageScores = $('#todayScores')
var teamScores  = $('#teamScores')


var storedPlayers = [];

displayMain(currentdate)

teamScores.hide()

$('#searchBtn').on('click', function(){
  getSeasonAverageSinglePlayer($('#searchBar').val());
  storedPlayers.push($('#searchBar').val());
  saveToLocalStorage($('#searchBar').val());

  $('#content').append(
    `
  <h2>${$('#searchBar').val()}</h2>
  <tr>
  <th><b>Season</b></th>

    <th>Games Played</th>
    <th>Minutes</th>
    <th>Points</th>
    <th>Assists</th>
    <th>Rebounds</th>
    <th>Defensive Rebounds</th>
    <th>Offensive Rebounds</th>
    <th>Blocks</th>
    <th>Steals</th>
    <th>Turnovers</th>
    <th>FG Made</th>
    <th>FG Attempte</th>
    <th>FG Percent</th>
    <th>FT Made</th>
    <th>FT Attempted</th>
    <th>FT Percent</th>
  </tr>
  `)
})


//set the date on top of the 
dateEl.text(moment().format("MMM Do, YYYY"));
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
    buttonTab.append(`<button class="btn btn-primary" type="button">${teams[i]['full_name']} </button>`)}

  var teamBtns = $('#allTeams button')

//Tell the btn what to do on click event
  teamBtns.on('click', function(event){
    var t = $(this).index() + 1
    var teamClicked = teamBtns[$(this).index()].innerHTML
    loadTeamInfo(t)
    

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


//Get the average of a single player if full name is typed in
function getSeasonAverageSinglePlayer(player){
  //fetch ('https://www.balldontlie.io/api/v1/season_averages?season=2020', {
   console.log(player)
  fetch (`https://www.balldontlie.io/api/v1/players?search=${player}`, {  
    method: 'GET'
  }).then (function (response) { 

    return response.json();

  }).then(function (data){
    //console.log(data.data)
    var id = data.data[0].id
    var currentYear = moment().format('YYYY');
    var seasons = [];
    //console.log(seasons)
    for (var i =1; i < 20; i++){
      seasons.push(currentYear - i)
    }
    seasons = seasons.sort()
    for (var i =0; i < seasons.length; i++){
  fetch (`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${id}&season=${seasons[i]}`, {  
      method: 'GET'
  }).then(function (response){
    return response.json();
  }).then (function (data){
     if (data.data.length > 0){
      
      var gamesPlayed = data.data.season;
      var minutes = data.data.min;
      var points = data.data.pts;
      var ast = data.data.ast;
      var rebounds = data.data.reb;
      var dreb = data.data.dreb;
      var oreb = data.data.oreb;
      var block = data.data.blk;
      var steals =data.data.stl;
      var turnovers =data.data.turnovers;
      var fouls = data.data.pf;
      var fgM  = data.data.fgm;
      var fgA = data.data.fgA;
      var fgPercent = data.data.fg_pct;
      var ftM = data.data.ftm;
      var ftA = data.data.fta;
      var frPercent= data.data.ft_pct;
    } 
  })
}
})
}; 

//getSeasonAverageSinglePlayer('Anthony Davis')


//Get the score for the current date and then add 
function displayMain(date){
  fetch(`https://www.balldontlie.io/api/v1/games?start_date=[]${date}&end_date=[]${date}`, {
  method: 'GET'
}).then(function (response) {
    return response.json();
}) .then(function (data) {
    for (var i = 0; i < data.data.length; i++){

      var homeTeam = data.data[i].home_team.full_name
      var awayTeam = data.data[i].visitor_team.full_name
      var homeTeamScore = data.data[i].home_team_score
      var awayTeamScore = data.data[i].visitor_team_score
      var date = currentdate;
      var startTime = data.data[i].status
      var text =''

      if (startTime.includes(':')){
        text ='Start Time: '
      }else{
        text = 'Quarter: '
      }

     mainPageScores.append(`
     <section class = scoreUpdateCard>
     <h2> ${date} </h2>
     <p> ${text} ${startTime}
     <p>${homeTeam}: ${homeTeamScore} </p>

     <p>${awayTeam}: ${awayTeamScore} </p> 

     <p> </p>
     
     </section>`
      ) 
    }
  });

}


function loadTeamInfo(team){
  
  
  teamScores.html('')

  var endDate = moment().add(5, 'days')
  endDate = endDate.format('YYYY-MM-DD');
  var startDate = moment().subtract(5, 'days');
  startDate = startDate.format('YYYY-MM-DD');
  fetch(`https://www.balldontlie.io/api/v1/games?start_date=[]${startDate}&end_date=[]${endDate}&per_page=100`, {
    method: 'GET'
  }).then(function (response) {
      return response.json();
  }).then(function (data) {
    //console.log(data.data.home_team.full_name == team)

    mainPageScores.html('')
    teamScores.show()
    
    var allGames = []
    for (var i = 0; i < data.data.length; i++){
      if (data.data[i].home_team.id == team || data.data[i].visitor_team.id == team){


        allGames.push(data.data[i].date.slice(0,10))
        allGames = allGames.sort()
      }
  }

  for (var i = 0; i < allGames.length; i++){
    for (var j = 0; j < data.data.length; j++){
      if (data.data[j].home_team.id == team || data.data[j].visitor_team.id == team){

        if (data.data[j].date.slice(0,10) == allGames[i]){

          var date = data.data[j].date.slice(0,10)
          var homeTeam = data.data[j].home_team.full_name
          var awayTeam = data.data[j].visitor_team.full_name
          var homeTeamScore = data.data[j].home_team_score
          var awayTeamScore = data.data[j].visitor_team_score
          var status = data.data[j].status
          var spanColorHome = ''
          var spanColorAway =''
          if (status == 'Final'){
            if (homeTeamScore > awayTeamScore){
              spanColorHome = 'green';
              spanColorAway = 'red'
            }else{
              spanColorAway = 'green';
              spanColorHome = 'red'
            }
          }
          console.log(spanColorHome)
          teamScores.append(`
          <h2> ${date} </h2>
          <p> <span style = "background-color: ${spanColorHome}">${homeTeam}:  ${homeTeamScore} <span> </p>
          <p> <span style = "background-color:  ${spanColorAway}">${awayTeam}:  ${awayTeamScore} <span> </p>

          <p> ${status} </p>

          `)
        }


      }
  }
  
}
  })
}








var saveToLocalStorage = function(player){
  localStorage.setItem("players", JSON.stringify(storedPlayers))
}


$('#clearBtn').on('click', function(){
  //$('#newButtons').html('');
  //localStorage.clear('cities');
})