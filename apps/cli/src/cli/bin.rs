use async_std::task;

use crate::cli::main::cli;

pub fn main() {
    task::block_on(cli());
}
