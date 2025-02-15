use ratatui::prelude::*;
use std::error::Error;

pub struct App
{
    pub running: bool,
    pub selected_tab: usize,
}

impl Default for App
{
    fn default() -> Self
    {
        Self {
            running: true,
            selected_tab: 0,
        }
    }
}

impl App
{
    pub fn new() -> Self { Self::default() }

    pub fn tick(&mut self) {}

    pub fn quit(&mut self) { self.running = false; }

    pub fn on_key(&mut self, key: char)
    {
        match key
        {
            | 'q' => self.quit(),
            | '1'..='4' =>
            {
                if let Some(digit) = key.to_digit(10)
                {
                    self.selected_tab = (digit as usize) - 1;
                }
            }
            | _ =>
            {}
        }
    }
}
