let countdown;
const timerDisplay = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')
const endMessage = document.querySelector('.display__end-message');
const buttons = document.querySelectorAll('[data-time]');
const audio = document.querySelector('audio');

function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);
    // Remove timer expiration animation class @ the start
    timerDisplay.classList.remove('timeIsUp');
    endTime.classList.remove('timeIsUp');

    countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);

      // Add message after timer has expired  
      function displayEndMessage() {  
        audio.currentTime = 0;
        audio.play();
        timerDisplay.innerHTML = 'TIME IS UP';
        endTime.innerHTML = 'Get back now ...'
        // Add class to animate text
        timerDisplay.classList.add('timeIsUp');
        endTime.classList.add('timeIsUp');
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

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    document.title = display;
    timerDisplay.textContent = display;
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