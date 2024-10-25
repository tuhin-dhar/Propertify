import { listData } from "../../lib/dummyData";
import Card from "../card/Card";
import "./list.scss";

export default function List({ posts }) {
  console.log(posts.userPost);

  const userPosts = posts.userPost;
  console.log(userPosts);
  return (
    <div className="list">
      {userPosts.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}
