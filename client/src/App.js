import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("https://chatapp2-socketio.onrender.com");
function App() {
  const [input, setInput] = useState({
    name: "",
    room: "",
  });
  const [showChat, setShowChat] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.name === "" || input.room === "") {
      return alert("please provide name and room key");
    }
    socket.emit("join_room", input.room);
    setShowChat(true);
  };
  return (
    <div className="App">
      <div>
        <form className="w-[80%] mx-auto my-5 flex items-center laptop:flex-row tablet:flex-col mobile:flex-col smallmobile:flex-col">
          <input
            value={input.name}
            onChange={(e) => {
              setInput((prev) => ({ ...prev, name: e.target.value }));
            }}
            type="text"
            placeholder="Enter your name"
            className="border border-gray-300 py-1 px-2 rounded-sm w-full max-w-[350px] mx-1"
            disabled={showChat === false ? true : false}
          />
          <input
            value={input.room}
            onChange={(e) => {
              setInput((prev) => ({ ...prev, room: e.target.value }));
            }}
            type="text"
            placeholder="Enter room ID"
            disabled={showChat === false ? true : false}
            className="border border-gray-300 py-1 px-2 rounded-sm w-full max-w-[350px] mx-1"
          />
          <button
            onClick={handleSubmit}
            disabled={showChat === false ? true : false}
            className=" mx-1 px-2 py-1 w-full max-w-[350px] bg-green-500 text-white font-semibold tracking-[1.5px] rounded-sm border border-green-500"
          >
            Join Room
          </button>
        </form>
        {showChat && (
          <Chat socket={socket} name={input.name} room={input.room} />
        )}
      </div>
    </div>
  );
}

export default App;
