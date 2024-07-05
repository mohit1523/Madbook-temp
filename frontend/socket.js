import io from "socket.io-client";

export const socket = io("http://https://madbook-api.vercel.app/:3000", {
    autoConnect: false,
});
