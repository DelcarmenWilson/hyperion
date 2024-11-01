"use client";
import React, {
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useChatStore } from "@/hooks/use-chat";
import { useSocket } from "@/hooks/use-socket";

import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "./socket";

import { UserSocket } from "@/types";
import { EmptyCard } from "@/components/reusable/empty-card";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;
  const user = useCurrentUser();
  const { updateUser, updateUsers, fetchData } = useChatStore();

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
    fetchData();
    socket.connect();
    SocketDispatch({ type: "update_socket", payload: socket });
    StartListeners();
    SendHandshake();
    // eslint-disable-next-line
  }, []);

  const StartListeners = () => {
    /** Messages */
    socket.on("user_connected", (users: UserSocket[]) => {
      updateUsers(users);
      Log("User connected message received");
      SocketDispatch({ type: "update_users", payload: users });
    });

    /** Messages */
    socket.on("user_disconnected", (uid: string) => {
      Log("User disconnected message received");
      updateUser(uid);
      SocketDispatch({ type: "remove_user", payload: uid });
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
        SocketDispatch({ type: "update_users", payload: users });
        SocketDispatch({ type: "update_uid", payload: uid });
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
      <EmptyCard title="Loading Hyperion..." subTitle="Only greatness awaits" />
    );

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
