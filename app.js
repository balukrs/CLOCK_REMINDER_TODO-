var todo=document.getElementById('taskbtn');
var climatbtn=document.getElementById('weatherbtn');
var slide=document.getElementById('display');
var remind=document.getElementById('reminderbtn');
var displayweather=document.getElementById('weatherdisplay');
var auth=document.getElementById('quoteauthor');
var quot=document.getElementById('quoteparah');
var timepiece=document.getElementById('clock');

//ADDING REMINDERS
var reminderinput=document.getElementById('reminput');
var remtext=document.getElementById('inputtext');
var timehrs=document.getElementById('hour');
var timemins=document.getElementById('minutes');
var ampm=document.getElementById('format');
var remcont=document.getElementById('remindercontainer');



var remStorage=JSON.parse(localStorage.getItem('Reminders'))!==null?JSON.parse(localStorage.getItem('Reminders')):[];

// Getting Long/Lat (Weather API)
import {cloudy} from './sky.js';

navigator.geolocation.getCurrentPosition(pos=>{
  var [lat,long]=[pos.coords.latitude,pos.coords.longitude];
  return weather(lat,long)
  
});  
export async function weather(lat,long){
    var weapi=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&&units=metric&appid=45f3abceb83d60a7e1a3b6af4a37d0bc`);
    var data=await weapi.json();
    return cloudy(data);
  }

// Quotes API CALL
async function quotes(){
  var quote=await fetch('https://type.fit/api/quotes');
  var data= await quote.json();
  return data; 
}
async function randmquote(){
var quotesar= await quotes();
var len=quotesar.length;
var index=Math.floor((Math.random() * len) + 1);
auth.innerText=`${quotesar[index].author}`;
quot.innerText=`"${quotesar[index].text}"`;
}
randmquote();

// CLOCK TIME
function timing(){
  var currentTime = new Date();
  var Time=currentTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  timepiece.innerText=`${Time}`;
  alarm(Time);
  setTimeout(timing, 1000);
}
timing();

// REMINDER to DOM

function generateReminder(val){
var newrem=document.createElement('li');
newrem.classList.add('rem');
newrem.innerHTML=`<span class="idno" id="idno">${val.id}</span><span class="remtext">${val.title}</span> <span class="remtime" id="remtime">${val.time}</span><span class="remclose" id="remclose">x</span>`;
remcont.appendChild(newrem);
}

function displayReminder(){
  remcont.innerHTML='';
  updateLocalremStorage();
  remStorage.forEach(generateReminder);
  notify();
}

// REMINDER IMPLEMENTATION
var notval;
function alarm(val){
  remStorage.forEach(item=>{
    if(item.time==val){
      notval=item.id;
      displayReminder(); 
    }
  })

}

function notify(val){
 var myar= document.querySelectorAll('#idno');
 var myarray=Array.from(myar);
 myarray.forEach((item,index)=>{
   if(item.innerText==notval){
    alerter(item.parentElement);
   }
 });
 
}

function alerter(val){
  val.classList.add('alarm_notify');
  var music=document.getElementById('song');
  music.play();
  music.loop=true;
  setTimeout(()=>{
  val.classList.remove('alarm_notify');
  music.pause();
  }, 1000);
}


displayReminder();


function updateLocalremStorage(){
  localStorage.setItem('Reminders',JSON.stringify(remStorage));
}


// WEATHER/REMINDER BUTTONS
todo.addEventListener('click',()=>{
  document.body.classList.toggle('show_aside');
});

climatbtn.addEventListener('click',()=>{
  if(slide.classList.contains('show_input')){
    slide.classList.remove('show_input');
  }
  slide.classList.toggle('show_display');
  displayweather.style.display='flex';
  reminderinput.style.display='none';
});

remind.addEventListener('click',()=>{
  if(slide.classList.contains('show_display')){
    slide.classList.remove('show_display');
  }
  slide.classList.toggle('show_input');
  displayweather.style.display='none';
  reminderinput.style.display='flex';
});

// ADDING REMINDERS
reminderinput.addEventListener('submit',(e)=>{
 e.preventDefault();
 if(remtext.value==''||timehrs.value==''||timemins.value==''||ampm.value==''){
   alert('Please fill all required fields');
   return;
 }
 if(remStorage.length>6){
   alert('Cannot add any more reminders...sorry..');
   return;
 }
 let newid=Math.floor(Math.random() * 100) + 1;
 remStorage.push({id:newid,title:remtext.value,time:`${hourformat(timehrs.value)}:${minformat(timemins.value)} ${ampm.value}`});
 slide.classList.remove('show_input');
 displayReminder();
});

// REMOVING REMINDERS
remcont.addEventListener('click',(e)=>{
  if(e.target.className=='remclose'){
    let no=+e.target.parentElement.firstChild.innerText;
    remStorage=remStorage.filter(item=>{
      return item.id!==no;
    });
    displayReminder();
  }
  
});


// FORMATS TIME
function minformat(val){
  if(+val<10 && val.length==1){
  return `0${val}`;
  } 
  else return val;
}

function hourformat(val){
    if(val.charAt(0)==0){
    return `${val.charAt(1)}`;
  } 
  else return val;
}