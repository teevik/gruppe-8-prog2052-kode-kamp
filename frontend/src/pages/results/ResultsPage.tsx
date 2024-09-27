import { Participant } from '../../types';
import './ResultsPage.css';

interface ResultPageProps {
  scoreboard : Participant[] | undefined;
  gameMode : string;
}

export default function ResultsPage({scoreboard, gameMode} : ResultPageProps) {
  return (
    <div className="resultsPage">
      <header>
        <h1>KodeKamp</h1>
        <p>Compete together, grow together</p>
      </header>
      
      {/* Results section, placeholder for real one for now*/}
      <section className="resultsContainer">
        <h3>Results</h3>
        <h2>(Gamemode) {gameMode}</h2>
        <ul className="resultsList">
           {scoreboard && scoreboard.map((score, index) => (
            <li key={index} className="resultsItem">
              <span className="colorBox">{index+1}</span>
              <span className="resultsName">{score.socket.userName}{score.socket.emoji}</span>
              <span className='resultsTime'>{score.stats.usedTime}</span>
            </li>
          ))}
        </ul>
      </section>

      <button className="resultsPlayAgain">Play again</button> {/* TODO: add link to the "/"" page (landing) */} 
    </div>
  );
};