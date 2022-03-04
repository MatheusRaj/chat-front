import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [user] = useState(`user-${Date.now()}`);

  useEffect(() => {
    const messages = document.getElementById("messages");
    const form = document.getElementById("form");
    const input = (document.getElementById("input") as HTMLInputElement);

    const socket = io("http://localhost:3001", { path: '/' });

    socket.on("connect", () => {
      console.log(socket.connected);
    });

    socket.emit('join', {
      room: 'user-room',
      from: user
    });

    socket.on('list-messages', (res) => {
      res.map(({ message }: any) => {
        const el = document.createElement("li");
        el.textContent = `${message.from}: ${message.content}`;
        messages?.appendChild(el);
        window.scrollTo(0, document.body.scrollHeight);

        return true;
      });
    });

    form?.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input?.value) {
        console.log({
          room: 'user-room',
          from: user,
          data: input.value
        });

        const item = document.createElement("li");
        item.textContent = `${user}: ${input.value}`;
        messages?.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);

        socket.emit("send", {
          room: 'user-room',
          message: {
            from: user,
            content: input.value
          }
        });
        input.value = "";
      }
    });

    socket.on("receive", ({ message }) => {
      console.log('Event: ', message);
      const item = document.createElement("li");
      item.textContent = `${message.from}: ${message.content}`;
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
