"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
//DATA
export const feedsGetAllByAgentId = async () => {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  const feeds = await db.feed.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return feeds;
};

export const feedsGetAllByAgentIdFiltered = async (
  from: string,
  to: string
) => {
  try {
    const user = await currentUser();
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const feeds = await db.feed.findMany({
      where: { userId: user?.id, createdAt: { lte: toDate, gte: fromDate } },

      orderBy: { createdAt: "desc" },
    });
    return feeds;
  } catch {
    return [];
  }
};

export const feedsGetAllByAgentIdUnread = async () => {
  try {
    const user = await currentUser();
    const feeds = await db.feed.findMany({
      where: { userId: user?.id, read: false },
    });
    return feeds;
  } catch {
    return [];
  }
};

//ACTIONS
export const feedInsert = async (
  content: string,
  link: string,
  userId: string,
  read: boolean = false
) => {
  await db.feed.create({
    data: {
      content,
      link,
      userId,
      read,
    },
  });
};

export const feedsUpdateAllUnread = async () => {
  const user = await currentUser();
  if (!user) {
    return { error: "unathorized!" };
  }

  await db.feed.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  return { success: "All Feeds have been read!" };
};
