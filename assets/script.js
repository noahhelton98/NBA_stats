
var url = 'https://www.balldontlie.io/api/v1/'
var buttonTab = $('#allTeams')
var currentdate = moment().format('YYYY-MM-DD');

var dateEl = $('#currentDayDisplay')

dateEl.text(currentdate).css('color:black');

let teams = [];

/* fetch('https://www.balldontlie.io/api/v1/games?start_date=[]2021-03-29&end_date=[]2021-03-29', {
  method: 'GET'
}).then(function (response) {
    return response.json();
}) .then(function (data) {
    console.log(data);
  });
 */


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

  console.log(teamBtns.text())

  teamBtns.on('click', function(event){
    event.preventDefault();
    var t = $(this).index() + 1
    displayTeams(t)

  })


  }) 




function displayTeams(teamName){
  fetch(`https://www.balldontlie.io/api/v1/teams/${teamName}`, {
    method: 'GET'
  }).then(function (response) {
      return response.json();
  }) .then(function (data) {
    console.log(data)
  })
}


console.log(currentdate)