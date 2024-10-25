import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get users",
    });
  }
}

export async function getUser(req, res) {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get User",
    });
  }
}

export async function updateUser(req, res) {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  let updatedPassword = null;

  if (id !== tokenUserId) {
    return res.status(403).json({
      message: "Not Authorized",
    });
  }

  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...userInfo } = updatedUser;

    return res.status(200).json(userInfo);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to update user",
    });
  }
}

export async function deleteUser(req, res) {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({
      message: "Not Authorized",
    });
  }
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "User deleted",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to delete user",
    });
  }
}

export async function savePost(req, res) {
  console.log("here2");
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  console.log(postId, tokenUserId);

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });

      return res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId: postId,
        },
      });

      return res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json();
  }
}

export async function profilePosts(req, res) {
  const tokenUserId = req.userId;

  try {
    const userPost = await prisma.post.findMany({
      where: {
        userId: tokenUserId,
      },
    });

    const saved = await prisma.savedPost.findMany({
      where: {
        userId: tokenUserId,
      },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    return res.status(200).json({
      userPost,
      savedPosts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to profile posts" });
  }
}
