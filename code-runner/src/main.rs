use axum::{
    response::Redirect,
    routing::{get, post},
    Json,
};
use code_runner::endpoints::execute;
use std::{env, net::SocketAddr};
use tokio::net::TcpListener;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

// NVM: bytte til glommio
// En hoved thread som sender i queue

/// Return JSON version of an OpenAPI schema
#[utoipa::path(
    get,
    path = "/api-docs/openapi.json",
    responses(
        (status = 200, description = "JSON file", body = ())
    )
)]
async fn openapi() -> Json<utoipa::openapi::OpenApi> {
    Json(ApiDoc::openapi())
}

#[derive(OpenApi)]
#[openapi(
    paths(openapi, execute::execute),
    components(schemas(
        execute::Test,
        execute::ExecutionRequest,
        execute::ExecutionResult,
        execute::CodeRunOutput,
        execute::TestDifference
    ))
)]
struct ApiDoc;

// TODO: Error handling, thread per core

#[tokio::main]
async fn main() {
    let port = env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .expect("Invalid PORT environment variable");

    let socket_address = SocketAddr::from(([0, 0, 0, 0], port));

    let listener = TcpListener::bind(socket_address)
        .await
        .expect(&format!("Failed to bind to port {port}"));

    let app = axum::Router::new()
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/execute", post(execute::execute))
        // .route("/api-docs/openapi.json", get(openapi))
        .route("/", get(|| async { Redirect::temporary("/swagger-ui/") }));

    println!("Listening on: http://{}", socket_address);

    axum::serve(listener, app.into_make_service())
        .await
        .unwrap()
}
