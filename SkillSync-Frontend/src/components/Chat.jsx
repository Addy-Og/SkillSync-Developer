import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const loggedInUser = useSelector((store) => store.user);
  
  const [messages, setMessages] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      setMessages(res.data.messages || []);
      const partner = res.data.participants?.find((p) => p._id !== loggedInUser._id);
      setChatPartner(partner);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchChatHistory();
    }
  }, [targetUserId, loggedInUser]);

  useEffect(() => {
    if (!loggedInUser) return;

    const socketInstance = io({ withCredentials: true });
    setSocket(socketInstance);

    socketInstance.emit("join_chat", { targetUserId });

    socketInstance.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("online_users", (onlineUserIds) => {
      setIsPartnerOnline(onlineUserIds.includes(targetUserId));
    });

    socketInstance.on("user_status_change", ({ userId, isOnline }) => {
      if (userId === targetUserId) {
        setIsPartnerOnline(isOnline);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [targetUserId, loggedInUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    socket.emit("send_message", { targetUserId, text: newMessage });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto my-5 bg-base-300 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between bg-base-200 px-6 py-4 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className={`avatar ${isPartnerOnline ? "online" : "offline"}`}>
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={chatPartner?.photoUrl}
                alt={`${chatPartner?.firstName}'s profile`}
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">
              {chatPartner?.firstName} {chatPartner?.lastName}
            </h2>
            <p className={`text-xs font-semibold ${isPartnerOnline ? "text-success" : "text-slate-400"}`}>
              {isPartnerOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <Link to="/connections">
          <button className="btn btn-outline btn-sm btn-primary">Back to Connections</button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900 bg-opacity-40">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <span className="text-4xl">👋</span>
            <p className="font-semibold">Say hello to {chatPartner?.firstName}!</p>
            <p className="text-xs">Start a real-time conversation.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId._id === loggedInUser._id;
            return (
              <div
                key={msg._id}
                className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={isMe ? loggedInUser.photoUrl : chatPartner?.photoUrl}
                      alt="avatar"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="chat-header text-xs opacity-50 mb-1">
                  {isMe ? "You" : chatPartner?.firstName}
                </div>
                <div
                  className={`chat-bubble text-sm ${
                    isMe
                      ? "chat-bubble-primary text-white"
                      : "chat-bubble-secondary text-white"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="chat-footer opacity-50 text-[10px] mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-4 bg-base-200 px-6 py-4 border-t border-slate-700">
        <input
          type="text"
          placeholder={`Type a message to ${chatPartner?.firstName}...`}
          className="input input-bordered flex-1 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-primary border-slate-600 rounded-xl"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="btn btn-primary rounded-xl px-6"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
