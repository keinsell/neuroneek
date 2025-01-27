use crossterm::event::KeyEvent;
use crossterm::event::MouseEvent;
use derive_more::From;
use std::fmt;
use strum::Display as StdDisplay;

#[derive(Debug, Clone, From)]
pub enum AppEvent
{
    Key(KeyEvent),
    Mouse(MouseEvent),
    Tick,
    Resize
    {
        width: u16,
        height: u16,
    },
}

impl fmt::Display for AppEvent
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result
    {
        match self
        {
            | AppEvent::Key(k) => write!(f, "Key: {:?}", k),
            | AppEvent::Mouse(m) => write!(f, "Mouse: {:?}", m),
            | AppEvent::Tick => write!(f, "Tick"),
            | AppEvent::Resize { width, height } => write!(f, "Resize: {}x{}", width, height),
        }
    }
}

#[derive(Debug, Clone, StdDisplay)]
pub enum AppMessage
{
    Quit,
    NavigateToPage(Screen),
    SelectNext,
    SelectPrevious,
    LoadData,
    Refresh,
    ListIngestions,
    CreateIngestion,
}

#[derive(Debug, Clone, Copy, StdDisplay, PartialEq, Eq, Default)]
pub enum Screen
{
    #[default]
    Welcome,
    Home,
    ListIngestions,
    Loading,
    CreateIngestion,
    ViewIngestion,
    Settings,
    Help,
}

#[derive(Debug, Clone)]
pub struct EventHandler
{
    pub events: Vec<AppEvent>,
}

impl EventHandler
{
    pub fn new() -> Self { Self { events: Vec::new() } }

    pub fn push(&mut self, event: AppEvent) { self.events.push(event); }

    pub fn clear(&mut self) { self.events.clear(); }
}