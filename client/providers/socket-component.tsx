"use client";
import React, {
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from "react";

import { useSocket } from "@/hooks/use-socket";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "./socket";
import { useCurrentUser } from "@/hooks/use-current-user";
import { EmptyCard } from "@/components/reusable/empty-card";
import { UserSocket } from "@/types";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;
  const user = useCurrentUser();

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
    socket.connect();
    SocketDispatch({ type: "update_socket", payload: socket });
    StartListeners();
    SendHandshake();
    // eslint-disable-next-line
  }, []);

  const StartListeners = () => {
    /** Messages */
    socket.on("user_connected", (users: UserSocket[]) => {
      console.info("User connected message received");
      SocketDispatch({ type: "update_users", payload: users });
    });

    /** Messages */
    socket.on("user_disconnected", (uid: string) => {
      console.info("User disconnected message received");
      SocketDispatch({ type: "remove_user", payload: uid });
    });

    /** Connection / reconnection listeners */
    socket.io.on("reconnect", (attempt) => {
      console.info("Reconnected on attempt: " + attempt);
      SendHandshake();
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.info("Reconnection Attempt: " + attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      console.info("Reconnection error: " + error);
    });

    socket.io.on("reconnect_failed", () => {
      console.info("Reconnection failure.");
      alert(
        "We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later."
      );
    });
  };

  const SendHandshake = async () => {
    console.info("Sending handshake to server ...");

    socket.emit(
      "handshake",
      user?.id,
      user?.role.toLocaleLowerCase(),
      user?.name,
      async (uid: string, users: UserSocket[]) => {
        console.info("User handshake callback message received");
        SocketDispatch({ type: "update_users", payload: users });
        SocketDispatch({ type: "update_uid", payload: uid });
      }
    );

    setLoading(false);
  };

  if (loading)
    return (
      <EmptyCard title="Loading Hyperion..." subTitle="Only greatness awaits" />
    );

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
