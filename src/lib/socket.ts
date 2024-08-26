"use client";

import { io } from "socket.io-client";
import Cookies from "js-cookie";

export const createSocket = () => {
  const token = Cookies.get('token');

  console.log("Create socket with token:", token);

  return io({
    auth: {
      token,
    },
  });
}

export const socket = createSocket();