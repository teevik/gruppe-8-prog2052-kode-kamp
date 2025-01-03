use crate::runner::run_tests;
use axum::Json;
use serde::{Deserialize, Serialize};
use tokio::task::spawn_blocking;
use utoipa::ToSchema;

#[derive(Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Test {
    pub input: Vec<String>,
    pub output: Vec<String>,
}

#[derive(Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ExecutionRequest {
    pub code: String,
    pub tests: Vec<Test>,
}

#[derive(Debug, Serialize, ToSchema, Clone, PartialEq, Eq)]
pub struct TestDifference {
    pub expected: Vec<String>,
    pub actual: Vec<String>,
}

#[derive(Debug, Serialize, ToSchema, Clone, PartialEq, Eq)]
#[serde(tag = "kind")]
pub enum CodeRunOutput {
    Success,
    Error { message: String },
    FailedTests { differences: TestDifference },
}

#[derive(Serialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ExecutionResult {
    pub passed_tests: usize,
    pub total_tests: usize,
    pub execution_time_us: u128,
    pub results: Vec<CodeRunOutput>,
}

/// Execute the code with the given tests
#[utoipa::path(
    post,
    path = "/execute",
    responses(
        (status = 200, description = "JSON file", body = ExecutionResult)
    )
)]
pub async fn execute(Json(data): Json<ExecutionRequest>) -> Json<ExecutionResult> {
    let result = spawn_blocking(|| run_tests(data))
        .await
        .expect("Failed to run tests");

    Json(result)
}
