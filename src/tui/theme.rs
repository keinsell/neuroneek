use ratatui::style::Color;

// Catppuccin Mocha Theme Colors
pub struct Theme;

impl Theme
{
    // Base Colors
    pub const BASE: Color = Color::Rgb(30, 30, 46); // #1E1E2E
    pub const MANTLE: Color = Color::Rgb(24, 24, 37); // #181825
    pub const CRUST: Color = Color::Rgb(17, 17, 27); // #11111B

    // Surface Colors
    pub const SURFACE0: Color = Color::Rgb(49, 50, 68); // #313244
    pub const SURFACE1: Color = Color::Rgb(69, 71, 90); // #45475A
    pub const SURFACE2: Color = Color::Rgb(88, 91, 112); // #585B70

    // Text Colors
    pub const TEXT: Color = Color::Rgb(205, 214, 244); // #CDD6F4
    pub const SUBTEXT0: Color = Color::Rgb(166, 173, 200); // #A6ADC8
    pub const SUBTEXT1: Color = Color::Rgb(186, 194, 222); // #BAC2DE
    pub const OVERLAY0: Color = Color::Rgb(108, 112, 134); // #6C7086
    pub const OVERLAY1: Color = Color::Rgb(127, 132, 156); // #7F849C
    pub const OVERLAY2: Color = Color::Rgb(147, 153, 178); // #939AB7

    // Accent Colors
    pub const BLUE: Color = Color::Rgb(137, 180, 250); // #89B4FA
    pub const LAVENDER: Color = Color::Rgb(180, 190, 254); // #B4BEFE
    pub const SAPPHIRE: Color = Color::Rgb(116, 199, 236); // #74C7EC
    pub const SKY: Color = Color::Rgb(137, 220, 235); // #89DCEB
    pub const TEAL: Color = Color::Rgb(148, 226, 213); // #94E2D5
    pub const GREEN: Color = Color::Rgb(166, 227, 161); // #A6E3A1
    pub const YELLOW: Color = Color::Rgb(249, 226, 175); // #F9E2AF
    pub const PEACH: Color = Color::Rgb(250, 179, 135); // #FAB387
    pub const MAROON: Color = Color::Rgb(235, 160, 172); // #EBA0AC
    pub const RED: Color = Color::Rgb(243, 139, 168); // #F38BA8
    pub const MAUVE: Color = Color::Rgb(203, 166, 247); // #CBA6F7
    pub const PINK: Color = Color::Rgb(245, 194, 231); // #F5C2E7
    pub const FLAMINGO: Color = Color::Rgb(242, 205, 205); // #F2CDCD
    pub const ROSEWATER: Color = Color::Rgb(245, 224, 220); // #F5E0DC

    // UI States
    pub const SELECTED_BG: Color = Self::SURFACE1;
    pub const SELECTED_FG: Color = Self::TEXT;
    pub const HEADER_FG: Color = Self::MAUVE;
    pub const BORDER: Color = Self::SURFACE0;
    pub const SCROLLBAR_THUMB: Color = Self::SURFACE2;
    pub const SCROLLBAR_TRACK: Color = Self::SURFACE0;

    // Status Colors
    pub const SUCCESS: Color = Self::GREEN;
    pub const WARNING: Color = Self::YELLOW;
    pub const ERROR: Color = Self::RED;
    pub const INFO: Color = Self::BLUE;

    // Time-based Colors
    pub const PAST: Color = Self::GREEN;
    pub const FUTURE: Color = Self::BLUE;
    pub const INACTIVE: Color = Self::OVERLAY0;

    pub const ACTIVE: Color = Color::Cyan;
}
