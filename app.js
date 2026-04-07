let basePrice = 0;
let totalAmount = 0;
let currentEventName = "";
const modal = document.getElementById("bookingModal");

// Reveal Animation Logic (Pop-up cards on scroll)
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100; 
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal); // Page load holei check korbe

function toggleDetails(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === "block") ? "none" : "block";
}

function openModal(eventName, price) {
    currentEventName = eventName;
    basePrice = price;
    document.getElementById("eventTitle").innerText = `Booking for: ${eventName}`;
    modal.style.display = "block"; 
    document.getElementById("booking-step").style.display = "block";
    document.getElementById("payment-step").style.display = "none";
    document.getElementById("success-step").style.display = "none";
    totalAmount = 0;
    document.getElementById("displayTotal").innerText = "₹0";
    generateSeats();
}

function generateSeats() {
    const grid = document.getElementById("seatGrid");
    grid.innerHTML = ""; 
    for (let i = 1; i <= 24; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        if (i <= 12) seat.classList.add("premium");
        if (Math.random() < 0.25) {
            seat.classList.add("occupied");
        } else {
            seat.onclick = function() {
                this.classList.toggle("selected");
                updatePrice();
            };
        }
        grid.appendChild(seat);
    }
}

function updatePrice() {
    const selected = document.querySelectorAll(".seat.selected");
    totalAmount = 0;
    selected.forEach(s => {
        totalAmount += s.classList.contains("premium") ? (basePrice + 200) : basePrice;
    });
    document.getElementById("displayTotal").innerText = "₹" + totalAmount;
}

function goToPayment(e) {
    e.preventDefault();
    if (totalAmount === 0) { alert("Please select seats first!"); return; }
    document.getElementById("booking-step").style.display = "none";
    document.getElementById("payment-step").style.display = "block";
}

function confirmBooking() {
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    document.getElementById("payment-step").style.display = "none";
    document.getElementById("success-step").style.display = "block";
    document.getElementById("thankYouMsg").innerHTML = `Hey <b>${name}</b>, your reservation for <b>₹${totalAmount}</b> is confirmed. <br>Digital Ticket & invoice sent to: <b>${email}</b>`;
    
    // Confetti inside modal
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

function closeModal() {
    if (document.getElementById("success-step").style.display === "block") {
        modal.style.display = "none";
        // Big Home Screen Celebration
        setTimeout(() => {
            const duration = 4 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            function randomInRange(min, max) { return Math.random() * (max - min) + min; }
            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }, 200);
    } else {
        modal.style.display = "none";
    }
}

window.onclick = (e) => { if(e.target == modal) closeModal(); }