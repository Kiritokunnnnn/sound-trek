import React, {Component} from "react"

class SongItem extends Component{
    render(){
        const{song, playingSongId= "", togglePlay, saveToFavorites, savedSongs } = this.props;
        
        if (!song || !song.album || !song.album.images || song.album.images.length === 0) {
            return null; 
          }

          return (
            <li key={song.id} className="song-item">
              <img src={song.album.images[0].url} alt={song.name} />
              <p>{song.name} - {song.artists[0].name}</p>

              {playingSongId === song.id && (
                
                  <iframe
                    src={`https://open.spotify.com/embed/track/${song.id}`}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="encrypted-media"
                    style={{ marginTop: "5px", borderRadius: "10px" }}
                  ></iframe>
                
                )}

              <a
                href={`https://open.spotify.com/track/${song.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-link"
              >
                🎵 Open on Spotify
              </a>

              <button className="listen-btn" onClick={() => togglePlay(song.id)}>
                {playingSongId === song.id ? "⏹ Pause" : "🎧 Preview"}
              </button>

              <button
                className={`fav-btn ${savedSongs[song.id] ? "saved" : ""}`}
                onClick={() => saveToFavorites(song)}
              >
                {savedSongs[song.id] ? "✔ Saved" : "❤️ Save to Playlist"}
              </button>
              
              


            </li>
          );
    }
}

export default SongItem;