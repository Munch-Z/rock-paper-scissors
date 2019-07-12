//Firebase

const firebaseConfig = {
    apiKey: "AIzaSyAnA7RWvUe0FKxVlCkwh4sqhBgHYh9w1EE",
    authDomain: "rockpaperscissors-zachm.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-zachm.firebaseio.com",
    projectId: "rockpaperscissors-zachm",
    storageBucket: "",
    messagingSenderId: "702718543946",
    appId: "1:702718543946:web:fe2cff6f7149df89"
}




//DOM Stuff

const selectionsDiv = document.getElementById('selections');

//test is a placeholder string because firebase is dumb and doesn't let me check for paths that are empty strings

const name = prompt('What is your name, adventurer?')

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const myConnectionsRef = database.ref('connectedUsers');
const connectedRef = database.ref('.info/connected');

let host = false;

connectedRef.on('value', (snap) => {
    if (snap.val() === true) {

        myConnectionsRef.once('value').then((snap) => {
            if (!snap.child('playerOne').exists()) {
                const con = myConnectionsRef.child('playerOne');
                con.onDisconnect().remove();
                con.set({
                    name: name,
                    choice: "",
                    wins: 0,
                    losses: 0,
                    ties: 0,
                });
                host = true;
            } else {

                const con = myConnectionsRef.child('playerTwo');
                con.onDisconnect().remove();
                con.set({
                    name: name,
                    choice: "",
                    wins: 0,
                    losses: 0,
                });
            }
        })
    }
})

selectionsDiv.addEventListener('click', (e) => {
    const playerPicked = e.target.id;

    myConnectionsRef.once('value').then((snap) => {
        if (snap.child('playerOne').exists() && snap.child('playerTwo').exists()) {
            if (host) {
                myConnectionsRef.child('playerOne').child('choice').set(playerPicked);
            } else {
                myConnectionsRef.child('playerTwo').child('choice').set(playerPicked);
            }

            checkPicks();
        }
    });
})

function checkPicks() {

    myConnectionsRef.once('value').then((snap) => {

        //html stuff


        //get values from DB
        let p1Pick = snap.child('playerOne').child('choice').val();
        let p2Pick = snap.child('playerTwo').child('choice').val();
        let p1Wins = snap.child('playerOne').child('wins').val();
        let p2Wins = snap.child('playerTwo').child('wins').val();
        let p1Losses = snap.child('playerOne').child('losses').val();
        let p2Losses = snap.child('playerTwo').child('losses').val();
        let p1Ties = snap.child('playerOne').child('ties').val();

        if (p1Pick && p2Pick) {


            if (p1Pick === p2Pick) {
                p1Ties++;
                myConnectionsRef.child('playerOne').child('ties').set(p1Ties);
                myConnectionsRef.child('playerOne').child('choice').set("");
                myConnectionsRef.child('playerTwo').child('choice').set("");
            } else if (p1Pick === 'paper' && p2Pick === 'rock' || p1Pick === 'rock' && p2Pick === 'scissors' || p1Pick === 'scissors' && p2Pick === 'paper') {
                p1Wins++;
                p2Losses++;
                myConnectionsRef.child('playerOne').child('wins').set(p1Wins);
                myConnectionsRef.child('playerTwo').child('losses').set(p2Losses);
                myConnectionsRef.child('playerOne').child('choice').set("");
                myConnectionsRef.child('playerTwo').child('choice').set("");
            } else {
                p1Losses++;
                p2Wins++;
                myConnectionsRef.child('playerOne').child('losses').set(p1Losses);
                myConnectionsRef.child('playerTwo').child('wins').set(p2Wins);
                myConnectionsRef.child('playerOne').child('choice').set("");
                myConnectionsRef.child('playerTwo').child('choice').set("");
            }


        }
    })
}



//playerOne listeners
myConnectionsRef.child('playerOne').child('wins').on('value', (snap) => {
    const alertZone = document.getElementById('alertZone');
    const player1WinsDiv = document.getElementById('player1Wins');
    let p1Wins = snap.val()

    player1WinsDiv.textContent = 'Player 1 Wins: ' + p1Wins;
    if (p1Wins > 0) {
        alertZone.textContent = 'Player 1 Won!'
    }
})

myConnectionsRef.child('playerOne').child('losses').on('value', (snap) => {
    const player1LossesDiv = document.getElementById('player1Losses');
    let p1Losses = snap.val()
    player1LossesDiv.textContent = 'Player 1 Losses: ' + p1Losses;
})

myConnectionsRef.child('playerOne').child('choice').on('value', (snap) => {
    let pick = snap.val();
    const player1PickDiv = document.getElementById('player1');
    if (pick) {
        player1PickDiv.textContent = 'Player 1 picked: ' + pick.toUpperCase();
    }

})



//playerTwo listeners
myConnectionsRef.child('playerTwo').child('wins').on('value', (snap) => {
    let p2Wins = snap.val()
    const player2WinsDiv = document.getElementById('player2Wins');
    const alertZone = document.getElementById('alertZone');

    player2WinsDiv.textContent = 'Player 2 Wins: ' + p2Wins;
    if (p2Wins > 0) {
        alertZone.textContent = 'Player 2 Won!'
    }

})

myConnectionsRef.child('playerTwo').child('losses').on('value', (snap) => {
    const player2LossesDiv = document.getElementById('player2Wins');
    let p2Losses = snap.val()
    player2LossesDiv.textContent = 'Player 2 Wins: ' + p2Losses;
})

myConnectionsRef.child('playerTwo').child('choice').on('value', (snap) => {
    const player2PickDiv = document.getElementById('player2');
    let pick = snap.val();
    if (pick) {
        player2PickDiv.textContent = 'Player 2 picked: ' + pick.toUpperCase();
    }

})

//Ties
myConnectionsRef.child('playerOne').child('ties').on('value', (snap) => {
    let ties = snap.val()
    const tiesDiv = document.getElementById('ties');
    const alertZone = document.getElementById('alertZone');

    tiesDiv.textContent = 'Ties: ' + ties;
    if (ties > 0) {
        alertZone.textContent = 'It\'s a tie!';
    }
})