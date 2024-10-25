import { listData } from "../../lib/dummyData";
import "./listpage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { listPageLoader } from "../../lib/loaders";
import { Suspense } from "react";
import Loader from "../../components/loaders/Loader";

export default function Listpage() {
  const data = useLoaderData();

  return (
    <Suspense
      fallback={
        <div className="loader">
          <Loader />
        </div>
      }
    >
      <div className="listPage">
        <div className="listContainer">
          <div className="wrapper">
            <Filter />
            <Suspense fallback={<Loader />}>
              <Await
                resolve={data.postResponse}
                errorElement={<p>Error loading posts</p>}
              >
                {(postResponse) =>
                  postResponse.data.map((post) => (
                    <Card key={post.id} item={post} />
                  ))
                }
              </Await>
            </Suspense>
          </div>
        </div>
        <div className="mapContainer">
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error in loading map</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </div>
      </div>
    </Suspense>
  );
}
