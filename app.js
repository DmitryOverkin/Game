const $start = document.querySelector('.start');
const $game_wrapper = document.querySelector('.game-wrapper');
const $gameBox = document.querySelector('.game');
const $time = document.querySelector('.number-of-time');
const $time_header = document.querySelector('.game-time');
const $inputTime = document.querySelector('.input');
const $result_header = document.querySelector('.result-header');
const $result = document.querySelector('.result');
const $enterBtn = document.querySelector('#login');
const $login = document.querySelector('.login');
const $appContent = document.querySelector('.app-content');
const $userName = document.querySelector('.userName')
const $list = document.querySelector('.list');


let score = 0;
let user = {};
let list = [];
let check = false;

$start.addEventListener('click', start);

function start() {
   if(Object.keys(user).length != 0){
    check = true;
   }
    if($gameBox.classList.contains('hide')){
        $gameBox.classList.remove('hide');
    }
    $start.classList.add('hide');
    $game_wrapper.style.backgroundColor = 'white';
    createBox();
    changeTime();
    time();
    toggle($result_header, $time_header);
    $inputTime.setAttribute('disabled', 'true');
    score = 0;
   
}

function createBox(){
    $gameBox.innerHTML = '';
    let box = document.createElement('div');
    box.style.width = box.style.height = getRandom(30, 100) + 'px';
    box.style.backgroundColor = `rgb(${getRandom(0, 253)}, ${getRandom(0, 253)}, ${getRandom(0, 253)})`;
    $gameBox.style.left = getRandom(0, 300) + 'px';
    $gameBox.style.top = getRandom(0, 300) + 'px';
    box.style.cursor = 'pointer';

    box.setAttribute('data-box', 'true');


    $gameBox.insertAdjacentElement('afterbegin', box);
    
}

function time(){
    let intervall = setInterval(function(){
        $time.textContent = ($time.textContent - 0.1).toFixed(1);
        if($time.textContent <= 0.0){
            clearInterval(intervall);
            end();
        }
    },100);
}

$inputTime.addEventListener('change', changeTime);

function changeTime(){
    $time.textContent = $inputTime.value;
    toggle($result_header, $time_header);
}

function end(){
    $start.classList.remove('hide');
    $gameBox.classList.add('hide');
    $game_wrapper.style.backgroundColor = '#ccc';
    $inputTime.removeAttribute('disabled');
    $result.textContent = score;
    toggle($time_header, $result_header);
    checkUser();
}

function checkUser(){
  if(check){
    list = getData('listUsers');
    let userL = list.findIndex((elem) => {
        return elem.name == user.name
    }) 
    
    if(list[userL].score < score){
        list.pop();
        sendData(list);
        login();
        showUsers();
    }
  }else{
    login();
    showUsers();
  }
    
}

function compare(a, b) {
    if (a.score > b.score) {
      return -1;
    }
    if (a.score < b.score) {
      return 1;
    }
    
    return 0;
  }



function toggle(first, second){
    first.classList.add('hide');
    second.classList.remove('hide');
}


$gameBox.addEventListener('click', clickedBox);

function clickedBox(event){
    if(event.target.dataset.box){
        score++;
        createBox();
        
    }
}

function getRandom(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

$enterBtn.addEventListener('click', function(){
    toggle($login, $appContent);
    showUsers();
})

function login(){
    user.name = $userName.value;
    user.score = score;
    list.push(user);
    sendData(list);
}

function showUsers(){
    $list.innerHTML = '';
    list = getData('listUsers');
    list.sort(compare);
    if(list.length > 10 ){
        list.splice(10, list.length - 10)
    }
    list.forEach((elem) => {
        $list.insertAdjacentHTML('beforeend', `
            <div class="user">
                ${elem.name}: ${elem.score}
            <div/>
        `)
    })
}


function sendData(data) {
    localStorage.setItem('listUsers', JSON.stringify(data))
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key))
}