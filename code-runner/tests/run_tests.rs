use code_runner::{
    endpoints::execute::{CodeRunOutput, ExecutionRequest, Test, TestDifference},
    runner::run_tests,
};

#[test]
fn test_run_tests() {
    let code = r#"
        const a = parseInt(readline());
        const b = parseInt(readline());
        
        console.log(a + b);
    "#;

    let tests = vec![
        Test {
            input: vec!["1".to_string(), "2".to_string()],
            output: vec!["3".to_string()],
        },
        Test {
            input: vec!["3".to_string(), "4".to_string()],
            output: vec!["7".to_string()],
        },
        Test {
            input: vec!["0".to_string(), "0".to_string()],
            output: vec!["999".to_string()],
        },
    ];

    let result = run_tests(ExecutionRequest {
        code: code.to_string(),
        tests,
    });

    assert_eq!(result.passed_tests, 2);
    assert_eq!(result.total_tests, 3);
    assert_eq!(result.results.len(), 3);
    assert_eq!(result.results[0], CodeRunOutput::Success);
    assert_eq!(result.results[1], CodeRunOutput::Success);
    assert_eq!(
        result.results[2],
        CodeRunOutput::FailedTests {
            differences: TestDifference {
                expected: vec!["999".to_string()],
                actual: vec!["0".to_string()],
            },
        }
    );
}
