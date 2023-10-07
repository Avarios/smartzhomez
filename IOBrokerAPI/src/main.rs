#[macro_use]
extern crate actix_web;
mod e3dc;
use std::{env, io};
use clap::Parser;
use actix_web::{middleware, App, HttpServer};

#[derive(Parser,Debug)]
#[command(name = "IOBrokerAPI", version = "0.1.0", author = "Pawel Warmuth")]
pub struct CommandLineArgs {
    #[arg(short = 'p', default_value = "9000")]
    port:String
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    let args = CommandLineArgs::parse();
    let addrres = format!("{}{}", "0.0.0.0:", args.port);
    env::set_var("RUST_LOG", "actix_web=debug,actix_server=info");
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            // enable logger - always register actix-web Logger middleware last
            .wrap(middleware::Logger::default())
            // register HTTP requests handlers
            .service(e3dc::get_battery)
    })
    .bind(addrres)?
    .run()
    .await
}


