import prisma from "../lib/prisma.js";

export async function getChats(req, res) {
  const tokenUserId = req.userId;

  try {
    const userWithChats = await prisma.chatsOnUsers.findMany({
      where: {
        userIds: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        chats: true,
      },
    });

    console.log(userWithChats);

    for (const chat of userWithChats) {
      const recieverId = chat.userIds.find((id) => id !== tokenUserId);
      console.log(recieverId);

      const reciever = await prisma.user.findUnique({
        where: {
          id: recieverId || undefined,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      chat.reciever = reciever;
    }

    return res.status(200).json(userWithChats);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in loading chats" });
  }
}

export async function getChat(req, res) {
  const chatId = req.params.id;
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
        users: {
          some: {
            userIds: {
              hasSome: [tokenUserId],
            },
          },
        },
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    return res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Chat cannot be loaded" });
  }
}

export async function addChat(req, res) {
  const tokenUserId = req.userId;

  if (tokenUserId === req.body.recieverId) {
    return res.status(401).json({ message: "Cannot create chat" });
  }

  try {
    const chatAlreadyExists = await prisma.chatsOnUsers.findFirst({
      where: {
        AND: [
          { userIds: { has: tokenUserId } },
          { userIds: { has: req.body.recieverId } },
        ],
      },
    });

    if (!chatAlreadyExists) {
      const newChat = await prisma.chat.create({
        data: {
          users: {
            create: [
              {
                userIds: [tokenUserId, req.body.recieverId],
                user: {
                  connect: {
                    id: tokenUserId,
                  },
                },
              },
            ],
          },
        },
      });
      return res.status(200).json(newChat);
    }

    return res.status(200).json({ message: "No new chat created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to create chat" });
  }
}

export async function readChat(req, res) {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: chatId,
        users: {
          some: {
            userIds: {
              hasSome: [tokenUserId],
            },
          },
        },
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    return res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Cannot read chat" });
  }
}
