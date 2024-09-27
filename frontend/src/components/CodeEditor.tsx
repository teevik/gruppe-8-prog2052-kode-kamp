import { Box, Button } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";


interface CodeEditorProps {
    template : string;
    code : string | undefined;
    setCode : (c : string)=>void;
}
/**
 * CodeEditor is a React component for a code editor
 * with a Monaco Editor and action buttons (Save, Reset)
 * for handling code changes and saving the content.
 * @returns {JSX.Element}
 */
export default function CodeEditor({code, setCode, template} : CodeEditorProps) {
    

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

    return (
        <Box>
            {/* Action buttons like Reset, mby have test cases here?*/}
            <Button colorScheme="gray" onClick={() => setCode(template)}>
                Reset
            </Button>
            
            {/* Monaco Editor */}
            <Box border="1px solid #e2e8f0">
                <Editor
                    height="80vh"
                    theme="vs-dark"
                    language="javascript"
                    value={code}
                    onChange={handleChange}
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
};