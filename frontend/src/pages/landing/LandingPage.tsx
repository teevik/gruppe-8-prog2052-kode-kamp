import { FC } from "react";
import "./LandingPage.css"; // Ensure this path is correct

const LandingPage: FC = () => {
  const players = 3; // Number of current players in the lobby
  const maxPlayers = 8; // Max players in the lobby
  const timeLeft = 42; // Time left for the game to start


  const emojiList = ["🧑", "🐸", "🐱", "🐶", "🦄", "🐼", "🐧", "🦁", "🐝", "🐢"];

    // Function to randomly pick an emoji
    const getRandomEmoji = () => {
      return emojiList[Math.floor(Math.random() * emojiList.length)];
    };


  return (
    <div className="landingPage">
      <header>
        <h1>KodeKamp Lobby</h1>
        <p>Compete together, grow together</p>
      </header>
      {/* Lobby section, placeholder for real one for now, fix some way of adding the game mode and mby showing some other info, like difficulty, if there is time */}
      <div className="lobbyContainer">
        <div className="lobbyHeader">
          <h3>🧑‍🤝‍🧑 Public lobby</h3>
          <p>Join the upcoming challenge and compete with others</p>
        </div>
        {/* Players section, placeholder for real one for now, here we see how many players are in the lobby, could just be a number out of 4 or 8 based on lobby size for now */}
        <div className="playerGrid">
          {Array.from({ length: maxPlayers }, (_, index) => (
            <div key={index} className="playerSlot">
              {index < players ? (
                <span role="img" aria-label="Player icon">{getRandomEmoji()}</span>
              ) : (
                <div className="emptySlot" />
              )}
            </div>
          ))}
        </div>
        
        <p>{players}/{maxPlayers} players</p>
        <p>Starting in {timeLeft}s</p>

        {/* Join button, fix this so that this sends you to the correct game based on gameID */}
        <button className="joinButton">Join</button>

      </div>

      <footer>
        <p>© 2020 Your Company, Inc. All rights reserved.</p>
        <a href="#terms">Terms of Service</a>
      </footer>
    </div>
  );
};

export default LandingPage;
