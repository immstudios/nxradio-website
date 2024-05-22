import { useRef, useEffect, useState } from 'react';
import IcecastMetadataPlayer from 'icecast-metadata-player';

import styled from 'styled-components';

const streamUrl = 'https://ice.nbla.xyz/nxradio';

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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  &::before {
    content: '▶️';
  }
`;



function App() {
  const playerRef = useRef(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = new IcecastMetadataPlayer(
        streamUrl,
        {
          onMetadata: (metadata) => {
            setTitle(metadata.StreamTitle)
          },
          onLoad: () => {
            console.log('Player loaded');
          },
          onError: (error) => {
            console.error('Error:', error);
          }
        }
      );
    }
    
    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  return (
    <Main>
      <h1>{title}</h1>
      <PlayButton onClick={handlePlay} />
    </Main>
  );
}

export default App;

