

var divMove = document.getElementById("move");
var s = document.getElementById("submit");
var randomButton = document.getElementById("random");
var moved = false;
var random = false;

function connectListeners() {
    s.addEventListener("click", moveBoxes);
    randomButton.addEventListener("click", randomSearch);

}

//clear out previous results in preparation for new search results
function clearResults() {
    var cardList = document.querySelectorAll(".wikiCard");

    for (x in cardList) {
        if (cardList[x].parentNode !== undefined) {
            cardList[x].parentNode.removeChild(cardList[x]);
        }
    }
}

function randomSearch() {
    random = true;
    moveBoxes();
}

//starts animation for textfield and search button
function moveBoxes() {
    var textPosVal = document.getElementById("box");

    if (textPosVal.value === "" || textPosVal.value === undefined
        && random == false) {
            alert("Enter a word to search");
    }
    else {
        if (!moved) {

            var pos = 20;
            var time = setInterval(move,35);

            function move() {

                if (pos === 0) {
                    clearInterval(time);
                    getData(textPosVal);
                    moved = true;
                }
                else {
                    pos -= 1;
                    divMove.style.marginBottom = pos + "%";
                }
            }
        }
        else {
            clearResults();
            getData(textPosVal);
        }
   }
}

//gets search results from wikipedia in JSON form
function getData(result) {
    //result.value is info entered by user
    var s = document.createElement("script");
    s.src = "https://en.wikipedia.org/w/api.php?action=" +
    "query&format=json&prop=extracts&";

    if (!random) {
        s.src +=  "meta=&generator=search&exsentences=1&exlimit=10&exintro="
        +"1&explaintext=1&gsrsearch=" + result.value + "&callback=handleResult";
    }
    else {
        s.src += "titles=&generator=random&exsentences=1&exlimit=10&exintro=1" +
        "&explaintext=1&grnnamespace=0&grnlimit=10&callback=handleResult";
    }

    random = false;
    document.body.appendChild(s);
}

function handleResult(returnObj) {

    //no need to use JSON.parse because returnObj
    //is already returned as an object
    //var jObj = JSON.parse(returnObj);

    var x, n;

    //unknown key names in after returnObj.query.pages
    //use Object.keys to get list of unknown keys names
    //as an array

    var k = Object.keys(returnObj.query.pages);
    var divLinks = document.createElement("div");
    divLinks.id = "divLinks";

    for (n in k) {

        //create div element for each result
        var link = document.createElement("a");

        //document.body.appendChild(link);

        var divCard = document.createElement("div");
        divCard.className = "wikiCard";
        divCard.onclick = "";

        //create title element
        var titleElement = document.createElement("h1");
        titleElement.innerHTML = returnObj.query.pages[k[n]].title;
        link.href = "https://en.wikipedia.org/wiki/" + returnObj.query.pages[k[n]].title;

        //create intro element
        var introElement = document.createElement("h2");
        introElement.innerHTML = returnObj.query.pages[k[n]].extract;

        //append title and intro elements to div element
        divLinks.appendChild(link);
        link.appendChild(divCard);
        divCard.appendChild(titleElement);
        divCard.appendChild(introElement);
    }

    document.body.appendChild(divLinks);
}

connectListeners();
