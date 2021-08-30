import React from "react";
import { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { PushSpinner } from "react-spinners-kit";
import ReactMarkdown from "react-markdown";
import { Button } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import "./NewsDetail.scss";

const NewsDetail = () => {
  const params = new URLSearchParams(useLocation().search);
  const objectID = params.get("id");
  const history = useHistory();
  const [newsDetail, setNewsDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "No Title Found",
    points: 0,
    children: [],
  });
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await axios
        .get(`http://hn.algolia.com/api/v1/items/${objectID}`)
        .then((result) => {
          setLoading(false);
          console.log(result.data);
          setNewsDetail(result.data);
          setData({
            title: result.data.title ? result.data.title : "No title found",
            points: result.data.points ? result.data.points : "No points found",
            children: result.data.children,
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };
    getData();
  }, [objectID]);

  return (
    <div className="wrapper">
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/")}
      >
        <KeyboardBackspaceIcon />
      </Button>
      <span> Back to search results</span>
      {loading ? (
        <div className="loaderWrapper">
          <PushSpinner color="#000" />
        </div>
      ) : (
        <div className="details">
          <h1>
            News Title : <i>{data.title}</i>
          </h1>
          <h1>
            Points : <i>{data.points}</i>
          </h1>
          <h1>Comments</h1>
          <ul className="commentsList">
            {data.children.map((comment) => (
              <li
                key={comment.id}
                dangerouslySetInnerHTML={{ __html: comment.text }}
              ></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
