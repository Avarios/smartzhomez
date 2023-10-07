use actix_web::web::{Json, Path};
use actix_web::HttpResponse;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Number;


#[derive(Debug, Deserialize, Serialize)]
pub struct Battery {
    pub soc:f32
}

/// Get the battery status from e3dc iobroker
#[get("/e3dc/battery")]
pub async fn get_battery() -> HttpResponse {

    let battery_value = Battery { soc: 22.5 };

    HttpResponse::Ok()
        .content_type("application/json")
        .json(battery_value)
}