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
const player1PickDiv = document.getElementById('player1');
const player2PickDiv = document.getElementById('player2');
const player1WinsDiv = document.getElementById('player1Wins');
const player1LossesDiv = document.getElementById('player1Losses');
const player2WinsDiv = document.getElementById('player2Wins');
const player2LossesDiv = document.getElementById('player2Wins');
const tiesDiv = document.getElementById('ties');

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
                    picked: false
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
                    ties: 0,
                    picked: false
                });
            }
        })
    }
})

selectionsDiv.addEventListener('click', (e) => {
    const playerPicked = e.target.id;

    console.log(host);

    myConnectionsRef.once('value').then((snap) => {
        if (snap.child('playerOne').exists() && snap.child('playerTwo').exists()) {
            let player1picked = snap.child('playerOne').child('picked').val();
            if (host) {
                myConnectionsRef.child('playerOne').child('choice').set(playerPicked);
                myConnectionsRef.child('playerOne').child('picked').set(true);
            } else {
                myConnectionsRef.child('playerTwo').child('choice').set(playerPicked);
                myConnectionsRef.child('playerTwo').child('picked').set(true);
            }

            checkPicks();
        }
    });
})

function checkPicks() {
    const alertZone = document.getElementById('alertZone');
    console.log('Picks function fired')

    myConnectionsRef.once('value', (snap) => {
        let p1Pick = snap.child('playerOne').child('choice').val();
        let p2Pick = snap.child('playerTwo').child('choice').val();
        let p1Wins = snap.child('playerOne').child('wins').val();
        let p2Wins = snap.child('playerTwo').child('wins').val();
        let p1Losses = snap.child('playerOne').child('losses').val();
        let p2Losses = snap.child('playerTwo').child('losses').val();
        let p1Ties = snap.child('playerOne').child('ties').val();
        let p2Ties = snap.child('playerTwo').child('ties').val();
        console.log('Inside the promise');

        if (p1Pick && p2Pick !== "") {
            myConnectionsRef.child('playerOne').child('picked').set(true);
            myConnectionsRef.child('playerTwo').child('picked').set(true);
            console.log('Both picks were not strings')

            if (p1Pick === p2Pick) {
                p1Ties++;
                p2Ties++;
                myConnectionsRef.child('playerOne').child('ties').set(p1Ties);
                myConnectionsRef.child('playerTwo').child('ties').set(p2Ties);
                myConnectionsRef.child('playerOne').child('choice').set("");
                myConnectionsRef.child('playerTwo').child('choice').set("");
                alertZone.textContent = 'Tie';
                console.log('tie');

                tiesDiv.textContent = 'Ties: ' + p1Ties;

                tiesDiv.textContent = 'Ties ' + p2Ties;
            } else if (p1Pick === 'paper' && p2Pick === 'rock' || p1Pick === 'rock' && p2Pick === 'scissors' || p1Pick === 'scissors' && p2Pick === 'paper') {
                p1Wins++;
                p2Losses++;
                myConnectionsRef.child('playerOne').child('wins').set(p1Wins);
                myConnectionsRef.child('playerTwo').child('losses').set(p2Losses);
                myConnectionsRef.child('playerOne').child('choice').set("");
                myConnectionsRef.child('playerTwo').child('choice').set("");
                alertZone.textContent = 'Player 1 Wins';
                console.log('Player 1 Wins');

                player1WinsDiv.textContent = 'Player 1 Wins: ' + p1Wins;

                player2LossesDiv.textContent = 'Player 1 Losses ' + p2Losses;

            } else {
                console.log('Player 1 loses');
                p1Losses++;
                p2Wins++;
                myConnectionsRef.child('playerOne').child('losses').set(p1Losses);
                myConnectionsRef.child('playerTwo').child('wins').set(p2Wins);
                myConnectionsRef.child('playerOne').child('choice').set("");
                myConnectionsRef.child('playerTwo').child('choice').set("");
                alertZone.textContent = 'Player 2 Wins';

                player1LossesDiv.textContent = 'Player 1 Losses: ' + p1Losses;

                player2WinsDiv.textContent = 'Player 2 Wins: ' + p2Wins;


            }


        }
    })
}
