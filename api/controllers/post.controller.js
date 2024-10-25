import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export async function getPosts(req, res) {
  console.log("getposts");
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.location || undefined,
        type: query.type === "any" ? undefined : query.type,
        property: query.property === "any" ? undefined : query.property,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 100000000,
        },
      },
    });

    console.log(posts);
    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get posts" });
  }
}

export async function getPost(req, res) {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        postDetail: true,
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        }
      });
    }

    return res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failde to get post" });
  }
}

export async function addPost(req, res) {
  const postData = req.body.postData;
  const postDetail = req.body.postDetail;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: tokenUserId,
        postDetail: {
          create: postDetail,
        },
      },
    });

    return res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to add post" });
  }
}

export function updatePost(req, res) {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to update post" });
  }
}

export async function deletePost(req, res) {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(200).json("Post has been deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete post" });
  }
}
