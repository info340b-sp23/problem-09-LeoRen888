import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";

import AlbumSearchForm from "./AlbumSearchForm";
import AlbumList from "./AlbumList";
import TrackList from "./TrackList";

const ALBUM_QUERY_TEMPLATE =
  "https://itunes.apple.com/search?limit=25&term={searchTerm}&entity=album&attribute=allArtistTerm";

const App = (props) => {
  const [albumData, setAlbumData] = React.useState([]);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isSearching, setIsSearching] = React.useState(false);

  const fetchAlbumList = (searchTerm) => {
    setIsSearching(true);
    setAlertMessage(null);
    const albumUrl = ALBUM_QUERY_TEMPLATE.replace("{searchTerm}", searchTerm);
    fetch(albumUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length === 0) {
          setAlertMessage("No results found.");
        } else {
          setAlbumData(data.results);
        }
        setIsSearching(false);
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setIsSearching(false);
      });
  };

  return (
    <div className="container">
      <header className="mb-3">
        <h1>Play Some Music!</h1>
      </header>
      {alertMessage && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setAlertMessage(null)}
        >
          {alertMessage}
        </Alert>
      )}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {" "}
                {/* Search Page */}
                <AlbumSearchForm
                  searchCallback={fetchAlbumList}
                  isWaiting={isSearching}
                />
                <AlbumList albums={albumData} />
              </>
            }
          />
          <Route
            path="/album/:collectionId"
            element={
              <>
                <div>
                  <Link to="/" className="btn btn-primary mb-3">
                    Back
                  </Link>
                </div>
                <TrackList setAlertMessage={setAlertMessage} />
              </>
            }
          />
        </Routes>
      </main>

      <footer>
        <small>
          Music Search via{" "}
          <a href="https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/">
            iTunes
          </a>
          .
        </small>
      </footer>
    </div>
  );
};

export default App;
