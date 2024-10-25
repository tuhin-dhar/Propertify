import prisma from "../lib/prisma.js";

export async function addMessage(req, res) {
  const tokenUserId = req.userId;
  const chatId = req.params.id;
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findUnique({
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
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = await prisma.message.create({
      data: {
        text: text,
        userId: tokenUserId,
        chatId: chatId,
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
        seenBy: [tokenUserId],
        lastMessage: text,
      },
    });

    return res.status(200).json(message);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Cannot add message" });
  }
}
