import io from "socket.io-client";

export const socket = io("ws://madbook-api.vercel.app:3000", {
    autoConnect: false,
    secure: true,
    transports: ['websocket'],
});
