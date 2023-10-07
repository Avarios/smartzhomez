use actix_web::web::{Json, Path};
use actix_web::HttpResponse;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Number;


#[derive(Debug, Deserialize, Serialize)]
pub struct Battery {
    pub soc:f32
}

/// list 50 last tweets `/tweets`
#[get("/e3dc/battery")]
pub async fn get_battery() -> HttpResponse {
    // TODO find the last 50 tweets and return them

    let battery_value = Battery { soc: 22.5 };

    HttpResponse::Ok()
        .content_type("application/json")
        .json(battery_value)
}