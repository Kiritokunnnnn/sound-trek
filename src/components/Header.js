import React, { Component } from "react";
import DarkModeToggle from "./DarkModeToggle";  

class Header extends Component {
    render() {
        return (
            <div className="search-box">
                <input type="text"
                    value={this.props.query}
                    onChange={this.props.handleChange}
                    placeholder="Enter keywords..." />

                <button onClick={this.props.handleSearch}><i class="fas fa-search"></i> Search</button>
                <button className="toggle-btn" onClick={this.props.toggleFavorites}>
                    {this.props.showFavorites ? "🔍 Search" : "❤️ My favorite"}
                </button>
                
                <DarkModeToggle
                    darkMode={this.props.darkMode}
                    toggleDarkMode={this.props.toggleDarkMode}
                />

            </div>

        )
    }
}
export default Header;