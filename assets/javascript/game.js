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


let playerCount = 0;

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const myConnectionsRef = database.ref('connectedUsers');
const connectedRef = database.ref('.info/connected');

connectedRef.on('value', (snap) => {
    if (snap.val() === true) {
        const con = myConnectionsRef.push();
        con.onDisconnect().remove();
        con.set(true);
        // checkUsers();
    }
})

// function checkUsers() {
//     database.ref().child('connectedUsers').on('value', (snap) => {
//         if (snap.numChildren() === 2){
//             alert('Start the game');
//         }         
//     });
// }