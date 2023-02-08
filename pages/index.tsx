import React, { useState, useEffect } from "react";
import axios from "axios";

const MESSAGE_URL = "http://localhost:8000/chatapp/message";

const MessageComponent = ({ sendthing, isMine }) => {
  const floatStyle = isMine ? "float-right" : "float-left";
  const colorStyle = isMine ? "bg-gray-300" : "bg-white";
  return (
    <div className="overflow-hidden">
      {isMine || (
        <div className="float-left mr-2">{sendthing.sendername_id}</div>
      )}
      <div
        className={`rounded-t-md border-2 px-2 py-0 mt-1 text-base bg-gray-300 ${colorStyle} ${floatStyle}`}
      >
        {sendthing.message}
      </div>
      <div className={`${floatStyle} mt-5 text-gray-400 text-xs`}>
        {sendthing.created_at[0]}:{sendthing.created_at[1]}
      </div>
    </div>
  );
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [sendList, setSendList] = useState(undefined);
  //これはuseeffectの第二引数に渡す用
  const [renderAfterSend, setRenderAfterSend] = useState(false);

  const sendMessage = () => {
    if (!message) {
      return;
    } else {
      const sendInformation = { chatappUser_id: 3, message: message };
      axios
        .post(MESSAGE_URL, sendInformation)
        .then((res) => {
          console.log(res);
          setRenderAfterSend(!renderAfterSend);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    axios
      .get(MESSAGE_URL)
      .then((res) => {
        setSendList(res.data);
        console.log(res.data);
        setMessage("");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [renderAfterSend]);

  if (sendList) {
    return (
      <>
        <div className="fixed top-0 w-full py-1 mx-auto bg-slate-300 grid grid-cols-7">
          <h1 className="text-3xl col-start-1 col-end-2">▷</h1>
          <h1 className="text-3xl flex justify-center col-start-3 col-end-6">
            {sendList[0].sendername}
          </h1>
        </div>
        <div className="my-12 overflow-y-scroll h-auto">
          {sendList.map(
            (
              sendthing: {
                sendername_id: number;
                message: string;
                sendername: string;
                created_at: number[];
              },
              index: number
            ) => {
              const isMine = sendthing.sendername_id == 3;
              return (
                <div key={index}>
                  <MessageComponent sendthing={sendthing} isMine={isMine} />
                </div>
              );
            }
          )}
        </div>
        <div className="fixed bottom-0 w-full px-0 mx-auto mt-10 bg-slate-300">
          <form>
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className="block w-full p-2 pl-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-700 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
              placeholder="message"
              required
            />
            <button
              type="submit"
              onClick={sendMessage}
              className="absolute right-0 bottom-0 bg-slate-300 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              送信
            </button>
          </form>
        </div>
      </>
    );
  } else {
    return;
  }
};

export default Chat;
