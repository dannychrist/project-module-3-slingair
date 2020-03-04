const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');

const givenName = document.getElementById('givenName');
const surname = document.getElementById('surname');
const email = document.getElementById('email');
console.log('email', email);


let selection = '';

const renderSeats = (seatInfo) => {
    document.querySelector('.form-container').style.display = 'block';

    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s-1]}`;
            const seat = document.createElement('li');

            // Two types of seats to render
            const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
            const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`        
            let seatObject = {};
            // console.log(seatInfo.flightInfo);
            console.log(seatInfo.flightInfo);
            seatInfo.flightInfo.forEach((seat)=> {
            if (seat.id === seatNumber) {
                seatObject = seat;
            }
            })
            if (seatObject.isAvailable) {
                seat.innerHTML = seatAvailable;
            }
            else {
                seat.innerHTML = seatOccupied;
            }
            row.appendChild(seat);
        }
    }
    
    let seatMap = document.forms['seats'].elements['seat'];
    seatMap.forEach(seat => {
        seat.onclick = () => {
            selection = seat.value;
            seatMap.forEach(x => {
                if (x.value !== seat.value) {
                    document.getElementById(x.value).classList.remove('selected');
                }
            })
            document.getElementById(seat.value).classList.add('selected');
            document.getElementById('seat-number').innerText = `(${selection})`;
            confirmButton.disabled = false;
        }
    });
}


const toggleFormContent = (event) => {
    const flightNumber = flightInput.value.toUpperCase();
    console.log('toggleFormContent: ', flightNumber);
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?
    console.log(flightNumber);
    if (flightNumber.length > 5 || flightNumber[0] !== 'S' || flightNumber[1] !== 'A') {
        window.alert('error');
    }
    
    fetch(`/slingair/${flightNumber}`)
        .then(data => {
            // console.log(data);
            return data.json();
        })
        .then(data => {
            // console.log(data);
            renderSeats(data);
        })
        
    
    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
    
}

const handleConfirmSeat = (event) => {
    event.preventDefault();
    confirmButton.click(false);
    console.log(email.value);
    console.log(email);

    const data = {
        flight: flightInput.value,
        seat: selection,
        givenName: givenName.value,
        surname: surname.value,
        email: email.value
    }
    
    fetch('/slingair/user', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        console.log(res);
        
        return res.json()})
    .then(data => {
        console.log(data);
        window.location.href = `/seat-select/confirmed.html?flight=${flightInput.value}&seat=${selection}&givenName=${givenName.value}&surname=${surname.value}&email=${email.value}`
    })
    
    .catch(error => console.log(error))
}



flightInput.addEventListener('blur', toggleFormContent);

