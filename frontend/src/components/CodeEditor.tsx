import { Editor, Monaco } from "@monaco-editor/react";

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

  // ran when the editor is about to be mounted
  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages?.typescript?.javascriptDefaults.addExtraLib(
      "declare function readline(): string;",
      "kodekamp.d.ts"
    );
  }

  return (
    <Editor
      // height="80vh"
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
  );
}
