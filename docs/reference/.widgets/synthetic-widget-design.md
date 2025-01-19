You are advanced terminal user interface designer, your objective is to understand requirements provided by user and respond only in multiple concepts of terminal user interface widget/components that can be applied into interface of end product to deliver maximum value of product features to end-user. Your design should be made in ASCII. Be ultimately creative about your designs and make sure you do not list all the same designs, explore different ways of designing thing and let the user choice ones that he is like. You should never use emoji for designing your components and you should follow all the best, opiniated, research-backed UX design methods along with CLI/TUI designing guidelines. Try to extend specification made by user by doing your own research on topics around user specification and experiment with your own ideas about user's product.

---

You are a terminal user interface (TUI) design specialist, tasked with creating ASCII-based widget concepts and complete layouts for a CLI application. Your goal is to interpret user requirements and deliver innovative, research-backed TUI designs that maximize usability and value. Focus on the following:

1. **Component Design**: Generate individual ASCII widgets that are modular, reusable, and adhere to TUI best practices. Each widget should be self-contained and functional within a larger interface.

2. **Complete Layouts**: Design full-screen or multi-panel ASCII layouts that integrate multiple widgets cohesively. Ensure layouts are intuitive, visually balanced, and optimized for terminal environments.

3. **Creativity and Variety**: Explore diverse design approaches for each concept. Avoid repetitive designs and experiment with unique visual representations, interaction patterns, and information hierarchies.

4. **UX Principles**: Apply research-backed UX methodologies, including clarity, consistency, and accessibility. Prioritize readability, logical flow, and user efficiency in all designs.

5. **Specification Extension**: Extend the user’s requirements by incorporating relevant research and innovative ideas. Propose enhancements or additional features that align with the product’s goals.

6. **ASCII Constraints**: Use only ASCII characters for all designs. Avoid emojis, Unicode symbols, or any non-ASCII elements. Ensure designs are compatible with standard terminal environments.

7. **Attention to Detail**: Focus on fine-grained details such as alignment, spacing, and visual hierarchy. Ensure designs are polished and professional, suitable for production use.

Deliver designs that are both functional and visually appealing, enabling the user to select the most effective concepts for their application. Your domain of research for applications is neuroscience, pharmacology, psychology, psychonautics, biohacking, research, and other related fields.

--- # User Requirements

- User should be able to read a prettified report of the user's ingestion, it should contain all information from the ingestion analyzer.
- Application has`Ingestion` a model which contains information about `substance_name`, `dosage` (which is float value from base unit which is kilogram), `route_of_administration` (representing the route by which `substance_name` was administrated) and `ingested_at` which is UTC DateTime when ingestion was ingested. 
- Application feature `IngestionAnalyzer` which ingests (so far) information about `Ingestion` and `Substance` to extract and match patterns from a database  which may be applicable to given ingestion, such analysis provide: approximate ingestion start date (which is date when substance was ingested), ingestion end date (which is estimated date when subjective effects of substance should not be potentially present or just aftereffects will be present), dosage classification (from threshold, light, common, strong, heavy), information about phases (from classification Onset, Come-up, Peak, Comedown, Afterglow) where for every phase we know range how much one phase may take and by name of classification we know when substance presence is the strongest and when the weakest.

## Functional Requirements

### Ingestion Overview

- Show the name of the ingested substance
- Show dosage ingested (in the suggested unit, ex. mg instead of kg)
- Show the administration route which was used to ingest substance
- Show time when ingestion has happened and expected time when it will be ending (we assume complete ending of ingestion as afterglow is ended)

### Progression Tracking

- Show overall progress of ingestion as percentage
- Show time elapsed to end of up effects and separate extension of progression by tracking afterglow which often is associated with negative side-effects.
- Phase-specific progress

### Timeline Visualisation (PhaseViz)

- Display chronological progression of phases
- Show the current position in the timeline
- Indicate time-ranges when stages are transitioning
- Show real-time progress within the current phase
- Display expected duration of each phase

### Peak Experience Control (PEC)

- Current phase status with clear visual indication
- Expected duration of the current phase
- Time remaining in the current phase
- Phase intensity level
- Phase-specific characteristics

## Non-Functional Requirements

- Keyboard navigation for all components
- Focus states for interactive elements
- Responsive design for different terminal sizes
- All numerical values must include units
- Time displays must include timezone context
- Progress indicators must be visually distinct
- No emojis
- Phase transitions must be clearly marked
- Intensity levels must use consistent color coding
- Dosage strength additionally visually represented


--- # Design Examples (DO NOT USE)

We're designing a page of interactive terminal which is representing single ingestion,
there is example of actual CLI application that is currently implemented yet that's not 
enough as data representation is not good enough.


   ███▄    █ ▓█████  █    ██  ██▀███   ▒█████   ███▄    █ ▓█████  ██ ▄█
   ██ ▀█   █ ▓█   ▀  ██  ▓██▒▓██ ▒ ██▒▒██▒  ██▒ ██ ▀█   █ ▓█   ▀  ██▄█▒
  ▓██  ▀█ ██▒▒███   ▓██  ▒██░▓██ ░▄█ ▒▒██░  ██▒▓██  ▀█ ██▒▒███   ▓███▄░
  ▓██▒  ▐▌██▒▒▓█  ▄ ▓▓█  ░██░▒██▀▀█▄  ▒██   ██░▓██▒  ▐▌██▒▒▓█  ▄ ▓██ █▄
  ▒██░   ▓██░░▒████▒▒▒█████▓ ░██▓ ▒██▒░ ████▓▒░▒██░   ▓██░░▒████▒▒██▒ █
  ░ ▒░   ▒ ▒ ░░ ▒░ ░░▒▓▒ ▒ ▒ ░ ▒▓ ░▒▓░░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ░░ ▒░ ░▒ ▒▒ ▓
                                                          v0.0.1-alpha.2
╭Ingestion Details──────────────────────────────────────────────────────╮
│                                                                       │
│                                                                       │
│                                                                       │   
│                                                                       │   
│                                                                       │ 
││█████████████████████████████████████████                             |
│╰──────────────────────────────────────────────────────────────────────│
│╭─────────────────────────────────────────────────────────────────────╮│
││Phase             Duration         Start             End             ││
││Onset             05:00            17:21             17:26           ││
││Comeup            10:00            17:26             17:36           ││
││Peak              45:00            17:36             18:21           ││
│╰─────────────────────────────────────────────────────────────────────╯│
╰───────────────────────────────────────────────────────────────────────╯
 h Back │Esc Close │? Help                              Ingestion Details


   ███▄    █ ▓█████  █    ██  ██▀███   ▒█████   ███▄    █ ▓█████  ██ ▄█
   ██ ▀█   █ ▓█   ▀  ██  ▓██▒▓██ ▒ ██▒▒██▒  ██▒ ██ ▀█   █ ▓█   ▀  ██▄█▒
  ▓██  ▀█ ██▒▒███   ▓██  ▒██░▓██ ░▄█ ▒▒██░  ██▒▓██  ▀█ ██▒▒███   ▓███▄░
  ▓██▒  ▐▌██▒▒▓█  ▄ ▓▓█  ░██░▒██▀▀█▄  ▒██   ██░▓██▒  ▐▌██▒▒▓█  ▄ ▓██ █▄
  ▒██░   ▓██░░▒████▒▒▒█████▓ ░██▓ ▒██▒░ ████▓▒░▒██░   ▓██░░▒████▒▒██▒ █
  ░ ▒░   ▒ ▒ ░░ ▒░ ░░▒▓▒ ▒ ▒ ░ ▒▓ ░▒▓░░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ░░ ▒░ ░▒ ▒▒ ▓
                                                          v0.0.1-alpha.2
╭Ingestion Details──────────────────────────────────────────────────────╮
│ Caffeine   ● Active                              2023-10-27 17:21 UTC │
│───────────────────────────────────────────────────────────────────────│ 
│█████████████████████████████████████████░67%░░░░░░░░░░░░░░░░░░░░░░░░░░│   
│───────────────────────────────────────────────────────────────────────│   
│                                                                       │ 
│                                                                       |
│╰──────────────────────────────────────────────────────────────────────│
┌─[Timeline]──────────────────────────────────────────────────────────────────┐
│ [Onset]----[Comeup]----[Peak]==========|--------[Afterglow]                 │
│ 17:21     17:26     17:36         18:21          19:21                      │
│                                 ▲                                           │
│                                 │ Now: 18:36                                │
└─────────────────────────────────────────────────────────────────────────────┘
╰───────────────────────────────────────────────────────────────────────╯
 h Back │Esc Close │? Help                              Ingestion Details


┌────────────────────────────────────────────┐
│ Ingestion Details: Caffeine (200 mg oral)  │
├────────────────────────────────────────────┤
│ Started: 17:21 UTC                         │
│ Estimated End: 20:21 UTC                   │
│ Current Phase: Afterglow (Low Intensity)   │
├────────────────────────────────────────────┤
│ Progress: ██████████████░░░░░░░░░ (60%)    │
└────────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Caffeine (200 mg oral)                   │
│ Started: 17:21 UTC,  End: ~20:21 UTC     │
│ Phase: Afterglow (Low Intensity)         │
├──────────────────────────────────────────┤
│ Progress: ██████████░░░░░░░░ (60%)       |
└──────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ Ingestion: Caffeine (10mg, oral)  ● Active            2023-10-27 17:21 UTC   │
└──────────────────────────────────────────────────────────────────────────────┘

(.)--O-->(.)--C--> (*)--P--> (.)--CD--> (.)--A--> O
  Now           Expected Peak

|----+----+----+----+----+----+----+----+----+----|  Timeline
O    C         P              CD         A         E  (Phase Initials)
^ Current Position

┌─[Timeline]──────────────────────────────────────────────────────────────────┐
│ [Onset]----[Comeup]----[Peak]==========|--------[Afterglow]                 │
│ 17:21     17:26     17:36         18:21          19:21                      │
│                                 ▲                                           │
│                                 │ Now: 18:36                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────┬───────┬─────────┬────────┐
│ Phase         │ Prog │ Dur     │ Int    │
├───────────────┼───────┼─────────┼────────┤
│ Onset         │██████ │ 5min    │(Green) │
│ Come-up       │██████████████████│10min   │(Yellow)│
│ Peak          │████████████████████████████████████████████████│45min   │(Red)   │
│ Comedown      │██████████████████░░░░░░░░░░░░░░░░░░░░░░│39min   │(Orange)│
│ Afterglow     │████████████████████████████░░░░░░░░░░░░░░│81min   │(Blue)  │
└───────────────┴───────┴─────────┴────────┘
Total Progress: 60%

┌─[Ingestion Progress]───────────────────────────┐ ┌─[Phase Details]───────────┐
│ Overall: [========================-----] 75%   │ │ Current: Peak             │
│ ├─> Up Effects: [===================▨----] 83% │ │ Intensity: █████░░░░░     │
│ └─> Afterglow:  [▨------------------------] 0% │ │ Duration: 45m (15m left)  │
└────────────────────────────────────────────────┘ └───────────────────────────┘

│ ─────── Phase Timeline ───────                                                                │
│                                                                                               │
│  Onset     Come-up      Peak       Comedown     Afterglow                                        │
│  [========>--] [========>--] [========] [========] [========]                                     │
│   ████████████████████████████████████│
│   14:30     15:00      16:30      19:30      21:00      22:00      

Intensity: [████░░░░░]  (Strong)

Dosage Strength: █ █ █ █ ░ (Common)

Intensity: [████░░░░░]  (Strong)

      
[O]--[C]----[P]----[CD]----[A]
   ▲
   Current Time

Progress: [██████████░░░░░░░░░] 40%

Overall Progress: [========----] 60%

[||||||||......]  60% Complete

Up:   ████████░░░░ 80%
Down: ▒▒▒▒        10%

Onset --> Come-up --> Peak ----> Comedown --> Afterglow
  ^ Current

[Onset: 5m] [Come-up: 10m] [Peak: 45m]--------[Comedown: 39m]-----[Afterglow: 1h 21m]
       ▲ Now

|Onset|Come-up|====Peak====|Comedown|----Afterglow----|
     ^

Dosage Strength: [●○○○○] Threshold
Dosage: ░░░░░●░░░░░ Light
Strength: [=--] Common


Ingestion: Caffeine (Oral) - 200 mg - Started: 17:21 UTC

[+] Current Phase: PEAK ──────────────────────────────────────────────
    Intensity: █████▒░░░░ (Medium)
    Duration: 45 minutes
    Remaining: ~12 minutes

[-] Timeline ───────────────────────────────────────────────────────────
    Onset:    [=====] (17:21 - 17:26)
    Come-up:  [========] (17:26 - 17:36)
    Peak:     [==============] (17:36 - 18:21)  <-- Currently Here
    Comedown: [=========] (18:21 - 19:00)
    Afterglow: [=========] (19:00 - 20:21)

[+] Overall Progress: 85% ─────────────────────────────────────────────

Ends Approx: 20:21 UTC



Ingestion: Caffeine (Oral) - 200 mg - Started: 17:21 UTC

Intensity
  ^
  | High
  |     .
  |    / \__
  |   /     \_______
  |  /               \__
  | /                   \
  +-------------------------> Time
   Onset Come-up  Peak  Comedown Afterglow

  Current Phase: Peak
  Intensity: █████▒░░░░ (Medium)
  Overall Progress: [==============] 85%
  Estimated End: 20:21 UTC


Phase Durations (Probabilistic):

Onset     : [==--]  (Most likely: Short)
Come-up   : [--====-] (Most likely: Medium)
Peak      : [-----======------] (Most likely: Around Average)
Comedown  : [---=========------] (Most likely: Slightly Longer)
Afterglow : [-------===========---------] (Wide Range, Centered Around Average)


Factor               Influence on End Time Variability
------------------------------------------------------
Metabolism Rate      |========--------------|
Dosage Absorption    |----==================|
Individual Sensitivity|-------========-------|


Estimated End Time Distribution:

20:00-20:05 | ##
20:05-20:10 | ####
20:10-20:15 | #######
20:15-20:20 | ##########
20:20-20:25 | #######
20:25-20:30 | ####
20:30-20:35 | ##

┌─[Metabolic Rate]──────────────────────────────┐
│ Current: █████▒░░░░ (Medium)                  │
│ Trend: ↗ (Increasing)                         │
│ Last 24h: █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ │
└───────────────────────────────────────────────┘

┌─[Circadian Rhythm]────────────────────────────┐
│ Wake: ███████████████████████████████████████ │
│ Sleep: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Optimal Dosage Window: [=====]                │
└───────────────────────────────────────────────┘

┌─[Dosage History]──────────────────────────────┐
│ █ █ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ │
│ 2023-10-27 17:21 UTC - 200 mg                 │
│ 2023-10-28 09:15 UTC - 100 mg                 │
│ 2023-10-29 14:30 UTC - 150 mg                 │
└───────────────────────────────────────────────┘

┌─[Substance Stack]─────────────────────────────┐
│ Caffeine: █████░░░░░░ (50%)                   │
│ L-Theanine: ██████████ (100%)                 │
│ Modafinil: █░░░░░░░░░ (10%)                   │
└───────────────────────────────────────────────┘

┌─[Dosage Optimization]─────────────────────────┐
│ Current: █████▒░░░░ (Medium)                  │
│ Optimal: ██████████ (High)                    │
│ Tolerance: ██████████████████████████████████ │
└───────────────────────────────────────────────┘

┌─[Dosage History]──────────────────────────────┐
│ █ █ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ │
│ 2023-10-27 17:21 UTC - 200 mg                 │
│ 2023-10-28 09:15 UTC - 100 mg                 │
│ 2023-10-29 14:30 UTC - 150 mg                 │
└───────────────────────────────────────────────┘


┌───────────────────────────────────────────────────────────────┐
│ Substance: Caffeine (200 mg oral)                             │
│ Ingestion Time: 17:21 UTC                                     │
│ Estimated End: 20:21 UTC                                      │
│ Current Phase: Afterglow (Low Intensity)                      │
│ Progress: ██████████████░░░░░░░░░ (60%)                       │
│───────────────────────────────────────────────────────────────┤
│                                                               │
│ [Onset]----[Comeup]----[Peak]==========|--------[Afterglow]   │
│ 17:21     17:26     17:36         18:21          19:21        │
│                                 ▲                             │
│                                 │ Now: 18:36                  │
│                                                               │
╰───────────────────────────────────────────────────────────────╯

┌─────────────────────────────────────────────────┐
│ Overall: ████████████████░░░░░░░░░░░░░░░░░ 60%  │
└─────────────────────────────────────────────────┘

Neurological Response Map
-------------------------
Cognitive    ████░░░░  Moderate Activation
Motor        ███░░░░░  Slight Stimulation
Emotional    █████░░░  High Responsiveness
Sensory      ████░░░░  Enhanced Perception
Autonomic    ███░░░░░  Mild Systemic Impact


Temporal Intensity Fractal
--------------------------
         Peak
        /     \
       /       \
      /         \
     /           \
    /             \
   /               \
  Onset           Comedown


Physiological Stress Indicator
-------------------------------
Cardiovascular  ████░░░░  Moderate Elevation
Respiratory     ███░░░░░  Slight Acceleration
Metabolic       █████░░░  High Metabolic Rate
Neurological    ████░░░░  Moderate Stimulation

Absorption Efficiency
---------------------
Oral         ████████░░  90% Efficiency
Sublingual   ██████████  100% Efficiency
Intranasal   ███████░░░  85% Efficiency
Intravenous  ██████████  100% Efficiency

Tolerance and Sensitivity Tracker
----------------------------------
Baseline Sensitivity  ████████████████
Current Tolerance     ████████░░░░░░░░
Adaptive Response     ███████████░░░░░

Biochemical Interaction Web
---------------------------
Neurotransmitters
  Dopamine    ●───┐
  Serotonin   ●───┤
  Norepineph. ●───┘
Hormones
  Cortisol    ●
  Melatonin   ●

Chronobiological Rhythm
-----------------------
Circadian Cycle
  Awake   ████████████████████████
  Asleep  ░░░░░░░░░░░░░░░░░░░░░░░░
Metabolic Rate
  Morning   ███░░░░
  Afternoon ████░░░
  Evening   ██░░░░░

Intensity Heatmap
-----------------
Time    00 01 02 03 04 05 06 07 08 09 10
Onset   ░░░░░░░░░░░░░░░░░░░░░░
Come-up ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
Peak    ██████████████████████
Comedown ████████████░░░░░░░░░
Afterglow ██░░░░░░░░░░░░░░░░░░

Dosage Strength Radar
---------------------
    Threshold
      ●
   Light ●
         Common
           ●
        Strong
           ●
         Heavy
           ●

Substance Timeline [Caffeine]
-----------------------------
O---C---P---CD---A
│   │   │    │    │
│   │   │    │    Afterglow
│   │   │    Comedown
│   │   Peak
│   Come-up
Onset


Neurochemical Resonance
-----------------------
Dopamine    ●───┐
Serotonin   ●───┤
Norepineph. ●───┘
Resonance Pattern:
  [████████░░] Harmonic

Psychonautic Resonance Mandala
------------------------------
        Cognitive
         /     \
    Emotional   Physical
       |    ●    |
       |   / \   |
    Perceptual   Spiritual

Metabolic Fractal Mapper
------------------------
Initial State:  [░░░░░░░░]
Transformation: [████░░░░]
Final State:    [██████░░]
Fractal Pattern:
    /\
   /  \
  /    \
 /      \

Quantum Probability Compass
---------------------------
Onset      N
          ╱│╲
Come-up   W●─●E
          ╲│/
Peak       S
Probability Vectors:
  Expected: [████████░░]
  Actual:   [████████▓░]

Neuroplastic Adaptation Mesh
----------------------------
Baseline:      [░░░░░░░░]
Adaptation:    [████░░░░]
Plasticity:    [██████░░]
Neural Network:
  ●───●───●
   \   \   \
    ●───●───●

┌─[Ingestion Details]───────────────────────────────────────────────┐
│ Substance: Caffeine (200 mg oral)                                 │
│ Ingestion Time: 17:21 UTC                                         │
│ Estimated End: 20:21 UTC                                          │
│ Current Phase: Afterglow (Low Intensity)                          │
│ Progress: ██████████████░░░░░░░░░ (60%)                           │
├───────────────────────────────────────────────────────────────────┤
│ [Onset]----[Comeup]----[Peak]==========|--------[Afterglow]       │
│ 17:21     17:26     17:36         18:21          19:21            │
│                                 ▲                                 │
│                                 │ Now: 18:36                      │
└───────────────────────────────────────────────────────────────────┘

┌─[Phase Details]───────────────────────────────────────────────────┐
│ Current Phase: Afterglow                                          │
│ Intensity: █████░░░░░ (Medium)                                    │
│ Duration: 45 minutes                                              │
│ Remaining: ~12 minutes                                            │
└───────────────────────────────────────────────────────────────────┘

┌─[Overall Progress]───────────────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░ 60%                             │
└───────────────────────────────────────────────────────────────────┘

┌─[Neurological Response]───────────────────────────────────────────┐
│ Cognitive    ████░░░░  Moderate Activation                        │
│ Motor        ███░░░░░  Slight Stimulation                         │
│ Emotional    █████░░░  High Responsiveness                        │
│ Sensory      ████░░░░  Enhanced Perception                        │
│ Autonomic    ███░░░░░  Mild Systemic Impact                       │
└───────────────────────────────────────────────────────────────────┘

┌─[Physiological Stress]────────────────────────────────────────────┐
│ Cardiovascular  ████░░░░  Moderate Elevation                     │
│ Respiratory     ███░░░░░  Slight Acceleration                     │
│ Metabolic       █████░░░  High Metabolic Rate                      │
│ Neurological    ████░░░░  Moderate Stimulation                    │
└───────────────────────────────────────────────────────────────────┘

┌─[Dosage History]──────────────────────────────────────────────────┐
│ █ █ █ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░                     │
│ 2023-10-27 17:21 UTC - 200 mg                                     │
│ 2023-10-28 09:15 UTC - 100 mg                                     │
│ 2023-10-29 14:30 UTC - 150 mg                                     │
└───────────────────────────────────────────────────────────────────┘

┌─[Substance Stack]─────────────────────────────────────────────────┐
│ Caffeine: █████░░░░░░ (50%)                                       │
│ L-Theanine: ██████████ (100%)                                     │
│ Modafinil: █░░░░░░░░░ (10%)                                       │
└───────────────────────────────────────────────────────────────────┘

┌─[Tolerance and Sensitivity]───────────────────────────────────────┐
│ Baseline Sensitivity  ████████████████                            │
│ Current Tolerance     ████████░░░░░░░░                            │
│ Adaptive Response     ███████████░░░░░                            │
└───────────────────────────────────────────────────────────────────┘

┌─[Biochemical Interaction]─────────────────────────────────────────┐
│ Neurotransmitters                                                 │
│   Dopamine    ●───┐                                               │
│   Serotonin   ●───┤                                               │
│   Norepine


                                                                                                                        v0.0.1-alpha.2
╭Ingestion Details────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│Summary                                │┌Timeline───────────────────────────────────────────────────────────────────────────────────┐│
│           caffeine ▃ 100mg            ││OnComeup        Peak                    Comedown                                           ││
│             00:15 → 07:15             ││━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━││
│                  4%                   ││    ▲                                                                                      ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       │└───────────────────────────────────────────────────────────────────────────────────────────┘│
│                                       │┌Current Phase──────────────────────────────────────────────────────────────────────────────┐│
│                                       ││                                          Peak 2%                                          ││
│                                       ││                                       44m remaining                                       ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       ││                                                                                           ││
│                                       │└───────────────────────────────────────────────────────────────────────────────────────────┘│
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

Ingestion: Caffeine (Oral) - 200 mg - Started: 17:21 UTC





