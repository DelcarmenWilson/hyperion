import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateMediaType } from "@/types/media";

//DATA
export const mediaGetAll = async () => {
  const user = await currentUser();
  if (!user?.id) return [];

  const mediafiles = await db.media.findMany({
    where: {
      userId: user.id,
    },
  });
  return mediafiles;
};
//ACTIONS
export const mediaInsert = async (mediaFile: CreateMediaType) => {
  const user = await currentUser();
  if (!user?.id) return [];

  const response = await db.media.create({
    data: {
      link: mediaFile.link,
      name: mediaFile.name,
      userId: user.id,
    },
  });

  return response;
};

export const mediaDeleteById = async (id: string) => {
  const response = await db.media.delete({
    where: {
      id,
    },
  });
  return response;
};
