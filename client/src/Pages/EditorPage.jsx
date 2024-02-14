import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { ACTIONS } from "../Action";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
const EditorPage = () => {
  const effectRan = useRef(false);
  const codeRef = useRef(null);
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  const handleErrors = (err) => {
    toast.error("Socket connection failed, try again later.");
    reactNavigator("/");
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const init = async () => {
        socketRef.current = await initSocket();
        socketRef.current.on("connect_error", (err) => handleErrors(err));
        socketRef.current.on("connect_failed", (err) => handleErrors(err));

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          userName: location.state?.userName,
        });

        //listning for joined event
        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, userName, socketId }) => {
            if (userName !== location.state?.userName) {
              toast.success(`${userName} joined the room.`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        );

        //listining for disconnected
        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
          toast.success(`${userName} left the room.`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        });
      };
      init();
      return () => {
        socketRef.current?.off(ACTIONS.JOIN);
        socketRef.current?.off(ACTIONS.DISCONNECTED);
        socketRef.current?.off(ACTIONS.JOIN);
        socketRef.current?.disconnect();
        effectRan.current = true;
      };
    }
    return () => {
      socketRef.current?.off(ACTIONS.JOIN);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
      socketRef.current?.off(ACTIONS.JOIN);
      socketRef.current?.disconnect();
    };
  }, []);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied");
    } catch (err) {
      toast.error("Could mot copy the room Id");
      console.log(err);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/");
    window.location.reload();
  };

  if (!location.state) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/connect-logo2.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => {
              return (
                <Client key={client.socketId} userName={client.userName} />
              );
            })}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
