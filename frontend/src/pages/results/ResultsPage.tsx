import {useState} from 'react'
import { atomOneDark, CodeBlock } from 'react-code-blocks';
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

  const [solution, setSolution] = useState<string>("");
  const [showSolution, setDisplaySolution] = useState<boolean>();
  const [solutionNumber, setSolutionNumber] = useState<number>(0);

  return (
    <div className="resultsPage">
      <header>
        <h1>KodeKamp</h1>
        <p>Compete together, grow together</p>
      </header>
      
      {/* Results section, placeholder for real one for now*/}
      <section className="resultsContainer">
        <h2>Results</h2>
        <h3>(Gamemode) {gameMode}</h3>
        {gameIsOver && <CountDown initialCounter={initialTimer} />}
        <ul className="resultsList">
           {scoreboard && scoreboard.map((score, index) => (
            <>
            <li key={index} className={index == 0 ? "resultsItem winnerResultsItem" : "resultsItem"}>
              <div className="resultData">
                <span className="colorBox">{index+1}</span>
                {index == 0 && <span>🏆</span>}
                <span className="resultsName">{score.socket.userName}{score.socket.emoji}</span>
                <span className='resultsTime'>{formatSeconds(Math.floor(score.stats.usedTime/1000))}</span>
                <button className='solutionButton' onClick={()=>{
                  setSolution(score.solution);
                  setSolutionNumber(index);
                  setDisplaySolution(true);
                }}
                >Solution</button>
                
              </div>
              {showSolution && solutionNumber == index && <div className="code">
              <CodeBlock text={solution} theme={atomOneDark} language="javascript" wrapLongLines/> 
              
            </div>}
            </li>

            

            </>
          ))}
        </ul>
      </section>

      <button className="resultsPlayAgain" onClick={()=>{
        location.reload()
      }}>Play again</button> {/* TODO: add link to the "/"" page (landing) */} 
    </div>
  );
};