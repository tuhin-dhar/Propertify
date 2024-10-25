import axios from "axios";
import { defer } from "react-router-dom";

export async function singlePageLoader({ request, params }) {
  const response = await axios.get(
    `http://localhost:1200/api/posts/${params.id}`
  );
  return response.data;
}

export async function listPageLoader(request, params) {
  const query = request.request.url.split("?")[1];

  try {
    const postPromise = axios.get(`http://localhost:1200/api/posts?${query}`);
    return defer({
      postResponse: postPromise,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function profilePageLoader() {
  const postPromise = await axios.get(
    "http://localhost:1200/api/users/profilePosts",
    {
      withCredentials: true,
    }
  );

  const chatPromise = await axios.get("http://localhost:1200/api/chat/", {
    withCredentials: true,
  });

  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
}
