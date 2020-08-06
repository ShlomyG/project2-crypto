import {getApiData} from './xhr.js';
import {firstLoad,arrayToCreateGraph, clearGraph,coinSearch} from './home.js';

window.addEventListener('load',getAllCoins)

document.getElementById('taskbar').addEventListener('click', function (e) {
    if (e.target.textContent === 'Live Report') {
            arrayToCreateGraph()
        }
          
    if (e.target.textContent === 'Home') {
        document.querySelector('#homepage').style.display = 'flex'
        document.querySelector('#chartContainer').style.display ='none'
        document.querySelector('#about').style.display = 'none'
        document.querySelector('#searchbar').style.display = 'inline'
    clearGraph()

}
    if (e.target.textContent === 'Search'){
        coinSearch(e)
    }
    if (e.target.textContent === 'About'){
        document.querySelector('#chartContainer').style.display ='none'
        document.querySelector('#homepage').style.display = 'none'
        document.querySelector('#about').style.display = 'block'
              document.querySelector('#searchbar').style.display = 'none'  
              clearGraph()

    }
}
)

function getAllCoins() {
    getApiData(`https://api.coingecko.com/api/v3/coins/`, firstLoad);
}



        
        
    
                