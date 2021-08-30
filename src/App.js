import { Button } from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./App.scss";
import News from "./components/News";

function App() {
  const [query, setQuery] = useState("");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .get(`http://hn.algolia.com/api/v1/search?query=${query}`)
      .then((result) => {
        setLoading(false);
        setNewsData(result.data.hits);
        console.log(result.data.hits);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
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

      <div className="searchResults">
        {newsData.map((news) => (
          <News news={news} />
        ))}
      </div>
    </div>
  );
}

export default App;
