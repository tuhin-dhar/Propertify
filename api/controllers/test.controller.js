import jwt from "jsonwebtoken";

export function shouldBeLoggedIn(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Not Authenticated",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Token is not valid",
      });
    }

    return res.status(200).json({ message: "You are authenticated" });
  });
}

export function shouldBeAdmin(req, res) {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not Auhtorized" });
    }
  });
}
