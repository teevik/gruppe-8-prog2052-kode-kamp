import CountDown, {formatSeconds} from '../../components/CountDown';
import { Participant } from '../../../../shared/types';
import './ResultsPage.css';

interface ResultPageProps {
  scoreboard : Participant[] | undefined;
  gameMode : string;
  initialTimer : number;
  gameIsOver : boolean;
}

export default function ResultsPage({scoreboard, gameMode, initialTimer, gameIsOver} : ResultPageProps) {
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
        {gameIsOver && <CountDown initialCounter={initialTimer} />}
        <ul className="resultsList">
           {scoreboard && scoreboard.map((score, index) => (
            <li key={index} className="resultsItem">
              <span className="colorBox">{index+1}</span>
              <span className="resultsName">{score.socket.userName}{score.socket.emoji}</span>
              <span className='resultsTime'>{formatSeconds(Math.floor(score.stats.usedTime/1000))}</span>
            </li>
          ))}
        </ul>
      </section>

      <button className="resultsPlayAgain" onClick={()=>{
        location.reload()
      }}>Play again</button> {/* TODO: add link to the "/"" page (landing) */} 
    </div>
  );
};