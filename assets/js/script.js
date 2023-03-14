/************************************** 
References
**************************************/

/************************************** 
global variables
**************************************/
var weatherURLKey="cd9964c300819532fb2997b8363c0542";

/************************************** 
buttons
**************************************/
var searchBtnEl = document.querySelector("#searchCity");

/************************************** 
classes
**************************************/
class WeatherAPI{
    /* --------------------------------
    class constructor
    -------------------------------- */
    constructor(key)
    {
        this.key=key;
    };

    /* --------------------------------
    return url for geo code  
    by zip code
    -------------------------------- */
    geoCodeURLbyZip(zipcode)
    {
        return("https://api.openweathermap.org/data/2.5/forecast?zip="+zipcode+"&units=imperial&appid="+this.key);
    };

    /* --------------------------------
    return url for geo code 
    by city, state, country
    -------------------------------- */
    //geoCodeURL(city,state,country,limit=1)
    geoCodeURL(city,limit=1)
    {
      //  return("https://api.openweathermap.org/geo/1.0/direct?q="+city+","+state+","+country+"&limit="+limit+"&units=imperial&appid="+this.key);
      return("https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit="+limit+"&units=imperial&appid="+this.key);
    };

    /* --------------------------------
    return url for current weather 
    by latitute and longitute
    -------------------------------- */
    weatherURL(lat,lon)
    {
        return("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid="+this.key);
    };

    /* --------------------------------
    return url for 5 day forecast
    by latitute and longitute
    -------------------------------- */
    weatherForcastURL(lat,lon)
    {
        return("https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&cnt=40&units=imperial&appid="+this.key);
    };   
};

/* --------------------------------
declare new weather class object 
and pass in key
-------------------------------- */
let w = new WeatherAPI(weatherURLKey);
var wLat=0;
var wLon=0;

/************************************** 
functions
**************************************/
function convertDT(timestamp)
{
    let date = new Date(timestamp*1000);
    return(date);
};

function getWeatherIcon(id){
    var url="https://openweathermap.org/img/wn/"+id+".png";
    var img="<img src="+url+" ></img>";
    return(img);
}



function ShowCurrentWeather(data)
{
console.log(data);
document.getElementById("city").innerHTML= `<h2>${data.name} (${convertDT(data.dt).toLocaleDateString()}) ${getWeatherIcon(data.weather[0].icon)}</h2>`;
document.getElementById("temp").innerHTML="Temp: "+data.main.temp+" &#8457;";
document.getElementById("wind").textContent="Wind: "+data.wind.speed+" MPH";
document.getElementById("humidity").textContent="Humidity: "+data.main.humidity+"%";
};


function fillWeatherCards(data)
{
var cardCount=1;
for (var i = 0; i < data.cnt; i+=1) {
    if(convertDT(data.list[i].dt).getHours()==11)
    {
        var ul=document.createElement("ul");
        ul.innerHTML = `<li> ${convertDT(data.list[i].dt).toLocaleDateString()}</l1>
        <li>${getWeatherIcon(data.list[i].weather[0].icon)}</li>
        <li>Temp: ${data.list[i].main.temp} &#8457 </li>
        <li>Wind: ${data.list[i].wind.speed} MPH </li>
        <li> Humidity: ${data.list[i].main.humidity}%</li>
        `;
        document.getElementById("forcastCard-"+cardCount).innerHTML="";
        document.getElementById("forcastCard-"+cardCount).append(ul);
        cardCount++;
    };
  }
};


function getWeather()
{
    //fetch(w.weatherURL(40.735657,-74.1723667))
    fetch(w.weatherURL(wLat,wLon))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ShowCurrentWeather(data);
    });
};

function getForcast()
{
    //fetch(w.weatherForcastURL(40.735657,-74.1723667))
    fetch(w.weatherForcastURL(wLat,wLon))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fillWeatherCards(data);
        });
};

function getGeocode(city,state)
{
    fetch(w.geoCodeURL(city,state))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data)
            wLat=data[0].lat;
            wLon=data[0].lon;
            //console.log(w.lat+" : "+ w.lon);
            getWeather();
            getForcast();
        });
}

function searchCity(event)
{
    event.preventDefault()
    console.log(event.target.children);
    var searchTxt=document.getElementById("cityInput").value;
    //const searchValue= searchTxt.split(",");
    if(searchTxt.length)
    {
        //w.city=searchValue[0].trim();
        //w.state=searchValue[1].trim();
        getGeocode(searchTxt);
    };


}
/************************************** 
Add event listener to generate button
**************************************/
var form = document.querySelector('form')
form.addEventListener("submit", searchCity);


