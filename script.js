let symbols = ["⚜️","🐉","⚡️","🍾","☄️"];
let reels = document.querySelectorAll('.reel')
let balance = document.getElementById('wallet-number');
let betAmount = document.getElementById('bet-amount');
let slotMachine = document.getElementById('slot-machine');
let winPopup = document.querySelector(".win-popup");
let losePopup = document.querySelector(".lose-popup");

let spinSpeed = 300;

function main(){

  function loadBalance() {
    if (localStorage.getItem('balance') === null) {
      balance.innerHTML = 10000;
    } else {
      balance.innerHTML = localStorage.getItem('balance');
    }
  }

  function updateBalance(amount) {
    balance.innerHTML = Number(balance.innerHTML) + amount;
    localStorage.setItem('balance', balance.innerHTML);
  }

  function winFlash() {

    setTimeout(() => {
        slotMachine.style.background= "rgb(136, 255, 136)";
        setTimeout(() => {
          slotMachine.style.backgroundColor = "#787878";
        }, 250)
    }, 250)

    
    
  }

  function popup(payout) {
    if (payout > 0) {
        winPopup.querySelector("span").innerHTML = payout;
        winPopup.style.opacity = 1;
    } else if (payout < 0) {
        losePopup.querySelector("span").innerHTML = Math.abs(payout);
        losePopup.style.opacity = 1;
    }
    setTimeout(() => {
        losePopup.style.opacity = 0;
        winPopup.style.opacity = 0;
    }, 1000)
  }
  
  function shuffle(arr){
    let newArr = [...arr]
    for(let i=0; i < 2; i++){
      let currentIndex = newArr.length;
  
      while (currentIndex != 0){
        let randomIndex = Math.floor(Math.random() * newArr.length);
        currentIndex--;
    
        [newArr[currentIndex], newArr[randomIndex]] = [newArr[randomIndex], newArr[currentIndex]];
      }
    }
    return newArr;
  }



  
  function setupReel(reel){
    let reelArray = shuffle(symbols)

    reel.querySelectorAll('.symbol')[0].innerHTML = reelArray[0];
    reel.querySelectorAll('.symbol')[1].innerHTML = reelArray[1];
    reel.querySelectorAll('.symbol')[2].innerHTML = reelArray[2];

    return reelArray;
  }

  
  function checkScore(){
    function multiplier(symbol){
      let scoreMultiplier = 0;
      if (symbol === '⚜️'){
        scoreMultiplier = 3;
      } else if (symbol === '🐉'){
        scoreMultiplier = 2;
      } else if (symbol === '⚡️' || symbol === '☄️' || symbol === '🍾'){
        scoreMultiplier = 1;
      };
      return scoreMultiplier;
    }
    let score = 0;
    let resultsContainer = document.querySelectorAll('.symbol');
    let results = [];
    resultsContainer.forEach(result => {
      results.push(result.innerHTML);
    })

    if(results[0] === results[3] && results[3] === results[6]){
      let scoreMultiplier = multiplier(results[0]);
      score += (scoreMultiplier*2);
    } if(results[1] === results[4] && results[4] === results[7]){
        let scoreMultiplier = multiplier(results[1]);
        score += (scoreMultiplier*3);
    } if(results[2] === results[5] && results[5] === results[8]){
        let scoreMultiplier = multiplier(results[2]);
        score += (scoreMultiplier*2);
    } if(results[0] === results[4] && results[4] === results[8]){
        let scoreMultiplier = multiplier(results[0]);
        score += (scoreMultiplier*1);
    } if(results[2] === results[4] && results[4] === results[6]){
        let scoreMultiplier = multiplier(results[2]);
        score += (scoreMultiplier*1);
    }


    
    return score;
  }
  
  function spinReel(reel, reelArray, speed, duration){
    
    function iterateFruit(reel, reelArray, itemNumber){
      
      let currentPosition = reelArray.indexOf( reel.querySelectorAll('.symbol')[itemNumber].innerHTML)
      let newInterval = setInterval(() => {
        
        currentPosition++;
        currentPosition %= reelArray.length;
        reel.querySelectorAll('.symbol')[itemNumber].innerHTML = reelArray[currentPosition];

      }, speed)

      setTimeout(() => {
         clearInterval(newInterval);
      }, duration)
    }

    
    
    iterateFruit(reel, reel1Array, 0);
    iterateFruit(reel, reel1Array, 1);
    iterateFruit(reel, reel1Array, 2);
    return duration;
  };
  
  function spinSlot(){ 
    if (debounce === false && Number(betAmount.innerHTML) <= Number(balance.innerHTML)){
      debounce = true;
      popup(-betAmount.innerHTML)
      updateBalance(-Number(betAmount.innerHTML))
      
      spinReel(reels[0], reel1Array, 70, (2000+Math.random()*345)/(spinSpeed/100));
      spinReel(reels[1], reel2Array, 60, (3000+Math.random()*456)/(spinSpeed/100));
      let spinDuration = spinReel(reels[2], reel3Array, 40, (4000+Math.random()*567)/(spinSpeed/100));
      setTimeout(() => {

        let score = checkScore();
        if (score > 0){
          let payout = 100 * score
          updateBalance(payout);
          popup(payout);
          winFlash();
          setTimeout(() => {
            debounce = false;
          }, 1000);
        } else {

                if (Number(balance.innerHTML) === 0){
                console.log(balance)
                setTimeout(() =>{
                    popup(1000)
                    balance.innerHTML = 1000
                    localStorage.setItem('balance', balance.innerHTML);
                },1000);

            }
            debounce = false;
        }
      }, spinDuration)
    }
  };
  let reel1Array = setupReel(reels[0])
  let reel2Array = setupReel(reels[1])
  let reel3Array = setupReel(reels[2])
  let debounce = false;
  loadBalance();

  


  document.querySelector('#spin-button').addEventListener('click', spinSlot)
  document.querySelector('.change-bet-button.add').addEventListener('click', () => {
    if (Number(betAmount.innerHTML) < 1000000000){
      betAmount.innerHTML = Number(betAmount.innerHTML) + 100;
    }
  })
  
  document.querySelector('.change-bet-button.subtract').addEventListener('click', () => {
    if (Number(betAmount.innerHTML) > 100){
      betAmount.innerHTML = Number(betAmount.innerHTML) - 100;
    }
  })

}

main()


