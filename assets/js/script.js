/************************************** 
References
**************************************/
/************************************** 
classes
**************************************/

/************************************** 
The WeatherAPI class is used for getting
the openweathermap.org urls. The constructor
accepts the weather key. The weather key
is applied to the URLs
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
    weatherForecastURL(lat,lon)
    {
        return("https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&cnt=40&units=imperial&appid="+this.key);
    };   
};


/************************************** 
global variables
**************************************/

/* --------------------------------
declare new weather class object 
and pass in key
-------------------------------- */
var weatherURLKey="cd9964c300819532fb2997b8363c0542";
let w = new WeatherAPI(weatherURLKey);

var searchCityButtons=[];

/************************************** 
buttons
**************************************/
var searchBtnEl = document.querySelector("#searchCity");
var form = document.querySelector('form');


/************************************** 
functions
**************************************/

/************************************** 
function 
convert UTC timestamp to date-time
**************************************/
function convertDT(timestamp)
{
    let date = new Date(timestamp*1000);
    return(date);
};

/************************************** 
function
build url for weather icon
**************************************/
function getWeatherIcon(id){
    var url="https://openweathermap.org/img/wn/"+id+".png";
    var img="<img src="+url+" ></img>";
    return(img);
}


/************************************** 
function
Show the results of the current weather search
**************************************/
function ShowCurrentWeather(data)
{
document.getElementById("city").innerHTML= `<h2>${data.name} (${convertDT(data.dt).toLocaleDateString()}) ${getWeatherIcon(data.weather[0].icon)}</h2>`;
document.getElementById("temp").innerHTML="Temp: "+data.main.temp+" &#8457;";
document.getElementById("wind").textContent="Wind: "+data.wind.speed+" MPH";
document.getElementById("humidity").textContent="Humidity: "+data.main.humidity+"%";
};

/************************************** 
function
build forecast cards with the search results
**************************************/
function fillWeatherCards(data)
{
    document.getElementById("5DayForecast").innerHTML="";
    for (var i = 0; i < data.cnt; i+=1) 
    {
        // the search results return multiple hours for each day
        // choose 11am as the average time to display data for
        if(convertDT(data.list[i].dt).getHours()==11)
        {
            var card=document.createElement("div");
            card.className="col card";
            var ul=document.createElement("ul");
            ul.innerHTML = `<li> ${convertDT(data.list[i].dt).toLocaleDateString()}</l1>
            <li>${getWeatherIcon(data.list[i].weather[0].icon)}</li>
            <li>Temp: ${data.list[i].main.temp} &#8457 </li>
            <li>Wind: ${data.list[i].wind.speed} MPH </li>
            <li> Humidity: ${data.list[i].main.humidity}%</li>
            `;
            card.append(ul);
            document.getElementById("5DayForecast").append(card);
        };
  }
};

/************************************** 
function
create city button
**************************************/
function createCityButton(cityName)
{
    if( !searchCityButtons.includes(cityName))
    {
        searchCityButtons.push(cityName);
        saveCityButtons();
        var cityButton=document.createElement("button");
        cityButton.textContent=cityName;
        cityButton.value=cityName;
        cityButton.className="citybutton";
        cityButton.addEventListener("click",cityButtonClick);
        var cityLi=document.createElement("li");
        cityLi.appendChild(cityButton);
        document.getElementById("cities").append(cityLi);
    };
}
function saveCityButtons()
{
    localStorage.setItem("savedcities",JSON.stringify(searchCityButtons));
};

function loadCityButtons()
{
    var s=JSON.parse(localStorage.getItem("savedcities"));
    if(s)
    {
        for(var i=0;i<s.length;i++)
        {
            createCityButton(s[i]);
        };
    };
}
/************************************** 
function - eventhandler for city button click
**************************************/
function cityButtonClick(event)
{
    startGetWeather(event.target.value);
}

/************************************** 
function
perform weather request and call function to show
**************************************/
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

/************************************** 
function
perform forecast request and call function to show
**************************************/
function getForecast()
{
    fetch(w.weatherForecastURL(wLat,wLon))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fillWeatherCards(data);
        });
};

/************************************** 
function
look up the geo code by city and state
**************************************/
function startGetWeather(city,state)
{
    fetch(w.geoCodeURL(city,state))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            wLat=data[0].lat;
            wLon=data[0].lon;
            createCityButton(data[0].name);
            getWeather();
            getForecast();
        });
}

/************************************** 
function - eventhandler for submit button
**************************************/
function searchCity(event)
{
    event.preventDefault()
    var searchTxt=document.getElementById("cityInput").value;
    if(searchTxt.length)
    {
        startGetWeather(searchTxt);
    };


}
/************************************** 
Add event listeners
**************************************/

form.addEventListener("submit", searchCity);

$(document).ready(loadCityButtons)


