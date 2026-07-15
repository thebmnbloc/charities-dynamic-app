function triggerCountdown(countdownElem, days, hours, minutes, seconds) {
    // Function to set the countdown duration using Date objects
    function setCountdown() {
        const now = new Date().getTime(); // Current time in milliseconds

        // Calculate the countdown duration in milliseconds
        const countdownDuration = (days * 24 * 60 * 60 * 1000)   // Days in milliseconds
            + (hours * 60 * 60 * 1000)        // Hours in milliseconds
            + (minutes * 60 * 1000)           // Minutes in milliseconds
            + (seconds * 1000);               // Seconds in milliseconds

        // Return the new countdown target time
        return now + countdownDuration;
    }

    // Initialize the countdown target date
    let countdownDate = setCountdown();

    // Update the countdown every 1 second
    const countdownInterval = setInterval(function () {
        const now = new Date().getTime();

        // Find the distance between now and the countdown date
        const distance = countdownDate - now;

        // Time calculations for days, hours, minutes, and seconds
        const displayDays = Math.floor(distance / (1000 * 60 * 60 * 24));
        const displayHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const displayMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const displaySeconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="countdown"
        // document.getElementById("countdown").innerHTML = `${displayDays}d ${displayHours}h ${displayMinutes}m ${displaySeconds}s`;

        const countdownElement = document.querySelector(countdownElem);

        countdownElement.querySelector(".days").innerHTML = displayDays;
        countdownElement.querySelector(".hours").innerHTML = displayHours;
        countdownElement.querySelector(".minutes").innerHTML = displayMinutes;
        countdownElement.querySelector(".seconds").innerHTML = displaySeconds;

        // If the countdown reaches zero, reset it
        if (distance < 0) {
            countdownDate = setCountdown(); // Reset the countdown date
        }
    }, 1000);
}

triggerCountdown(".ul-countdown", 20, 19, 16, 38);
