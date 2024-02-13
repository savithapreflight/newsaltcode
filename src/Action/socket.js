import io from 'socket.io-client';
import * as Enviornment from "./environment";

export function connectTOServer(){
    const socket = io(Enviornment.socket());
    console.log('socket...connection')
    console.log(socket)
    return {
        'type':'SOCKET_CONNECTION',
        'payload':socket
    }
}


export function joinRoom(room_id,user_id){
    return {
        'airport_code':room_id,
        'user_id':user_id
    }
}
