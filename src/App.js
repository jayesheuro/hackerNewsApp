import { Button } from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./App.scss";
import News from "./components/News";
import { useEffect } from "react";
import { PushSpinner } from "react-spinners-kit";

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [data, setData] = useState({
    allNews: [],
    totalResults: 0,
    totalPages: 0,
  });
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
      <h1 className="pageHeader">
        <i>Get latest NEWS from Hacker News</i>
      </h1>
      <div className="searchBox">
        <form className="searchForm" onSubmit={handleSearch}>
          <input
            className="searchField"
            placeholder="Enter your search query here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            className="searchButton"
            type="submit"
            variant="contained"
            color="primary"
          >
            {loading ? (
              <CircularProgress size={30} style={{ color: "white" }} />
            ) : (
              "Search News"
            )}
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="loaderWrapper">
          <PushSpinner color="#000" />
        </div>
      ) : (
        <div className="searchResults">
          {data.allNews.length > 0 && (
            <h2>
              Found {data.totalResults} results for keyword {query}
            </h2>
          )}

          {data.allNews.map((news) => (
            <News key={news.objectID} news={news} />
          ))}
        </div>
      )}

      {data.allNews.length > 0 && (
        <div className="navigate">
          <Button
            variant="contained"
            className="prevButton"
            color="secondary"
            disabled={pageNumber === 0}
            onClick={handlePrev}
          >
            Prev
          </Button>
          <span>
            Showing page <b>{pageNumber + 1}</b> of {data.totalPages}
          </span>
          <Button
            variant="contained"
            className="nextButton"
            color="primary"
            disabled={pageNumber === 19}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
