import React from "react";
import { Button } from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./App.scss";
import News from "./components/News";
import { useEffect } from "react";
import { PushSpinner } from "react-spinners-kit";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [data, setData] = useState({
    allNews: [],
    totalResults: 0,
    totalPages: 0,
  });
  const [apiQuery, setApiQuery] = useState("");
  const getNewsData = async (p) => {
    setLoading(true);
    await axios
      .get(`http://hn.algolia.com/api/v1/search?query=${query}&page=${p}`)
      .then((result) => {
        setLoading(false);
        // setNewsData(result.data.hits);
        setData({
          allNews: result.data.hits,
          totalResults: result.data.nbHits,
          totalPages: result.data.nbPages,
        });

        setApiQuery(result.data.query);
        // setPageNumber(result.data.page);
        window.sessionStorage.setItem("news", JSON.stringify(result.data.hits));
        window.sessionStorage.setItem("query", query);
        window.sessionStorage.setItem("totalResults", result.data.nbHits);
        window.sessionStorage.setItem("totalPages", result.data.nbPages);

        console.log(result.data.hits);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    getNewsData(pageNumber);
  };

  const handlePrev = () => {
    getNewsData(pageNumber - 1);
    setPageNumber(pageNumber - 1);
  };

  const handleNext = () => {
    getNewsData(pageNumber + 1);
    setPageNumber(pageNumber + 1);
  };
  useEffect(() => {
    if (window.sessionStorage.getItem("news")) {
      setData({
        allNews: JSON.parse(window.sessionStorage.getItem("news")),
        totalResults: window.sessionStorage.getItem("totalResults"),
        totalPages: window.sessionStorage.getItem("totalPages"),
      });
      setQuery(window.sessionStorage.getItem("query"));
    }
  }, []);

  return (
    <div className="App">
      <div className="navbar">
        <div className="logo">HackerNews App</div>
        <div className="links">
          <a href="#About">About</a>
          <a href="#Blog">Blog</a>
          <a href="#Contactus">Contact us</a>
        </div>
      </div>
      <h1 className="pageHeader">Get latest NEWS from Hacker News</h1>
      <div className="searchBox">
        <form className="searchForm" onSubmit={handleSearch}>
          <input
            className="searchField"
            placeholder="Enter your search query here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button className="searchButton" type="submit" variant="contained">
            {loading ? (
              <CircularProgress size={30} style={{ color: "#fff" }} />
            ) : (
              "Search News"
            )}
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="loaderWrapper">
          <PushSpinner color="white" />
        </div>
      ) : (
        <div className="searchResults">
          {data.allNews.length > 0 && (
            <h2 className="countHeader">
              Found{" "}
              <span style={{ color: "#dd963e" }}>{data.totalResults}</span>{" "}
              results for keyword "{apiQuery || query}" -
            </h2>
          )}
          <div className="newsCards">
            {data.allNews.map((news) => (
              <News key={news.objectID} news={news} />
            ))}
          </div>
        </div>
      )}

      {data.allNews.length > 0 && (
        <div className="navigate">
          <Button
            variant="contained"
            className="prevButton"
            disabled={pageNumber === 0}
            onClick={handlePrev}
          >
            <ArrowBackIosIcon />
          </Button>
          <span className="text">
            Showing page <b>{pageNumber + 1}</b> of {data.totalPages}
          </span>
          <Button
            variant="contained"
            className="nextButton"
            disabled={pageNumber === 19}
            onClick={handleNext}
          >
            <ChevronRightIcon fontSize="large" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
