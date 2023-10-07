use actix_web::web::{Json, Path};
use actix_web::HttpResponse;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::constants::APPLICATION_JSON;
use crate::like::Like;
use crate::response::Response;

pub type Tweets = Response<Tweet>;

#[derive(Debug, Deserialize, Serialize)]
pub struct Battery {
    pub id: String,
    pub created_at: DateTime<Utc>,
    pub message: String,
    pub likes: Vec<Like>,
}

/// list 50 last tweets `/tweets`
#[get("/e3dc/battery")]
pub async fn get_battery() -> HttpResponse {
    // TODO find the last 50 tweets and return them

    let tweets = Tweets { results: vec![] };

    HttpResponse::Ok()
        .content_type(APPLICATION_JSON)
        .json(tweets)
}