var pages =[];
var links =[];
var numLinks = 0;
var numPages = 0;
var names = [];
var waitingMessage; 
var randomeContactPara;
//create the pageShow type event.
var pageshow = document.createEvent("CustomEvent");
pageshow.initEvent("pageShow", false, true);

//document.addEventListener("deviceready", function () {
function setup(){
    //console.log("device ready now....");
    
    waitingMessage = document.createElement("p");
    randomeContactPara = document.createElement("p");
    //-------initilize arrays to save pages and links--------
    pages = document.querySelectorAll('[data-role="page"]');
    links = document.querySelectorAll('[data-role="pagelink"]');
    icons = document.querySelectorAll('li img');
    numPages = pages.length;
    numLinks = links.length;
    for (var i = 0; i < links.length; i++) {
        //remember to check for the touchend event
        links[i].addEventListener("click", handleNav, false);
    }
    

    for(var p=0; p < numPages; p++){
        pages[p].addEventListener("pageShow", handlePageShow, false);
      }
    

    loadPage(null);
    
    //--------handling history (back) button ----------
    window.onhashchange = browserBackButton;

    //--------get current location -------------
    if (navigator.geolocation) {
        //code goes here to find position
        var params = {
            enableHighAccuracy: true,
            timeout: 360000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(watchPosition, gpsError, params);
    }
    //--------handling 300ms delay issue----------
    if (detectTouchSupport) {
        //we have support for touch events in the browser
        //console.log("browser supports touch events");
        //add the event listeners for the touch events here.
    } else {
        //add the click listeners to the same objects	
    }
};
//});


function handleNav(ev){
    
    var href = "";
    ev.preventDefault();
    //console.log("ev.target.nodename="+ev.target.nodeName);
    if (ev.target.nodeName == "IMG"){
        //console.log("parent="+ev.target.parentNode);
        href = ev.target.parentNode.href;
    }
    else {
        
	   href = ev.target.href;
    }
    
   // console.log("href="+href);
	var parts = href.split("#");
	loadPage( parts[1] );	
    //console.log("now load page: "+parts[1]);
  return false;
}

function handlePageShow(ev){
  ev.target.className = "active";
}


function loadPage(url) {
    console.log("load page url  = " + url);
    if (url == null) {
        pages[0].className = 'active';
        history.replaceState(null, null, "#home");
    } 
    else 
    {
        for (var i = 0; i < numPages; i++) {
            
            if (pages[i].id == url) {
                pages[i].className = "show";
                history.pushState(null, null, "#" + url);
                setTimeout(addDispatch, 50, i);
                //setTimeout(showPage, 10, pages[i]);
            } else {
                pages[i].className = "hidden";
                //setTimeout(hidePage, 400, pages[i]);
            }
            

        }

        //set the activetab class on the nav menu
        //console.log("set active tab now");
        for (var t = 0; t < numLinks; t++) {
            links[t].className = "";
            if (links[t].href == location.href) {
                links[t].className = "activetab";
            }
        }
    }
    
                if (url=="contact"){
                //console.log("contact page loaded");
                findRandomContact();
            }
}

function addDispatch(num){
  pages[num].dispatchEvent(pageshow);
  //num is the value i from the setTimeout call
  //using the value here is creating a closure
}

function browserBackButton(ev) {
    url = location.hash; //hash will include the "#"
    //update the visible div and the active tab
    numPages = pages.length;
    for (var i = 0; i < numPages; i++) {
        if (("#" + pages[i].id) == url) {
            pages[i].style.display = "block";
        } else {
            pages[i].style.display = "none";
        }
    }
    for (var t = 0; t < links.length; t++) {
        //links[t].className = "";
        if (links[t].href == location.href) {
            //links[t].className = "activetab";
        }
    }
}

//Test for browser support of touch events
function detectTouchSupport() {
    msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
    var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
    return touchSupport;
}

function touchHandler(ev) {
    //this function will run when the touch events happen
    if (ev.type == "touchend") {
        ev.preventDefault();
        var touch = evt.changedTouches[0]; //this is the first object touched
        var newEvt = document.createEvent("MouseEvent");
        newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
        //var newEvt = new MouseEvent("click");				//new method
        //REF: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.MouseEvent
        ev.currentTarget.dispatchEvent(newEvt);
        //change the touchend event into a click event and dispatch it immediately
        //this will skip the built-in 300ms delay before the click is fired by the browser
    }
}


function watchPosition(position) {
    var curLatitude = position.coords.latitude;
    var curLongitude = position.coords.longitude;

    var canvas = document.createElement("canvas");
    canvas.id = "mapCanvas";
    canvas.setAttribute("width", 400);
    canvas.setAttribute("height", 400);
    var mapDiv = document.querySelector("#map")
    mapDiv.querySelector('[data-role="content"]').appendChild(canvas)
    //document.body.appendChild(canvas);
    var context = canvas.getContext("2d");
    var imageObj = new Image();
    //
    imageObj.onload = function () {
        // console.log("now image loaded");
        context.drawImage(imageObj, 0, 0, 400, 400);
        //var dataURL=canvas.toDataURL();
        //document.querySelector("#hiddenposter").innerHTML=dataURL;
    }
    imageObj.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + curLatitude + "," + curLongitude + "&zoom=14&size=400x400&maptype=roadmap&markers=color:blue%7Clabel:A%7C" + curLatitude + "," + curLongitude;
}

function gpsError(error) {
    var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
    };
    alert("Error: " + errors[error.code]);
}

function findRandomContact() {
    // specify contact search criteria
   // console.log("find random now");
    var randomContactDiv = document.querySelector("#randomContact");
    while (randomContactDiv.firstChild) {
        randomContactDiv.removeChild(randomContactDiv.firstChild);
    }

    waitingMessage.innerHTML = "Please wait, now looping contact list...";
    randomContactDiv.appendChild(waitingMessage);
    var options = new ContactFindOptions();
    options.filter="";          // empty search string returns all contacts
    options.multiple=true;      // return multiple results
    filter = ["displayName"];   // return contact.displayName field
    // find contacts
    navigator.contacts.find(filter, onSuccess, onError, options);
}

function onSuccess(contacts) {
    for (var i=0; i<contacts.length; i++) {
        if (contacts[i].displayName) {  // many contacts don't have displayName
            names.push(contacts[i].displayName);
        }
    }
   // console.log("on success now ="+names);
    //alert('contacts loaded');
    randomeContactPara.innerHTML = "Finished. Located "+names.length+" contacts. A random contact is displayed: "+names[Math.floor((Math.random()*names.length))];
    document.querySelector("#randomContact").removeChild(waitingMessage);
    document.querySelector("#randomContact").appendChild(randomeContactPara);
}

function onError(){
    console.log("error happend during locating contact");
}