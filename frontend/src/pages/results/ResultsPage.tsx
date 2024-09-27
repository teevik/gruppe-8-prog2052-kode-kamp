import { FC } from 'react';
import './ResultsPage.css';

const ResultsPage: FC = () => {
  const results = [
    { name: 'John Doe', time: '2:30', color: 'red' }, //  Format for the result
  ];

  return (
    <div className="resultsPage">
      <header>
        <h1>KodeKamp</h1>
        <p>Compete together, grow together</p>
        <h2>(Gamemode) Speedcoding</h2>
      </header>
      
      {/* Results section, placeholder for real one for now*/}
      <section className="resultsContainer">
        <h3>Results</h3>
        <ul className="resultsList">
          {results.map((result, index) => (
            <li key={index} className="resultsItem">
              <span className="colorBox" style={{ backgroundColor: result.color }}></span>
              <span className="resultsName">{result.name}</span>
              <span className="resultsTime">{result.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <button className="resultsPlayAgain">Play again</button> {/* TODO: add link to the "/"" page (landing) */} 

      {/* Footer section if we decide to add it later, placeholder for real one for now*/}    
      <footer>
        <p>© 2020 Your Company, Inc. All rights reserved.</p>
        <a href="#terms">Terms of Service</a>
      </footer>
    </div>
  );
};

export default ResultsPage;
