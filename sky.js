import {weather} from './app.js';
var cans=document.getElementById('cons');
var condition=document.getElementById('feelslike');
var temp=document.getElementById('temperature');
var place=document.getElementById('area');

// TO DO
var taskform=document.getElementById('taskentry');
var taskin=document.getElementById('taskinput');
var taskcont=document.getElementById('taskcontainer');
var clearall=document.getElementById('clearbtn');
// var taskSample=['Play Soccer','Repair Car','Pay Bills'];

var taskStorage=JSON.parse(localStorage.getItem('Tasks'))!==null?JSON.parse(localStorage.getItem('Tasks')):[];
// SKYCONS IMPLEMENTATION // WEATHER DOM
export  function cloudy(val){
var atrib=val.weather[0].main.toLowerCase();
var skyval;
var today = new Date();
var h = today.getHours();
var icons = new Skycons({"color": "orange"});
switch(atrib){
  case 'clouds':
    if(h>=19){
    icons.add(cans, Skycons.PARTLY_CLOUDY_NIGHT);
    }
    else{icons.add(cans, Skycons.PARTLY_CLOUDY_DAY);}
    break;
  case 'clear':
    if(h>=19){
      icons.add(cans, Skycons.CLEAR_NIGHT);
    }
    else{icons.add(cans, Skycons.CLEAR_DAY);}
    break;
  case 'mist':
  case 'smoke':
  case 'haze':
  case 'dust':
  case 'fog':
  case 'sand':
    icons.add(cans, Skycons.FOG);
    break;
  case 'snow':
    icons.add(cans, Skycons.SNOW);
    break;
  case 'rain':
  case 'drizzle':
    icons.add(cans, Skycons.RAIN);
    break;
  case 'thunderstorm':
    icons.add(cans, Skycons.SLEET);
    break;
}
icons.play();
temp.innerHTML=`<span>${val.main.temp}</span><span>&deg;c</span>`;
condition.innerText=`${val.weather[0].main}`;
place.innerText=`${val.name}`;
}

// Task

function displayTask(val){
let netask=document.createElement('li');
netask.classList.add('task');
netask.innerHTML=`<span>${val}</span> <span class="mark"></span><span class="closetask">x</span>`;
taskcont.appendChild(netask);
}

function showTask(){
  taskcont.innerHTML='';
  updatetaskStorage();
  taskStorage.forEach(displayTask);
}

showTask();


function updatetaskStorage(){
  localStorage.setItem('Tasks',JSON.stringify(taskStorage));
}

// TASK LISTNERS
taskform.addEventListener('submit',(e)=>{
e.preventDefault();
  if(taskin.value==''){
  alert('Please add Task');
  return;
}
  if(taskStorage.length>9){
    alert('Cant add more');
    return;
  }
taskStorage.push(taskin.value);
showTask();
})


// TASK CLOSE
taskcont.addEventListener('click',(e)=>{
  if(e.target.className=='closetask'){
   e.target.parentElement.childNodes[2].classList.add('stroke');
   let elem=e.target.parentElement.firstChild.innerText;
   setTimeout(()=>{
    taskStorage=taskStorage.filter(item=>{return item!==elem});
    showTask();
   },2000);
  }
});

clearall.addEventListener('click',()=>{
  taskStorage=[];
  showTask();
});

