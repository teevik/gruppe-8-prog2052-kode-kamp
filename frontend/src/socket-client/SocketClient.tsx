// import {useEffect, useState} from 'react'
// import {socket} from '../socket'
// //import {SocketData} from '@backend/socketio/types'

// interface SocketData {
//     userID : string;
//     userName : string;
// }

// function SocketClient(){

//     return (
//         <>
//             <p>Amount of players in lobby: {amountPlayersLobby}/{totalPlayersLobby}</p>
//             {countdownLobby != "" && <p>Lobby starts in {countdownLobby}</p>}
//             {players.length > 0 && players.map(player=>{
//                 return <p key={player.userID}>{player.userName}</p>
//             })}
//             {/*inLobby ? <Lobby/>:<Game/> */}
//             {inLobby ?

//             <button onClick={()=>{
//                 let code = "your code here";
//                 socket.emit("submitCode", code);
//             }}>Submit code</button>
//             : <button onClick={()=>{
//                 joinLobby()
//             }}>Join lobby</button>}
//         </>
//     )

// }

// export {
//     SocketClient
// }
