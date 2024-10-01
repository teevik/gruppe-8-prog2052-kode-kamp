import { Box, Button } from "@chakra-ui/react";
import { Editor, Monaco } from "@monaco-editor/react";
import { socket } from "../socket";

interface CodeEditorProps {
  template: string;
  code: string | undefined;
  setCode: (c: string) => void;
  submittedCode: boolean;
  setSubmittedCode: (b: boolean) => void;
}
/**
 * CodeEditor is a React component for a code editor
 * with a Monaco Editor and action buttons (Save, Reset)
 * for handling code changes and saving the content.
 * @returns {JSX.Element}
 */
export default function CodeEditor({
  code,
  setCode,
  template,
  submittedCode,
  setSubmittedCode,
}: CodeEditorProps) {
  /**
   * Handles code changes from the Monaco Editor
   * and updates the state with the new code
   * @param {string | undefined} newCode - the new code
   */
  const handleChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
    }
  };

  function submitCode(code: string) {
    socket.emit("submitCode", code);
  }

  function runCode(code: string) {
    socket.emit("runCode", code);
  }

  // ran when the editor is about to be mounted
  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages?.typescript?.javascriptDefaults.addExtraLib(
      "declare function readline(): string;",
      "kodekamp.d.ts"
    );
  }

  return (
    <Box>
      {/* Action buttons like Reset, mby have test cases here?*/}
      <Button colorScheme="gray" onClick={() => setCode(template)}>
        Reset
      </Button>
      <Button
        disabled={submittedCode}
        onClick={() => {
          if (code) {
            setSubmittedCode(true);
            runCode(code);
          }
        }}
      >
        Run
      </Button>
      <Button
        className="submitButton"
        disabled={submittedCode}
        onClick={() => {
          if (code) {
            setSubmittedCode(true);
            submitCode(code);
          }
        }}
      >
        Submit
      </Button>

      {/* Monaco Editor */}
      <Box border="1px solid #e2e8f0">
        <Editor
          height="80vh"
          theme="vs-dark"
          language="javascript"
          value={code}
          onChange={handleChange}
          beforeMount={handleEditorWillMount}
          options={{
            // smaller font size
            fontSize: 14,
            // disable minimap
            minimap: { enabled: false },
            // enables automatic layout
            automaticLayout: true,
          }}
        />
      </Box>
    </Box>
  );
}
