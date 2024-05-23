import { useRef, useEffect, useState, useMemo } from "react";
import IcecastMetadataPlayer, {
  IcyMetadata,
  OggMetadata,
} from "icecast-metadata-player";

import styled from "styled-components";
import Background from "./Background/Background";

const streamUrl = "https://ice.nbla.xyz/nxradio";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  h1 {
    margin-bottom: 1rem;
  }
`;

const PlayButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: #000;
  background-color: #ffffffa7;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  padding: 0;
  &::before {
    content: "▶️";
  }

  &.isPlaying {
    &::before {
      content: "⏸";
    }
  }

  &:focus {
    outline: none;
  }

  transition: background-color 0.2s;
  &:hover {
    background-color: #ffffff;
  }
`;

const PlayerWidget = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  padding: 1rem 3rem;
  border-radius: 2rem;
  z-index: 10;
  background-color: rgb(246 142 253 / 25%);
  box-shadow: 0 0 10px 0 rgba(86, 86, 86, 0.2);

  h2 {
    margin: 0;
    white-space: nowrap;
  }
`;

function App() {
  const playerRef = useRef<null | IcecastMetadataPlayer>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = new IcecastMetadataPlayer(streamUrl, {
        onMetadata: (metadata: IcyMetadata & OggMetadata) => {
          setTitle(metadata.StreamTitle || "");
        },
        onLoad: () => {
          console.log("Player loaded");
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (playerRef.current) {
      if (playerRef.current.state === "playing") {
        playerRef.current.stop();
        setIsPlaying(false);
      } else {
        playerRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  const background = useMemo(() => <Background />, []);

  return (
    <Main>
      {background}
      <PlayerWidget>
        <h2>{title || "Click to start playing"}</h2>
        <PlayButton
          onClick={handlePlay}
          className={isPlaying ? "isPlaying" : "isPaused"}
        />
      </PlayerWidget>
    </Main>
  );
}

export default App;
