use async_std::task;

use crate::cli::main::cli;

fn main() {
    task::block_on(cli());
}
