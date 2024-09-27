import {useState, useEffect} from 'react'
import CodeEditor from '../../components/CodeEditor';
import './GamePage.css'; // Import the CSS file
import {Challenge} from '../landing/types'
import {socket} from '../../socket'


interface GameProps {
  challenge : Challenge | undefined;
  gameMode : string;
}

/**
 * SpeedCodingPage is a React component for the Speed Coding page
 * which consists of a header, main content section, and footer.
 * The main content section contains a task description and a code editor.
 * The footer contains buttons for running test cases and submitting code.
 */
export default function SpeedCodingPage({challenge, gameMode} : GameProps) {

  const [code, setCode] = useState<string | undefined>(challenge?.template);

  
  function submitCode(code : string){
    socket.emit("submitCode", code)
  }

  function updateScoreboard(scores : string[]){
    console.log("Scoreboard is updated", scores)
  }

  function success(result : string){
      console.log("Success! Results: ", result)
  }

  function fail(result : string){
      console.log("Fail... Results: ", result)
  }

  useEffect(()=>{
    socket.on("updateScoreboard", updateScoreboard)
    // Event to emit when code is to be submitted
    // socket.emit("submitCode", code);
    socket.on("success", success)
    socket.on("fail", fail)

    return ()=>{
      socket.off("updateScoreboard", updateScoreboard)
      socket.off("success", success)
      socket.off("fail", fail)
    }
  }, [])

  //const [code, setCode] = useState<string>("");

  return (
    
    <div className="gamePageContainer">
      {challenge && <>
        {/* Header Section */}
        <div className="gamePageHeader">
          <div className="gamePageHeaderTitle">KodeKamp</div>
          <div className="gamePageHeaderMode">game mode: {gameMode}</div>
          <p>Task title: {challenge.title}</p>
        </div>

        {/* Main Content Section */}
        <div className="gamePageMain">
          {/* Left Section: Task Description */}
          <div className="gamePageTaskDescription">
            <div className="gamePageTaskTitle">{challenge.title}</div>
            
            <div dangerouslySetInnerHTML={{__html: challenge.description}}></div>
            <h2>Input:</h2>
            <div dangerouslySetInnerHTML={{__html: challenge.input}}></div>
            <h2>Output:</h2>
            <div dangerouslySetInnerHTML={{__html: challenge.output}}></div>
            
            <h2>Examples:</h2>
            <section>{challenge.sample_tests.map((test, index)=>(<>
            <div key={index}>
            
              <section className='examples'>
                  <div>
                    <p>Samle input {index+1}:</p>
                    <div className='io'>
                      {test.input.map(input=>(
                          <p >{input}</p>
                        ))}
                    </div>
                  </div>
                    
                <div>
                  <p>Sample output {index+1}:</p>
                  <div className='io'>
                    {test.output.map(output=>(
                        <p >{output}</p>
                      ))}
                  </div>
                </div>

              </section>

            </div>
              
            </>))}</section>
          </div>

          {/* Right Section: Code Editor */}
          <div className="gamePageEditor">
            <CodeEditor code={code} setCode={setCode} template={challenge.template} />
          </div>
        </div>

        {/* Footer Section */}
        <div className="gamePageFooter">
          <button className="primaryButton" onClick={() => console.log("Running test cases...")}>
            Kjør test cases
          </button>
          <button className="secondaryButton" onClick={() => {
            if(code) {
              submitCode(code);
            }
          }}>
            Send inn
          </button>
        </div>
      </>}
    </div>
  );
};
