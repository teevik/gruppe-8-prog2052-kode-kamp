use crate::endpoints::execute::{ExecutionRequest, ExecutionResult};
use deno_core::{anyhow::Context, error::AnyError, extension, op2, v8};
use std::{cell::RefCell, collections::VecDeque, time::Duration};

// Thread local variables for accessing input and output from deno_core ops
thread_local! {
  static INPUT: RefCell<VecDeque<String>> = RefCell::new(VecDeque::new());
  static OUTPUT: RefCell<Vec<String>> = RefCell::new(Vec::new());
}

#[op2]
fn readline<'a>(scope: &'a mut v8::HandleScope) -> Result<v8::Local<'a, v8::Value>, AnyError> {
    let next_line = INPUT.with_borrow_mut(|input| input.pop_front());

    let value = match next_line {
        Some(next_line) => v8::String::new(scope, &next_line)
            .context("failed to create string")?
            .cast(),
        None => v8::null(scope).cast(),
    };

    Ok(value)
}

#[op2(fast)]
fn print(#[string] data: String) {
    OUTPUT.with_borrow_mut(|output| output.push(data));
}

extension! {
  CodeRunner,
  ops = [
      readline,
      print
  ]
}

const MAX_HEAP_SIZE: usize = 1024 * 1024 * 512; // 512 MB

static RUNTIME_SNAPSHOT: &[u8] =
    include_bytes!(concat!(env!("OUT_DIR"), "/CODE_RUNNER_SNAPSHOT.bin"));

pub struct CodeRunResult {
    output: Vec<String>,
    execution_time: Duration,
}

pub fn run_code(code: String, input: Vec<String>) -> CodeRunResult {
    let create_params = v8::CreateParams::default().heap_limits(0, MAX_HEAP_SIZE);

    // TODO max run time?

    let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
        extensions: vec![CodeRunner::init_ops()],
        startup_snapshot: Some(RUNTIME_SNAPSHOT),
        create_params: Some(create_params),
        ..Default::default()
    });

    // TODO all code is blocking, using thread locals should be fine?
    INPUT.with_borrow_mut(|input_local| {
        *input_local = input.into();
    });

    OUTPUT.with_borrow_mut(|output| {
        output.clear();
    });

    println!("Input: {:?}", INPUT.with_borrow(|input| input.clone()));
    println!("Running code...");

    let start_time = std::time::Instant::now();
    let _err = js_runtime.execute_script("[code-runner:main.js]", code);

    let end_time = std::time::Instant::now();
    let execution_time = end_time - start_time;

    let output = OUTPUT.with_borrow(|output| output.clone());
    println!("Output: {:?}", output);
    println!("Execution time: {:?}", execution_time);

    CodeRunResult {
        execution_time,
        output,
    }
}

pub fn run_tests(request: ExecutionRequest) -> ExecutionResult {
    let mut execution_time = Duration::ZERO;

    let total_tests = request.tests.len();
    let mut passed_tests = 0;

    for test in request.tests {
        let code = request.code.clone();
        let input = test.input.clone();

        let result = run_code(code, input);

        if result.output == test.output {
            passed_tests += 1;
        }
        execution_time += result.execution_time;
    }

    let execution_time_us = execution_time.as_micros();

    ExecutionResult {
        passed_tests,
        total_tests,
        execution_time_us,
    }
}
