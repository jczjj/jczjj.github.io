// Select all sliders with the class 'toggleSlider'
const sliders = document.querySelectorAll(".toggleSlider");
const socket = io();  // Connect to Flask-SocketIO server

sliders.forEach((slider) => {
  slider.addEventListener("change", function () {
    if (this.checked) {
      
      console.log(`Slider ${Array.from(sliders).indexOf(this) + 1} is ON`);
    } else {
      console.log(`Slider ${Array.from(sliders).indexOf(this) + 1} is OFF`);
    }
  });
});

function dispense_onclick(){
  fetch(`/dispense`);
}
document.addEventListener("DOMContentLoaded", function () {
  const fridgeToggle = document.querySelector("#fridgeToggle");
  const fridgeTempDisplay = document.querySelector("#fridgeTemp");
  const manualCloseBtn = document.querySelector("#manualClose");

  // Receive real-time temperature updates from the server
  socket.on("temperature_update", (data) => {
      fridgeTempDisplay.textContent = `${data.temperature}°`;
  });

  // Receive auto mode updates
  socket.on("auto_mode_update", (data) => {
      fridgeToggle.checked = data.auto_mode;
  });

  // Enable manual close button when needed
  socket.on("enable_manual_close", () => {
      console.log("Temperature low! Waiting for user to trigger fridge close.");
      manualCloseBtn.disabled = false;
  });

  // Disable manual close button after fridge closes
  socket.on("close_fridge", () => {
      console.log("Fridge closed.");
      manualCloseBtn.disabled = true;
  });

  // Toggle Auto Mode
  fridgeToggle.addEventListener("change", function () {
      fetch("/toggle_auto", { method: "POST" });
  });

  // Manual Close Button Click
  manualCloseBtn.addEventListener("click", function () {
      fetch("/trigger_motor", { method: "POST" });
  });
});
