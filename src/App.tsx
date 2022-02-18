import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [user] = useState(`user-${Date.now()}`);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log(socket.connected);
    });

    socket.emit('join', {
      room: 'user-room',
      from: { key: user }
    });

    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = (document.getElementById("input") as HTMLInputElement);

    form?.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input?.value) {
        console.log({
          room: 'user-room',
          from: { key: `user-elbrabo-${Date.now()}` },
          data: input.value
        });

        socket.emit("send", {
          room: 'user-room',
          from: { key: `user-elbrabo-${Date.now()}` },
          data: input.value
        });
        input.value = "";
      }
    });

    socket.on("receive", payload => {
      console.log('Event: ', payload.data);
      const item = document.createElement("li");
      item.textContent = `${payload.from.key}: ${payload.data}`;
      messages?.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });
  }, [user]);

  return (
    <div className="App">
      {user}
      <ul id="messages"></ul>{" "}
      <form id="form" action="">
        {" "}
        <input id="input" />
        <button>Send</button>{" "}
      </form>
    </div>
  );
}

export default App;
