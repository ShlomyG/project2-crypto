import {getApiData} from './xhr.js';
import {firstLoad,arrayToCreateGraph, clearGraph,coinSearch, displayHome, displayAbout} from './home.js';

window.addEventListener('load',getAllCoins)

document.getElementById('taskbar').addEventListener('click', function (e) {
    if (e.target.textContent === 'Live Report') {
            arrayToCreateGraph()
        }
          
    if (e.target.textContent === 'Home') {
        displayHome()
        clearGraph()

}
    if (e.target.textContent === 'Search'){
        coinSearch(e)
    }
    if (e.target.textContent === 'About'){
        displayAbout()
        clearGraph()

    }
}
)

function getAllCoins() {
    getApiData(`https://api.coingecko.com/api/v3/coins/`, firstLoad);
}



        
        
    
                