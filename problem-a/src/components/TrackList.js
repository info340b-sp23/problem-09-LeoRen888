import React from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const TRACK_QUERY_TEMPLATE =
  "https://itunes.apple.com/lookup?id={collectionId}&limit=50&entity=song";

const TrackList = ({ setAlertMessage }) => {
  const [trackData, setTrackData] = React.useState([]);
  const [isQuerying, setIsQuerying] = React.useState(false);
  const [previewAudio, setPreviewAudio] = React.useState(null);
  const urlParams = useParams();

  React.useEffect(() => {
    setIsQuerying(true);

    const trackUrl = TRACK_QUERY_TEMPLATE.replace(
      "{collectionId}",
      urlParams.collectionId
    );

    fetch(trackUrl)
      .then((response) => response.json())
      .then((data) => {
        setIsQuerying(false);
        if (data.results.length > 1) {
          data.results.splice(0, 1);
          setTrackData(data.results);
        } else {
          setAlertMessage("No tracks found for album.");
        }
      })
      .catch((error) => {
        setIsQuerying(false);
        setAlertMessage(error.message);
      });
  }, [urlParams.collectionId, setAlertMessage]);

  const togglePlayingPreview = (previewUrl) => {
    if (!previewAudio) {
      const newPreview = new Audio(previewUrl);
      newPreview.addEventListener("ended", () => setPreviewAudio(null));
      setPreviewAudio(newPreview);
      newPreview.play();
    } else {
      previewAudio.pause();
      setPreviewAudio(null);
    }
  };

  trackData.sort((trackA, trackB) => trackA.trackNumber - trackB.trackNumber);
  const trackElemArray = trackData.map((track) => {
    let classList = "track-record";
    if (previewAudio && previewAudio.src === track.previewUrl) {
      classList += " fa-spin"; //spin if previewing
    }

    return (
      <div key={track.trackId}>
        <div
          role="button"
          className={classList}
          onClick={() => togglePlayingPreview(track.previewUrl)}
        >
          <p className="track-name">{track.trackName}</p>
          <p className="track-artist">({track.artistName})</p>
        </div>
        <p className="text-center">Track {track.trackNumber}</p>
      </div>
    );
  });

  return (
    <div>
      {isQuerying && (
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="4x"
          aria-label="Loading..."
          aria-hidden="false"
        />
      )}
      <div className="d-flex flex-wrap">{trackElemArray}</div>
    </div>
  );
};

export default TrackList;
