use crossterm::event::Event;
use miette::Result;
use ratatui::prelude::*;

use super::core::Renderable;

pub mod dosage;

pub trait EventHandler
{
    /// The type of messages this handler produces
    type Message;

    /// Handle an event, optionally producing a message
    fn handle_event(&mut self, event: Event) -> Result<Option<Self::Message>>;
}

pub trait Stateful
{
    /// The type of messages this widget accepts
    type Message;

    /// Update the widget's state based on a message
    fn update(&mut self, msg: Self::Message) -> Result<()>;
}

pub trait Focusable
{
    /// Returns whether the widget is currently focused
    fn is_focused(&self) -> bool;

    /// Set the focus state of the widget
    fn set_focus(&mut self, focused: bool);
}

pub trait Navigable
{
    /// Move the selection up
    fn select_prev(&mut self) -> Result<()>;

    /// Move the selection down
    fn select_next(&mut self) -> Result<()>;

    /// Get the currently selected index
    fn selected(&self) -> Option<usize>;
}

pub trait Component: Renderable {}
