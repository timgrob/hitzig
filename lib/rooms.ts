import prisma from "@/lib/prisma";

type RoomVisibilityUser = {
  isCloseFriend: boolean;
};

const roomSelect = {
  id: true,
  name: true,
  description: true,
  capacity: true,
};

function visibleRoomWhere(user: RoomVisibilityUser) {
  return user.isCloseFriend ? {} : { requiresCloseFriend: false };
}

export async function getVisibleRoomsForUser(user: RoomVisibilityUser) {
  return prisma.room.findMany({
    where: visibleRoomWhere(user),
    select: roomSelect,
    orderBy: { name: "desc" },
  });
}

export async function canUserAccessRoom(
  user: RoomVisibilityUser,
  roomId: string
) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      ...visibleRoomWhere(user),
    },
    select: { id: true },
  });

  return Boolean(room);
}
