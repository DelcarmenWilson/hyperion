"use client";
import React, {
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from "react";

import { UserSocket } from "@/types";

import { useChatStore } from "@/stores/chat-store";
import { useCalendarStore } from "@/stores/calendar-store";
import { usePhoneStore } from "@/stores/phone-store";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useSocket } from "@/hooks/use-socket";
import { useSocketStore } from "@/stores/socket-store";

import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "./socket";

import { EmptyCard } from "@/components/reusable/empty-card";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;
  const user = useCurrentUser();
  const {
    onUserConnectDisconnect,
    updateUsers,
    fetchData: fetchAllUsers,
    loaded,
  } = useChatStore();
  const { fetchData: fetchCalendarData } = useCalendarStore();
  const { fetchData: fetchScriptData } = usePhoneStore();
  const { onSetSocket } = useSocketStore();

  const socket = useSocket(process.env.NEXT_PUBLIC_WS_URL!, {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,
  });

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
    fetchScriptData();
    fetchAllUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!loaded) return;

    socket.connect();
    SocketDispatch({ type: "update_socket", payload: socket });
    onSetSocket(socket);
    StartListeners();
    SendHandshake();
  }, [loaded]);

  const StartListeners = () => {
    /** Messages */
    socket.on("user_connected", (userId) => {
      onUserConnectDisconnect(userId, true);
      Log("User connected message received");
    });

    /** Messages */
    socket.on("user_disconnected", (uid: string) => {
      Log("User disconnected message received");
      onUserConnectDisconnect(uid, false);
    });

    /** Connection / reconnection listeners */
    socket.io.on("reconnect", (attempt) => {
      Log("Reconnected on attempt: " + attempt);
      SendHandshake();
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      Log("Reconnection Attempt: " + attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      Log("Reconnection error: " + error);
    });

    socket.io.on("reconnect_failed", () => {
      Log("Reconnection failure.");
      alert(
        "We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later."
      );
    });
  };

  const SendHandshake = async () => {
    Log("Sending handshake to server ...");

    socket.emit(
      "handshake",
      user?.id,
      user?.role.toLocaleLowerCase(),
      user?.name,
      user?.organization,
      async (uid: string, users: UserSocket[]) => {
        updateUsers(users);
        Log("User handshake callback message received");
      }
    );

    setLoading(false);
  };

  const Log = (message: string) => {
    //Turn next line on when debuggin
    // console.info(message);
  };

  if (loading)
    return (
      <div className="h-full w-full flex-center">
        <div className="card-glowing">
          <EmptyCard
            title="Hyperion Loading.."
            subTitle="Only greatness awaits"
          />
        </div>
      </div>
    );

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
