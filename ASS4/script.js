let tickets = [];

let buttons = document.querySelectorAll(".book-btn");

let ticketList = document.getElementById("ticketList");

let ticketCount = document.getElementById("ticketCount");

let total = document.getElementById("total");


buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        let movie = button.parentElement;

        let name = movie.querySelector("h2").textContent;

        let price = Number(
            movie.querySelector("p").textContent.replace("Ticket: ₹", "")
        );


        let existingTicket = tickets.find(function(ticket) {
            return ticket.name === name;
        });


        if (existingTicket) {

            existingTicket.quantity++;

        } else {

            tickets.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        displayTickets();

    });

});


function displayTickets() {

    ticketList.innerHTML = "";


    tickets.forEach(function(ticket, index) {

        let div = document.createElement("div");

        div.className = "ticket";

        div.innerHTML =
            "<p>" + ticket.name + "</p>" +
            "<p>₹" + ticket.price +
            " × " + ticket.quantity + "</p>" +

            "<button onclick='removeTicket(" + index + ")'>Remove</button>";


        ticketList.appendChild(div);

    });


    updateTotal();

}


function removeTicket(index) {

    tickets.splice(index, 1);

    displayTickets();

}


function updateTotal() {

    let count = 0;

    let amount = 0;


    tickets.forEach(function(ticket) {

        count = count + ticket.quantity;

        amount = amount + ticket.price * ticket.quantity;

    });


    ticketCount.textContent = count;

    total.textContent = amount;

}


let bookBtn = document.getElementById("bookBtn");


bookBtn.addEventListener("click", function() {

    if (tickets.length === 0) {

        alert("Please select a movie");

    } else {

        alert("Booking confirmed!");

        tickets = [];

        displayTickets();

    }

});