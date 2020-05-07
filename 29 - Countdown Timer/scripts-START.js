let countdown;
const timerDisplay = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')
const endMessage = document.querySelector('.display__end-message');
const buttons = document.querySelectorAll('[data-time]');
const audio = document.querySelector('audio');
const audioBtn = document.querySelector('.alarmBtn');
const resumeBtn = document.querySelector('.resumeTimer');
const pauseBtn = document.querySelector('.pauseTimer');
// Add pre-set timers
const addItems = document.querySelector('.form-group');
const itemsList = document.querySelector('.timer__controls');
const items = JSON.parse(localStorage.getItem('items')) || []; 

function timer(seconds) { // ADD FUNCTIONALITIES TO TIMER
    // clear any existing timers
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);

    // Add class for intro text
    timerDisplay.classList.add('.intro');

    // Remove timer expiration animation class @ the start
    timerDisplay.classList.remove('timeIsUp');
    endTime.classList.remove('timeIsUp');

    // Remove pause button when alarm is not playing
    audioBtn.classList.remove('activeAlarmBtn');

    // Don't display timer pause button
    pauseBtn.classList.remove('activePauseBtn');

    // Don't display resume button 
    resumeBtn.classList.remove('activeResumeBtn');

    // prevent audio from playing when new timer is started and not yet expired 
    audio.currentTime = 0;
    audio.pause();

    countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);

      function pauseAlarm() {
       audio.currentTime = 0;
       audio.pause();
      }

      // Add message after timer has expired  
      function displayEndMessage() {  
        audio.currentTime = 0;
        audio.play();
        timerDisplay.innerHTML = 'TIME IS UP';
        endTime.innerHTML = 'Get back now ...'

        // Add class to animate text
        timerDisplay.classList.add('timeIsUp');
        endTime.classList.add('timeIsUp');

        // Add audio pause button
        audioBtn.classList.add('activeAlarmBtn');
        audioBtn.addEventListener('click', pauseAlarm);

        // Add pause button
        pauseBtn.classList.add('activePauseBtn');

        // Add resume button
        resumeBtn.classList.add('activeResumeBtn');
      }


      // check if timer is expired
      if(secondsLeft < 0) {
          clearInterval(countdown);
          displayEndMessage();
          return;
      }

      //display it
      displayTimeLeft(secondsLeft);
    }, 1000);
    
}


function addItem(e) {
  e.preventDefault();
  const number = (this.querySelector(['[name=item]'])).value;
  const item = {
    number,
    done: false
  }
  items.push(item);
  populateList(items, itemsList);
  localStorage.setItem('items', JSON.stringify(items));
  this.reset();
}

// function populateList(plates = [], platesList) {
//   platesList.innerHTML = plates.map((plate, i) => {
//     return `
//     <li>
//       <input type="checkbox" data-index=${i} id="item${i}" ${plate.done ? 'checked' : ''} />
//       <label for="item${i}">${plate.text}</label>
//     </li>
//   `;
//   }).join('');
// }

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    document.title = display;
    timerDisplay.textContent = display;
    // Remove class for intro text
    timerDisplay.classList.remove('intro');
    if (isNaN(seconds)) {
          alert('Please enter a valid number of minutes.');
          location.reload();
        }
  }

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();
    endTime.textContent = `Be Back At ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mins = this.minutes.value;
    timer(mins * 60);
    this.reset(); 
});

addItems.addEventListener('click', addItem);
// populateList(items, itemsList);