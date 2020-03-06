console.log(window.location);
console.log(window.location.search);

let queryString = window.location.search;

queryString = queryString.split('?').join('');
console.log(queryString);
queryString = queryString.split(/['&', '=']/);
console.log(queryString);
queryString = queryString.filter((item, index) => {
    if (index % 2 !== 0) {
        return item
    }
})
console.log(queryString);
    



const flight = document.getElementById('flight');
flight.innerText = queryString[0];

const seat = document.getElementById('seat');
seat.innerText = queryString[1];

const name = document.getElementById('name');
name.innerText = queryString[2] + ' ' + queryString[3];

const email = document.getElementById('email');
email.innerText = queryString[4];
