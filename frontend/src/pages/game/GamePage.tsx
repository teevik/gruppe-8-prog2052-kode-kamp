import { FC } from "react";
import CodeEditor from '../../components/CodeEditor';
import './GamePage.css'; // Import the CSS file

/**
 * SpeedCodingPage is a React component for the Speed Coding page
 * which consists of a header, main content section, and footer.
 * The main content section contains a task description and a code editor.
 * The footer contains buttons for running test cases and submitting code.
 */
const SpeedCodingPage: FC = () => {
  return (
    <div className="gamePageContainer">
      {/* Header Section */}
      <div className="gamePageHeader">
        <div className="gamePageHeaderTitle">KodeKamp</div>
        <div className="gamePageHeaderMode">(Gamemode) Speedcoding</div>
      </div>

      {/* Main Content Section */}
      <div className="gamePageMain">
        {/* Left Section: Task Description */}
        <div className="gamePageTaskDescription">
          <div className="gamePageTaskTitle">Oppgavetekst</div>
          <p>
            // Her kan du beskrive oppgaven eller problemstillingen.
            // Brukerne vil se denne beskrivelsen og forventes skrive kode i editoren.
          </p>
        </div>

        {/* Right Section: Code Editor */}
        <div className="gamePageEditor">
          <CodeEditor />
        </div>
      </div>

      {/* Footer Section */}
      <div className="gamePageFooter">
        <button className="primaryButton" onClick={() => console.log("Running test cases...")}>
          Kj r test cases
        </button>
        <button className="secondaryButton" onClick={() => console.log("Submitting code...")}>
          Send inn
        </button>
      </div>
    </div>
  );
};

export default SpeedCodingPage;
