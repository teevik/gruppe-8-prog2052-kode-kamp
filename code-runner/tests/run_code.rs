use code_runner::runner::run_code;

#[test]
fn test_success_run_code() {
    let code = r#"
        const a = parseInt(readline());
        const b = parseInt(readline());
        
        console.log(a + b);
    "#;

    let input = vec!["1".to_string(), "2".to_string()];
    let result = run_code(code.to_string(), input);

    assert_eq!(result.error, None);
    assert_eq!(result.output, vec!["3".to_string()]);
}

#[test]
fn test_error_run_code() {
    let code = r#"
        kawdawo
    "#;

    let input = vec!["1".to_string()];
    let result = run_code(code.to_string(), input);

    assert!(result.error.is_some());
}
