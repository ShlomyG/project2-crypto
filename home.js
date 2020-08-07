import {getApiData} from './xhr.js';
let arrayToggle =[]
let tempToggle = null

export function firstLoad(){
  console.log("check = ", arrayToggle)
    let Obj = JSON.parse(this.response)
            let coinContainer = document.querySelector('#homepage')
            coinContainer.innerHTML = "";
            createCoinBox(Obj, coinContainer)
}

function createCoinBox(obj, coinDivContainer) {
    for (let i = 0; i < obj.length; i++) {
        let newDiv = document.createElement("div")
        newDiv.classList='DivCoin scale-in-ver-top'
        let symbol = obj[i].symbol
        let name = obj[i].name
        newDiv.innerHTML = `
        <span class="infoSpan">${symbol.toUpperCase()}</span><label class="switch">
        <input id="${symbol}" type="checkbox"><span class="slider round"></span></label>
        <span class="infoSpan middle">${name.slice(0,15)}</span>
        <button id="${obj[i].id}" class="btn-secondary moreInfo">More Info</button>
        <div id="info${obj[i].id}" ></div>`
        coinDivContainer.appendChild(newDiv)
        let buttonInfo = document.querySelector(`button[id="${obj[i].id}"]`);
     buttonInfo.onclick= getMoreInfo
        let toggle = document.querySelector(`input[id="${symbol}"]`);
     toggle.onclick= toggleFunc
     } 
    }

    function getMoreInfo(e){
        let coinId = e.target.id
        let infoDiv = document.getElementById("info"+coinId);    
        infoDiv.style.display = "inline-block";
      if (localStorage.getItem(coinId) === null)
       {
        const xhr = new XMLHttpRequest();
        getApiData(`https://api.coingecko.com/api/v3/coins/${coinId}`, function(){
                let infoAPI = JSON.parse(this.responseText)
                let infoDiv = document.getElementById("info"+coinId);
                MoreInfoDiv(infoAPI, infoDiv)
                localStorage.setItem(infoAPI.id, JSON.stringify(infoAPI));
                setTimeout(function () { localStorage.removeItem(infoAPI.id, infoAPI) }, 120000);
       });}
      else{    let localInfo = JSON.parse(localStorage.getItem(coinId))
                  MoreInfoDiv(localInfo, infoDiv) }
      }
      function MoreInfoDiv (info, infoDiv){
        infoDiv.classList='divInfo scale-in-ver-bottom'
          infoDiv.innerHTML = ` <img class="coinImg" src="${info.image.small}">
          <span class="infoText"><strong>Prices:</strong></span><br>
          <span class="infoText">${info.market_data.current_price.usd}$</span>
          <span class="infoText">${info.market_data.current_price.eur}€</span>
          <span class="infoText">${info.market_data.current_price.ils}₪</span>
          <button class="btn-secondary closeInfo" id="close${info.id}">Close Info</button>
         `
         document.querySelector(`button[id="${info.id}"]`).style.display='none';
        document.getElementById("close"+info.id).addEventListener('click', function(
        ){infoDiv.textContent=''
        infoDiv.style.display = "none";
        document.querySelector(`button[id="${info.id}"]`).style.display='block';
      })
      }
      
      function toggleFunc(e) {
        tempToggle=e.target.id

        if(arrayToggle.includes(e.target.id)){
          arrayToggle = arrayToggle.filter(toggle => toggle !==  e.target.id)
            }
        else if (arrayToggle.length < 5 && !arrayToggle.includes(e.target.id))
        {
          arrayToggle.push(e.target.id)
        }
        else if (arrayToggle.length >= 5)
        { 
          document.querySelector(`input[id="${e.target.id}"]`).checked = false;

        let coinsPanel = document.getElementById("coinsPanel")
        coinsPanel.innerHTML=
        `
        <input type="checkbox" class="myCheck" id="${arrayToggle[0]}" checked><label> ${ arrayToggle[0]} </label><br>
        <input type="checkbox" class="myCheck" id="${arrayToggle[1]}" checked><label> ${ arrayToggle[1]} </label><br>
        <input type="checkbox" class="myCheck" id="${arrayToggle[2]}" checked><label> ${ arrayToggle[2]} </label><br>
        <input type="checkbox" class="myCheck" id="${arrayToggle[3]}" checked><label> ${ arrayToggle[3]} </label><br>
        <input type="checkbox" class="myCheck" id="${arrayToggle[4]}" checked><label> ${ arrayToggle[4]} </label><br>
        
        `
          document.getElementById("myDialog").showModal()
          document.getElementById("saveCoins").addEventListener('click',saveChanges);
          document.getElementById("closeCoins").addEventListener('click',closeModal);
        }
           
      function saveChanges() {
        let listCoinsChoose = document.querySelectorAll(".myCheck");
          let arrayTemp = []         
          for (let i = 0; i < listCoinsChoose.length; i++) {
              if (listCoinsChoose[i].checked) {
                  arrayTemp.push(listCoinsChoose[i].id)
                }
                if(arrayTemp.length==5){
                  document.querySelector('#messegeModal').innerHTML="<h6 class='alert alert-dark' role='alert' style='text-align: center;'>Please choose coin to change or click the close button</h6>";
                  setTimeout(function(){ document.querySelector('#messegeModal').innerHTML=""}, 2200);
                 return}
              }
  for (let i = arrayToggle.length - 1; i >= 0; i--) {
    if (!arrayTemp.includes(arrayToggle[i])) {
      document.querySelector(`input[id="${arrayToggle[i]}"]`).checked = false;
      arrayToggle.splice(i, 1)
    }
  }
  if(tempToggle){
    let temp=document.querySelector(`input[id="${tempToggle}"]`);
    temp.checked = true;
  arrayToggle.push(tempToggle)}
          document.getElementById("myDialog").close();
      }
      function closeModal() {

          document.getElementById("myDialog").close()
      }
    }
    export function arrayToCreateGraph(){
      if (arrayToggle.length === 0) {
        document.querySelector('#messegeArea').innerHTML="<h5 class='alert alert-dark' role='alert' style='text-align: center;'>Please choose a Coins For Live Report Option</h5>";
        setTimeout(function(){ document.querySelector('#messegeArea').innerHTML=""}, 2200);
        displayHome();
        document.querySelector("button[id='buttonHome']").focus()
    }

    if (arrayToggle.length >= 1) {
displayLiveReport()
        let url = arrayToggle.join()
        createCanvasElement(arrayToggle)
        getApiData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${url}&tsyms=USD`, makeGraph)
        interval = setInterval(function () { getApiData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${url}&tsyms=USD`, makeGraph) }, 2000)
    }
}

export function makeGraph() {
  let objToPush;
  let keys = Object.keys(JSON.parse(this.responseText))

  if (chart.data) {
      for (var i = 0; i < keys.length; i++) {
          let key = keys[i]
          let coin = JSON.parse(this.response)[key].USD
          objToPush = { x: new Date(), y: coin }
          if (chart.data[i].dataPoints.length > 15) {
              chart.data[i].dataPoints.splice(0, 1)
          }
          chart.data[i].dataPoints.push(objToPush)
      }
  }
  chart.render();
}

let chart;

 function createCanvasElement(arr) {
    chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Coins Value in USD"
        },
        axisX: {
            valueFormatString: "hh:mm:ss"
        },
        axisY: {
            title: "Worth in $",
            includeZero: false,
            suffix: " $"
        },
        legend: {
            cursor: "pointer",
            fontSize: 16,
            itemclick: toggleDataSeries
        },
        toolTip: {
            shared: true
        },
        data: [{
            name: arr[0],
            type: "spline",
            yValueFormatString: "#0.## $",
            showInLegend: true,
            dataPoints: []

        },

        {
            name: arr[1],
            type: "spline",
            yValueFormatString: "#0.## $",
            showInLegend: true,
            dataPoints: []
        },

        {
            name: arr[2],
            type: "spline",
            yValueFormatString: "#0.## $",
            showInLegend: true,
            dataPoints: []
        }, {
            name: arr[3],
            type: "spline",
            yValueFormatString: "#0.## $",
            showInLegend: true,
            dataPoints: []
        }, {
            name: arr[4],
            type: "spline",
            yValueFormatString: "#0.## $",
            showInLegend: true,
            dataPoints: []
        }]

    });
    function toggleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
      }
      else {
          e.dataSeries.visible = true;
      }
      chart.render();
  }
}

export function clearGraph()  {
  clearInterval(interval)
}

let interval;

export function coinSearch(e) {
  let CoinId;
  let input = document.querySelector('#coinInput').value.toLowerCase()
  document.querySelectorAll('input').forEach(function (coin) {
      if (input === coin.id) {
          CoinId = coin.id
          hideAllDiv(CoinId)
      }
      if(input === '') {
          showAllDiv()
      }
  })

}

function hideAllDiv(id) {
  console.log(id)
  let allDivs = document.querySelectorAll('.DivCoin')
  for (var i = 0; i < allDivs.length; i++) {
      if (allDivs[i].firstElementChild.innerHTML === id.toUpperCase()) {
          allDivs[i].style.display = "block"
      }
      else {
          allDivs[i].style.display = "none"
      }
  }
}

export function showAllDiv() {
  let allDivs = document.querySelectorAll('.DivCoin')
  for (var i = 0; i < allDivs.length; i++) {
      allDivs[i].style.display = "block"
  }
}

export function displayHome(){
  document.querySelector('#chartContainer').style.display ='none'
  document.querySelector('#homepage').style.display = 'flex'
  document.querySelector('#about').style.display = 'none'
  document.querySelector('#searchbar').style.display = 'none'
}

export function displayLiveReport(){
  document.querySelector('#chartContainer').style.display ='block'
  document.querySelector('#homepage').style.display = 'none'
  document.querySelector('#about').style.display = 'none'
  document.querySelector('#searchbar').style.display = 'none'
}
      
export function displayAbout(){
  document.querySelector('#chartContainer').style.display ='none'
  document.querySelector('#homepage').style.display = 'none'
  document.querySelector('#about').style.display = 'grid'
   document.querySelector('#searchbar').style.display = 'none'  
}
      


