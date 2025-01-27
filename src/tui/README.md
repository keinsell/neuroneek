# Terminal User Interface (TUI)

Terminal-based user interface (TUI) for managing and visualizing substance ingestions. It features a dashboard with charts, a timeline sidebar, and a statistics bar, along with views for creating, listing, and viewing ingestions. The TUI uses `ratatui` for rendering and provides a structured approach to handling events, state, and focus.

## 1. Overall Structure

The TUI is organized into several modules, each with a specific responsibility:

*   **`src/tui/app.rs` (startLine: 1 endLine: 670):** This is the core of the application, managing the overall state, event handling, and rendering loop. It initializes the TUI, handles user input, and updates the UI based on application logic.
*   **`src/tui/core.rs` (startLine: 1 endLine: 78):** Provides core abstractions for the TUI, including the `Renderable` trait, which defines how UI components are rendered. It also defines `DefaultTerminal` type.
*   **`src/tui/events.rs` (startLine: 1 endLine: 72):** Defines the events and messages used for communication within the application. It includes `AppEvent` (user input, ticks, resize) and `AppMessage` (application actions like navigation, data loading). It also defines `Screen` enum which represents different views in the application.
*   **`src/tui/layout/` (startLine: 1 endLine: 3):** Contains modules for layout components like the header, footer, and help screen.
    *   **`src/tui/layout/header.rs` (startLine: 1 endLine: 121):** Implements the application header, displaying the current screen and providing navigation shortcuts.
    *   **`src/tui/layout/footer.rs` (startLine: 1 endLine: 294):** Implements the application footer, displaying status messages and providing context-sensitive actions.
    *   **`src/tui/layout/help.rs` (startLine: 1 endLine: 319):** Implements the help screen, displaying application information and keybindings.
*   **`src/tui/theme.rs` (startLine: 1 endLine: 78):** Defines the color palette and styles used throughout the TUI, based on the Catppuccin Mocha theme.
*   **`src/tui/views/` (startLine: 1 endLine: 7):** Contains modules for different views within the application.
    *   **`src/tui/views/home.rs` (startLine: 1 endLine: 34):** Implements the main dashboard view, displaying active ingestions and their analysis.
    *   **`src/tui/views/ingestion/` (startLine: 1 endLine: 3):** Contains modules for managing ingestions.
        *   **`src/tui/views/ingestion/create_ingestion.rs` (startLine: 1 endLine: 670):** Implements the form for creating new ingestions.
        *   **`src/tui/views/ingestion/get_ingestion.rs` (startLine: 1 endLine: 105):** Implements the view for displaying details of a single ingestion.
        *   **`src/tui/views/ingestion/list_ingestion.rs` (startLine: 1 endLine: 360):** Implements the view for listing all ingestions.
    *   **`src/tui/views/loading.rs` (startLine: 1 endLine: 111):** Implements the loading screen, displayed while data is being fetched.
    *   **`src/tui/views/welcome.rs` (startLine: 1 endLine: 88):** Implements the welcome screen, displayed when the application starts.
*   **`src/tui/widgets/` (startLine: 1 endLine: 51):** Contains reusable UI components.
    *   **`src/tui/widgets/active_ingestions.rs`:** Implements a panel for displaying active ingestions.
    *   **`src/tui/widgets/dashboard_charts.rs` (startLine: 1 endLine: 280):** Implements the dashboard charts, visualizing intensity and other data.
    *   **`src/tui/widgets/timeline_sidebar.rs` (startLine: 1 endLine: 351):** Implements the timeline sidebar, displaying a chronological view of ingestions.
    *   **`src/tui/widgets/dosage.rs` (startLine: 1 endLine: 11):** Implements helper functions for displaying dosage information.
    *   **`src/tui/widgets/journal_summary.rs` (startLine: 1 endLine: 120):** Implements a summary of journal entries.

## 2. Architecture

The TUI follows a reactive architecture, where the UI is updated in response to events.

*   **Event Handling:** The `src/tui/app.rs` (startLine: 1 endLine: 670) manages the main event loop. It listens for user input (keyboard and mouse events) and dispatches them to the appropriate components. The `EventHandler` trait (src/tui/widgets/mod.rs startLine: 17 endLine: 21) is used by components to handle events and produce messages.
*   **State Management:** The application state is primarily managed within the `src/tui/app.rs` (startLine: 1 endLine: 670) struct. Each view and widget also maintains its own internal state. The `Stateful` trait (src/tui/widgets/mod.rs startLine: 23 endLine: 28) is used by components to update their state based on messages.
*   **Rendering:** The `Renderable` trait (src/tui/core.rs startLine: 10 endLine: 78) defines how UI components are rendered. Each component implements this trait, providing a `render` function that draws the component within a specified area of the terminal. The `ratatui` library is used for rendering.
*   **Data Flow:** Data is fetched and processed in the `src/tui/app.rs` (startLine: 1 endLine: 670) and passed to the views and widgets. For example, active ingestions are fetched and passed to the `Home` view, which then passes them to the `DashboardCharts` and `TimelineSidebar` widgets.
*   **Navigation:** The `AppMessage::NavigateToPage` message (src/tui/events.rs startLine: 38 endLine: 47) is used to switch between different screens. The `Header` component (src/tui/layout/header.rs startLine: 1 endLine: 121) provides keyboard shortcuts for navigation.

## 3. User Experience

The TUI aims to provide a clear and efficient user experience:

*   **Welcome Screen:** The application starts with a welcome screen (src/tui/views/welcome.rs startLine: 1 endLine: 88) that displays the application logo and provides navigation instructions.
*   **Home Dashboard:** The main dashboard (src/tui/views/home.rs startLine: 1 endLine: 34) provides an overview of active ingestions, their intensity, and a timeline of events. It uses charts and a sidebar to present information visually.
*   **Ingestion Management:** The application allows users to create, list, and view ingestions. The `CreateIngestionState` (src/tui/views/ingestion/create_ingestion.rs startLine: 1 endLine: 670) provides a form for creating new ingestions, while the `IngestionListState` (src/tui/views/ingestion/list_ingestion.rs startLine: 1 endLine: 360) displays a list of existing ingestions. The `IngestionViewState` (src/tui/views/ingestion/get_ingestion.rs startLine: 1 endLine: 105) provides a detailed view of a single ingestion.
*   **Navigation:** The user can navigate between different screens using keyboard shortcuts (1, 2, 0, ?). The header (src/tui/layout/header.rs startLine: 1 endLine: 121) displays the current screen and provides navigation hints.
*   **Status Messages:** The footer (src/tui/layout/footer.rs startLine: 1 endLine: 294) displays status messages and context-sensitive actions.
*   **Help Screen:** The help screen (src/tui/layout/help.rs startLine: 1 endLine: 319) provides information about the application and its keybindings.
*   **Loading Screen:** A loading screen (src/tui/views/loading.rs startLine: 1 endLine: 111) is displayed while data is being fetched, providing visual feedback to the user.
*   **Theme:** The TUI uses a consistent color scheme (src/tui/theme.rs startLine: 1 endLine: 78) based on the Catppuccin Mocha theme, providing a visually appealing and consistent experience.

In summary, the TUI is a well-structured application that provides a focused and efficient user experience for managing and visualizing substance ingestions. It uses a reactive architecture, a clear separation of concerns, and a consistent visual theme to achieve its goals.

## 4. Future Improvements

- Management of screens
- Management of data
- Routing of events
- background tasks
- components lifecycle
- keybind managemenet
- theme management 