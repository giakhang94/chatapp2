import { useEffect, useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
const Chat = ({ socket, name, room }) => {
  const inputRef = useRef();
  const [dataChat, setDataChat] = useState([]);
  const [message, setMessage] = useState("");
  const handleSend = async (e) => {
    e.preventDefault();
    if (message !== "") {
      let hours = new Date(Date.now()).getHours();
      let minutes = new Date(Date.now()).getMinutes();
      let time = hours + ":" + minutes;
      setDataChat((prev) => [...prev, { message, name, room, time }]);
      await socket.emit("send_chat", { message, name, room, time });
      setMessage("");
    }
  };
  useEffect(() => {
    socket.on("send_back_chat", (data) => {
      setDataChat((prev) => [...prev, data]);
    });
  }, [socket]);
  return (
    <div className="chat w-full flex justify-center">
      <div className="chat-container w-full p-10 mx-auto ">
        <div className="header bg-white h-10 flex items-center px-3 text-slate-700 font-semibold text-lg border border-gray-300">
          Room Chat {room}
        </div>
        <div className="body px-[5px] border border-gray-300 pb-3 pt-3 h-[250px]">
          <ScrollToBottom className="overflow-y-auto overflow-x-hidden h-full">
            {dataChat.map((data, index) => {
              return (
                <div
                  key={index}
                  className={`bg-white flex flex-col  ${
                    data.name === name ? "items-end" : ""
                  } `}
                >
                  <span
                    className={` ${
                      name === data.name
                        ? "bg-blue-500 self-end"
                        : "bg-green-500"
                    } px-2 rounded-md mb-1 py-1 block w-fit text-right`}
                  >
                    {data.message}
                    <div>
                      <span className="text-[9px] font-bold italic text-gray-300 mr-3">
                        {data.name}
                      </span>
                      <span className="text-[9px] font-bold italic text-gray-300">
                        {data.time}
                      </span>
                    </div>
                  </span>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <form className="footer w-full flex items-center">
          <input
            type="text"
            ref={inputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="type chat here..."
            className="w-full border border-gray-300 py-2 px-1 rounded-sm"
          />
          <button
            className="py-2 px-2 bg-blue-500 text-white rounded-sm font-semibold border border-blue-500"
            onClick={handleSend}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
export default Chat;
