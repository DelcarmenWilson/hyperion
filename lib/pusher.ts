import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'us2',

//   appId : "1740792",
// key:"902514b604c7328f1791",
// secret: "0635ef3fd643efd8c791",
// cluster: "us2"
});

export const pusherClient = new PusherClient(
  "902514b604c7328f1791",
  {
    cluster: 'us2'
  }
);