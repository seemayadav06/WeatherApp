
/*console.log("hello");
async function showweather(){
   // let latitude=15.3333;
   // let longitude=74.0833;
    let city="goa";

    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data=await response.json();
    console.log("weather data ",data);

    let newpara=document.createElement('p');
    //newpara.textContent=data.main
}*/

const usertab=document.querySelector("[data-userweather]");
const searchtab=document.querySelector("[data-searchweather]");
const usercontainer=document.querySelector(".weather-container");

const grantaccesscontainer=document.querySelector(".grant-location-container");

const searchform=document.querySelector("[data-searchform]");
const loadingscreen=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-container");

let oldtab=usertab;
const API_KEY="d0427351685bccb69fe7397d846a8bac";
oldtab.classList.add("current-tab");

getfromSessionStorage();

function switchtab(newTab){
    if(newTab!=oldtab){
        oldtab.classList.remove("current-tab");
        oldtab=newTab;
        oldtab.classList.add("current-tab");

        if(!searchform.classList.contains("active" )){
            userinfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            
             getfromSessionStorage();
        }
        
    }
}

usertab.addEventListener("click",()=>{
    switchtab(usertab);
});

searchtab.addEventListener("click",()=>{
    switchtab(searchtab);
})

//check if coordinate are already presnt in session storage
function getfromSessionStorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantaccesscontainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);//convert json string into json object
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon} =coordinates;

    //make grant container invisisble
    grantaccesscontainer.classList.remove("active");

    loadingscreen.classList.add("active");

    //api call
    try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

            const data=await response.json();

            loadingscreen.classList.remove("active");
            userinfocontainer.classList.add("active");

            renderweatherinfo(data);
    }
    catch(err){
        loadingscreen.classList.remove("active");
    }
}

function renderweatherinfo(weatherInfo){
     const cityname=document.querySelector("[data-cityname]");
     const countryicon=document.querySelector("[data-country-icon]");
     const desc=document.querySelector("[data-weatherdesc]");
     const weathericon =document.querySelector("[data-weathericon]");
     const temp=document.querySelector("[data-temp]");
     const windspeed=document.querySelector("[data-windspeed]");
     const humidity=document.querySelector("[data-humidity]");
     const cloudiness=document.querySelector("[data-cloud]");

    //fetch value from weatherinfo  object and put in ui  
    cityname.innerText=weatherInfo?.name ;
    countryicon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; 
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weathericon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;



}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}

function showPosition(position){

    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}

const grantaccessbutton=document.querySelector("[data-grantaccess]");
grantaccessbutton.addEventListener("click",getLocation);

let searchinput=document.querySelector("[data-searchinput");

searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchinput.value=="")return;

    fetchsearchweatherinfo(searchinput.value);

});

async function fetchsearchweatherinfo(city){
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");

        renderweatherinfo(data);

    }
    catch(err){

    }


}

