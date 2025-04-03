import React, { Component } from "react";
import SpotifyService from "./services/spotify";
import "./App.css";
import FavoritePlaylist from "./components/FavoritePlaylist";
import spotify, {getTokenFromUrl, setSpotifyToken } from "./services/spotifyAuth";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header"
import SongList from "./components/SongList"
import CreatePlaylistModal from "./components/CreatePlaylistModal";
import Login from "./components/Login";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [],
      query: "Chill",
      favorites: [],
      showFavorites: false,
      savedSongs: {},
      darkMode: false,
      token: null,
      user: null,
      userPlaylists: [], 
      selectedPlaylistTracks: [], 
      isModalOpen: false, 
      newPlaylistName: "", 
      playingSongId: "",
    };
  }

  async componentDidMount() {
    
    this.fetchSongs();
    this.loadFavorites();
    this.loadDarkMode();

    const tokenData = getTokenFromUrl();
    window.location.hash = ""; 

    if (tokenData.access_token) {
      setSpotifyToken(tokenData.access_token);
      this.setState({ token: tokenData.access_token });

      spotify.getMe().then((user) => {
        this.setState({ user });
      });
    } 



  }

  fetchSongs = async () => {
    const songs = await SpotifyService.searchSongs(this.state.query);
    this.setState({ songs });
  };

  handleSearch = async () => {
    this.fetchSongs();
  };

  handleChange = (event) => {
    this.setState({ query: event.target.value });
  };

  saveToFavorites = (song) => {
    let updatedFavorites = [...this.state.favorites];

    if (!updatedFavorites.find((fav) => fav.id === song.id)) {
      updatedFavorites.push(song);
      this.setState({ favorites: updatedFavorites });
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      this.setState((prevState) => ({
        savedSongs: { ...prevState.savedSongs, [song.id]: true },
      }));

      setTimeout(() => {
        this.setState((prevState) => ({
          savedSongs: { ...prevState.savedSongs, [song.id]: false },
        }));
      }, 2000);
    }
  };

  loadFavorites = () => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const validFavorites = savedFavorites.filter(
        (song) => song && song.album && song.album.images && song.album.images.length > 0
      );
      this.setState({ favorites: validFavorites });
    } catch (error) {
      console.error("❌ Lỗi khi load playlist từ Local Storage:", error);
      this.setState({ favorites: [] });
    }
  };

  removeFromFavorites = (songId) => {
    let updatedFavorites = this.state.favorites.filter((song) => song.id !== songId);
    this.setState({ favorites: updatedFavorites });
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  toggleFavorites = () => {
    this.setState({ showFavorites: !this.state.showFavorites });
  };

  toggleDarkMode = () => {
    this.setState(
      (prevState) => ({ darkMode: !prevState.darkMode }),
      () => {
        localStorage.setItem("darkMode", this.state.darkMode);
        document.body.classList.toggle("dark-mode", this.state.darkMode);
      }
    );
  };

  loadDarkMode = () => {
    const darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    this.setState({ darkMode });
    document.body.classList.toggle("dark-mode", darkMode);
  };

  createPlaylist = async () => {
    if (!this.state.token) {
      alert("You need to log in with Spotify first!");
      return;
    }

    const { newPlaylistName } = this.state;
    if (!newPlaylistName.trim()) {
      alert("Playlist name cannot be empty!");
      return;
    }

    try {
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.state.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPlaylistName,
          description: "Playlist tạo từ ứng dụng của tôi",
          public: false,
        }),
      });

      const data = await response.json();
      if (data.id) {
        alert(`🎉 Playlist "${newPlaylistName}" has been successfully created!`);
        this.setState({ createdPlaylistId: data.id, newPlaylistName: "", isModalOpen: false });
      } else {
        alert("Error creating playlist!");
      }
    } catch (error) {
      console.error("❌ Error creating playlist:", error);
      alert("Cannot create playlist!");
    }
  };

  addSongsToPlaylist = async () => {
    if (!this.state.token) {
      alert("You need to log in with spotify first!");
      return;
    }

    if (!this.state.createdPlaylistId) {
      alert("Playlist not found! Please create it again or try reloading the page.");
      return;
    }

    const songUris = this.state.favorites.map((song) => `spotify:track:${song.id}`);
    if (songUris.length === 0) {
      alert("Your favorite playlist is empty!");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${this.state.createdPlaylistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.state.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: songUris,
          }),
        }
      );

      if (response.ok) {
        alert("🎵 The song has been successfully added to the playlist!");
      } else {
        alert("Error adding the song to the playlist!");
      }
    } catch (error) {
      console.error("❌ Error adding song to playlist.:", error);
      alert("Unable to add the song to the playlist!");
    }
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  handlePlaylistNameChange = (event) => {
    this.setState({ newPlaylistName: event.target.value });
  };

  togglePlay = (songId) => {
    this.setState((prevState) => ({
      playingSongId: prevState.playingSongId === songId ? null : songId,
    }));
  };

  

  render() {
    return (

      <div className="container">


        <CreatePlaylistModal
          isOpen={this.state.isModalOpen}
          toggleModal={this.toggleModal}
          newPlaylistName={this.state.newPlaylistName}
          handlePlaylistNameChange={this.handlePlaylistNameChange}
          createPlaylist={this.createPlaylist}
        />


        <h1 className={this.state.darkMode ? "dark-mode" : "light-mode"}>SOUND TREK <i class="fas fa-headphones"></i></h1>

        <Login
          token={this.state.token}
          user={this.state.user}
          handleLogout={() => this.setState({ token: null, user: null })}
          toggleModal={this.toggleModal}
          addSongsToPlaylist={this.addSongsToPlaylist}
        />



        <Header
          query={this.state.query}
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
          toggleFavorites={this.toggleFavorites}
          toggleDarkMode={this.toggleDarkMode}
          darkMode={this.state.darkMode}
          showFavorites={this.state.showFavorites}
        />

        {this.state.showFavorites ? (
          <FavoritePlaylist
            songs={this.state.favorites}
            setSongs={(songs) => this.setState({ favorites: songs })}
            removeFromFavorites={this.removeFromFavorites}
          />
        ) : (
          <SongList
            songs={this.state.songs}  
            playingSongId={this.state.playingSongId}
            togglePlay={this.togglePlay}
            saveToFavorites={this.saveToFavorites}
            savedSongs={this.state.savedSongs}
          />


        )
        }
      </div>
    );
  }
}

export default App;
