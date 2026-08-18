import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'embedded-career-planner-v2'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'daily', label: 'Daily Study' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'projects', label: 'Projects' },
  { id: 'profile', label: 'Profile' },
]

const careerPaths = [
  {
    title: 'Embedded Engineer',
    description: 'Works on firmware, hardware interaction, and low-level product behavior.',
  },
  {
    title: 'Firmware Engineer',
    description: 'Focuses on drivers, debugging, bootloaders, and microcontroller software.',
  },
  {
    title: 'IoT & System Engineer',
    description: 'Connects sensors, devices, protocols, and cloud-connected product systems.',
  },
]

const roadmap = [
  {
    phase: 'Foundation',
    months: 'Months 1-2',
    focus: 'C basics, logic, debugging, memory, and digital electronics.',
    outcome: 'Read code and write small programs confidently.',
  },
  {
    phase: 'C Depth',
    months: 'Months 3-4',
    focus: 'Pointers, arrays, structs, files, bit operations, and data structures.',
    outcome: 'Solve practical coding problems without memorization.',
  },
  {
    phase: 'Embedded Core',
    months: 'Months 5-6',
    focus: 'GPIO, UART, SPI, I2C, ADC, PWM, interrupts, and timers.',
    outcome: 'Build working microcontroller projects using real hardware.',
  },
  {
    phase: 'Advanced Systems',
    months: 'Months 7-8',
    focus: 'RTOS ideas, protocol handling, driver architecture, and testing.',
    outcome: 'Design reliable firmware between layers and peripherals.',
  },
  {
    phase: 'Career Ready',
    months: 'Months 9-12',
    focus: 'Portfolio projects, resume prep, GitHub, and interview practice.',
    outcome: 'Be job-ready for entry-level embedded opportunities.',
  },
]

const checklist = [
  { id: 'm1', month: 'Month 1', task: 'Learn C syntax, variables, loops, conditions, and functions.' },
  { id: 'm2', month: 'Month 2', task: 'Practice arrays, strings, pointers, and debugging in small programs.' },
  { id: 'm3', month: 'Month 3', task: 'Study structs, memory layout, dynamic allocation, and bitwise logic.' },
  { id: 'm4', month: 'Month 4', task: 'Build three C mini-projects and revise interview-style problem solving.' },
  { id: 'm5', month: 'Month 5', task: 'Learn electronics basics: voltage, current, GPIO, and MCU architecture.' },
  { id: 'm6', month: 'Month 6', task: 'Use UART, SPI, I2C, ADC, PWM, timers, and interrupts on a dev board.' },
  { id: 'm7', month: 'Month 7', task: 'Create a sensor project and write clean hardware abstraction code.' },
  { id: 'm8', month: 'Month 8', task: 'Study RTOS basics, task scheduling, and firmware design patterns.' },
  { id: 'm9', month: 'Month 9', task: 'Build a portfolio project with documentation and clean GitHub structure.' },
  { id: 'm10', month: 'Month 10', task: 'Add protocol integration, testing, and debugging workflows.' },
  { id: 'm11', month: 'Month 11', task: 'Prepare resume, LinkedIn, and field-specific technical interview practice.' },
  { id: 'm12', month: 'Month 12', task: 'Finalize portfolio, apply for roles, and keep improving the go-to projects.' },
]

const weeklyPlan = [
  'Monday: C coding drill + 30-minute revision',
  'Tuesday: Embedded concept study + one hardware exercise',
  'Wednesday: Project work + bug fixing practice',
  'Thursday: Protocol or peripheral learning block',
  'Friday: Light recap and code review',
  'Saturday: Deep work session + project build time',
  'Sunday: Reflection, notes, and next-week planning',
]

const projects = [
  'LED control with button input and interrupt handling',
  'Temperature sensor logger using ADC and UART',
  'LCD + keypad interface with state machine logic',
  'PWM motor control and timing analysis',
  'UART/SPI/I2C communication between sensors and MCU',
  'Final portfolio project: embedded dashboard or sensor node',
]

const scheduleModes = {
  daily: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  alternate: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
  fourDay: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
  fiveDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
}

const monthThemes = [
  'Learn core C syntax, functions, arrays, and algorithms.',
  'Build C problem-solving confidence and debugging skill.',
  'Understand memory, pointers, structs, and file handling.',
  'Practice advanced C techniques and interview-style challenges.',
  'Study electronics basics: voltage, current, and MCU structure.',
  'Learn GPIO, timers, ADC, and interrupts in real hardware.',
  'Use UART, SPI, I2C, and PWM in practical projects.',
  'Explore sensor interfacing and clean peripheral driver design.',
  'Study RTOS concepts, scheduler thinking, and embedded patterns.',
  'Build a reliable personal project and improve debugging workflows.',
  'Prepare resume assets, GitHub, and technical interview readiness.',
  'Finalize a portfolio and apply for embedded-related opportunities.',
]

const syllabuses = {
  Monday: {
    focus: 'C fundamentals',
    level: 'Level 1 · Scratch to beginner',
    steps: [
      'Review variables, operators, conditions, loops, and input/output basics.',
      'Write 2 small programs from scratch without copying code from memory.',
      'Summarize the logic behind each program in your own words.',
    ],
    continuity: 'This builds the base you need for loops, conditions, and functions in the next study days.',
  },
  Tuesday: {
    focus: 'Functions and debugging',
    level: 'Level 2 · Beginner logic',
    steps: [
      'Study function declarations, call flow, and arguments.',
      'Create a small calculator or menu-driven program using functions.',
      'Debug one bug by reading compiler output and tracing variable values.',
    ],
    continuity: 'Functions connect directly to modular code, which becomes essential for firmware logic and project structure.',
  },
  Wednesday: {
    focus: 'Arrays, strings, and data handling',
    level: 'Level 3 · Structured coding',
    steps: [
      'Practice arrays, string manipulation, and loops over collections.',
      'Write a mini project that stores and filters sensor-like values.',
      'Compare arrays and strings carefully to avoid confusion in memory layout.',
    ],
    continuity: 'Arrays and strings prepare you for real device data such as sensor values, log entries, and command buffers.',
  },
  Thursday: {
    focus: 'Pointers, memory, and structs',
    level: 'Level 4 · Intermediate C',
    steps: [
      'Learn pointer arithmetic, address logic, and memory relationships.',
      'Build a struct-based program for student or device records.',
      'Explain how memory addresses are used in arrays, strings, and structs.',
    ],
    continuity: 'Pointers are the gateway into embedded memory, registers, and low-level hardware access.',
  },
  Friday: {
    focus: 'Files, bitwise operations, and problem solving',
    level: 'Level 5 · Problem solving',
    steps: [
      'Read and write files with practical C examples.',
      'Practice bit masking, bit shifts, and flag-based logic.',
      'Solve 2 interview-style C problems with careful explanation.',
    ],
    continuity: 'This prepares you to handle command parsing, configuration data, and control flags inside embedded software.',
  },
  Saturday: {
    focus: 'Embedded hardware basics',
    level: 'Level 6 · Embedded transition',
    steps: [
      'Learn GPIO, voltage, current, and digital signal behavior.',
      'Review MCU pin configuration and input/output concepts.',
      'Map one embedded project requirement to a microcontroller feature.',
    ],
    continuity: 'The C skills you built earlier now connect to microcontrollers, sensors, and hardware interaction.',
  },
  Sunday: {
    focus: 'Review, project integration, and next week planning',
    level: 'Level 7 · System thinking',
    steps: [
      'Review your mistakes and rewrite the hardest code from memory.',
      'Connect this week’s concept to your current project.',
      'Write the next week’s learning target and keep the roadmap sequence clear.',
    ],
    continuity: 'This closes the loop and makes each week move naturally into the next without random jumps in difficulty.',
  },
}

const defaultProfile = {
  name: 'Embedded Learner',
  goal: 'Embedded firmware engineer',
  workShift: '8-hour shift',
  studyHours: '6-8 hrs/week',
  focus: 'C programming and embedded systems',
}

const defaultPlanner = {
  mode: 'alternate',
  completed: { m1: true, m2: true },
  streak: { current: 2, best: 5, lastDate: null },
  studyLog: {},
  notes: 'Start with C basics, then focus on one device project every 2 weeks.',
  projects: {
    'LED control with button input and interrupt handling': 'in-progress',
    'Temperature sensor logger using ADC and UART': 'planned',
    'LCD + keypad interface with state machine logic': 'planned',
  },
}

const catchupLimit = 2

function getDateKey(date = new Date()) {
  const baseDate = new Date(date)
  const year = baseDate.getFullYear()
  const month = String(baseDate.getMonth() + 1).padStart(2, '0')
  const day = String(baseDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function isFutureDate(dateKey, compareDate = new Date()) {
  const targetDate = new Date(`${dateKey}T00:00:00`)
  return targetDate > startOfDay(compareDate)
}

function getMonthKey(dateKey) {
  return dateKey.slice(0, 7)
}

function getCurrentStreak(studyLog, todayKey) {
  const completedDates = new Set(
    Object.entries(studyLog)
      .filter(([, value]) => value?.completed)
      .map(([dateKey]) => dateKey)
  )

  if (!completedDates.has(todayKey)) {
    return 0
  }

  let streak = 0
  const cursor = new Date(`${todayKey}T00:00:00`)

  while (completedDates.has(getDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function getStudyDays(mode) {
  return scheduleModes[mode] || scheduleModes.alternate
}

function getUpcomingPreview(mode, now = new Date()) {
  const days = getStudyDays(mode)
  const todayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const startIndex = days.indexOf(todayName) >= 0 ? days.indexOf(todayName) : 0

  return days.slice(startIndex, startIndex + 4).map((dayName, index) => {
    const dayDate = new Date(now)
    dayDate.setDate(dayDate.getDate() + index)
    const isLocked = dayDate > new Date(startOfDay(now))
    const info = syllabuses[dayName]

    return {
      dayName,
      dateLabel: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      focus: info?.focus || 'Review and continue the roadmap',
      level: info?.level || 'Next step',
      isLocked,
      steps: info?.steps || [],
    }
  })
}

function isStudyDay(mode, now = new Date()) {
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  return getStudyDays(mode).includes(dayName)
}

function getTodayPlan(mode, currentDate = new Date()) {
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
  const isStudy = isStudyDay(mode, currentDate)
  const focus = monthThemes[currentDate.getMonth() % monthThemes.length]

  if (!isStudy) {
    return {
      title: 'Recovery / review day',
      status: 'rest',
      day: dayName,
      focus,
      tasks: [
        'Review yesterday\'s code notes and fix one bug.',
        'Read one embedded concept topic without taking notes.',
        'Plan the next study block and keep your streak alive with light revision.',
      ],
    }
  }

  const rotation = {
    Monday: ['C syntax review', 'Code challenge', 'Write 3 small functions'],
    Tuesday: ['Memory and pointers', 'Debugging drill', 'Review one error pattern'],
    Wednesday: ['Hardware basics', 'GPIO practice', 'Build a mini circuit note'],
    Thursday: ['Timers and interrupts', 'Trace code with flow notes', 'Write a short explanation'],
    Friday: ['Embedded protocol practice', 'Compile and test mini code', 'Document lessons'],
    Saturday: ['Project build block', 'Solve a practical embedded problem', 'Test final output'],
    Sunday: ['Weekly recap', 'Project cleanup', 'Set next week goals'],
  }

  return {
    title: 'Deep study day',
    status: 'focus',
    day: dayName,
    focus,
    tasks: rotation[dayName] || [
      'Learn the next concept',
      'Code 30 minutes',
      'Start a small project',
    ],
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return {
        planner: defaultPlanner,
        profile: defaultProfile,
        activeTab: 'overview',
      }
    }

    const parsed = JSON.parse(saved)
    return {
      planner: { ...defaultPlanner, ...parsed.planner },
      profile: { ...defaultProfile, ...parsed.profile },
      activeTab: parsed.activeTab || 'overview',
    }
  } catch {
    return {
      planner: defaultPlanner,
      profile: defaultProfile,
      activeTab: 'overview',
    }
  }
}

function App() {
  const [appState, setAppState] = useState(loadState)
  const [now, setNow] = useState(new Date())
  const [studyWarning, setStudyWarning] = useState('')
  const [focusSeconds, setFocusSeconds] = useState(45 * 60)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState))
  }, [appState])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const focusTimer = setInterval(() => {
      setFocusSeconds((previous) => (previous > 0 ? previous - 1 : 0))
    }, 1000)

    return () => clearInterval(focusTimer)
  }, [])

  const planner = appState.planner
  const profile = appState.profile
  const activeTab = appState.activeTab

  const totalTasks = checklist.length
  const completedCount = Object.keys(planner.completed).length
  const progress = Math.round((completedCount / totalTasks) * 100)
  const currentPlan = useMemo(() => getTodayPlan(planner.mode, now), [planner.mode, now])
  const upcomingPreview = useMemo(() => getUpcomingPreview(planner.mode, now), [planner.mode, now])
  const todayKey = getDateKey(now)
  const studyLog = planner.studyLog || {}

  const studyCalendar = useMemo(() => {
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - 16)

    return Array.from({ length: 33 }, (_, index) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      const dateKey = getDateKey(date)
      const isToday = dateKey === todayKey
      const done = !!studyLog[dateKey]?.completed
      const isFuture = isFutureDate(dateKey, now)

      return {
        dateKey,
        label: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday,
        done,
        isFuture,
      }
    })
  }, [now, studyLog, todayKey])

  const monthlyBackfills = useMemo(() => {
    const monthKey = getMonthKey(todayKey)
    return Object.keys(studyLog).filter((dateKey) => {
      const completed = !!studyLog[dateKey]?.completed
      return completed && dateKey.startsWith(monthKey) && dateKey < todayKey
    }).length
  }, [studyLog, todayKey])

  const currentStreak = getCurrentStreak(studyLog, todayKey)

  const updateProfile = (field, value) => {
    setAppState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }))
  }

  const setActiveTab = (tabId) => {
    setAppState((prev) => ({ ...prev, activeTab: tabId }))
  }

  const toggleTask = (id) => {
    setAppState((prev) => {
      const currentPlanner = prev.planner
      const alreadyDone = !!currentPlanner.completed[id]
      const nextCompleted = { ...currentPlanner.completed }

      if (alreadyDone) {
        delete nextCompleted[id]
        return {
          ...prev,
          planner: { ...currentPlanner, completed: nextCompleted },
        }
      }

      const lastDate = currentPlanner.streak.lastDate
      let current = currentPlanner.streak.current || 0
      let best = currentPlanner.streak.best || 0

      if (!lastDate) {
        current = 1
      } else {
        const last = new Date(`${lastDate}T00:00:00`)
        const diffDays = Math.round((new Date(`${todayKey}T00:00:00`) - last) / 86400000)
        current = diffDays === 1 ? current + 1 : 1
      }

      best = Math.max(best, current)
      nextCompleted[id] = true

      return {
        ...prev,
        planner: {
          ...currentPlanner,
          completed: nextCompleted,
          streak: { current, best, lastDate: todayKey },
        },
      }
    })
  }

  const toggleStudyDate = (dateKey) => {
    setStudyWarning('')

    if (isFutureDate(dateKey, now)) {
      setStudyWarning('Future dates are locked. Complete today first, then the next day unlocks.')
      return
    }

    const completedState = !!studyLog[dateKey]?.completed
    if (completedState) {
      setAppState((prev) => ({
        ...prev,
        planner: {
          ...prev.planner,
          studyLog: {
            ...prev.planner.studyLog,
            [dateKey]: { completed: false },
          },
        },
      }))
      return
    }

    const isPastDate = new Date(`${dateKey}T00:00:00`) < startOfDay(now)
    if (isPastDate) {
      const currentMonth = getMonthKey(todayKey)
      const pastCatchups = Object.keys(studyLog).filter((key) => {
        const done = !!studyLog[key]?.completed
        return done && key.startsWith(currentMonth) && key < todayKey
      }).length

      if (pastCatchups >= catchupLimit) {
        setStudyWarning(`Only ${catchupLimit} catch-up days are allowed per month. Keep the streak honest and learn on time.`)
        return
      }
    }

    setAppState((prev) => ({
      ...prev,
      planner: {
        ...prev.planner,
        studyLog: {
          ...prev.planner.studyLog,
          [dateKey]: { completed: true },
        },
      },
    }))
  }

  const isTodayDone = !!studyLog[todayKey]?.completed
  const focusMinutes = Math.floor(focusSeconds / 60)
  const focusSecondsRemaining = focusSeconds % 60

  const markCurrentDayDone = () => {
    toggleStudyDate(todayKey)
    setFocusSeconds(0)
  }

  const updateProjectStatus = (project, nextStatus) => {
    setAppState((prev) => ({
      ...prev,
      planner: {
        ...prev.planner,
        projects: {
          ...prev.planner.projects,
          [project]: nextStatus,
        },
      },
    }))
  }

  const setNotes = (nextNotes) => {
    setAppState((prev) => ({
      ...prev,
      planner: { ...prev.planner, notes: nextNotes },
    }))
  }

  const setMode = (mode) => {
    setAppState((prev) => ({
      ...prev,
      planner: { ...prev.planner, mode },
    }))
  }

  const projectEntries = Object.entries(planner.projects || {})

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <span className="brand-mark">E</span>
          <span>Embedded Career Planner</span>
        </div>

        <nav className="tab-bar" aria-label="Main sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {activeTab === 'overview' && (
          <>
            <section className="hero section-card">
              <div className="hero-copy">
                <p className="eyebrow">Today’s study plan</p>
                <h1>{currentPlan.title}</h1>
                <p className="subtitle">
                  {currentPlan.day} · {currentPlan.focus}
                </p>

                <div className="focus-card-main">
                  <div>
                    <span className="focus-label">Focus block</span>
                    <strong>{currentPlan.day} study session</strong>
                  </div>
                  <div className="focus-timer" aria-live="polite">
                    {String(focusMinutes).padStart(2, '0')}:{String(focusSecondsRemaining).padStart(2, '0')}
                  </div>
                </div>

                <ul className="task-list">
                  {currentPlan.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>

                <div className="cta-row">
                  <button type="button" className="primary-btn" onClick={markCurrentDayDone}>
                    {isTodayDone ? 'Mark not done' : 'Mark today done'}
                  </button>
                  <button type="button" className="secondary-btn" onClick={() => setMode('alternate')}>
                    Alternate-day mode
                  </button>
                  <button type="button" className="secondary-btn" onClick={() => setMode('daily')}>
                    Daily mode
                  </button>
                </div>
              </div>

              <div className="hero-panel">
                <div className="panel-header">
                  <span className="dot green" />
                  <span className="dot yellow" />
                  <span className="dot red" />
                </div>

                <div className="panel-body">
                  <div className="mini-card accent-card">
                    <span>Current streak</span>
                    <strong>{currentStreak || planner.streak.current || 0} days</strong>
                  </div>
                  <div className="mini-card">
                    <span>Best streak</span>
                    <strong>{planner.streak.best || 0} days</strong>
                  </div>
                  <div className="progress-box">
                    <div className="progress-head">
                      <span>Progress</span>
                      <strong>{progress}%</strong>
                    </div>
                    <div className="bar">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="stats-row summary-grid">
              <div>
                <strong>{planner.mode}</strong>
                <span>selected rhythm</span>
              </div>
              <div>
                <strong>{completedCount}</strong>
                <span>milestones done</span>
              </div>
              <div>
                <strong>{Math.max(1, totalTasks - completedCount)}</strong>
                <span>steps left</span>
              </div>
            </section>

            <section className="section-block">
              <div className="section-heading">
                <p className="eyebrow">Career path</p>
                <h2>Where embedded learning can take you</h2>
              </div>

              <div className="card-grid three-col">
                {careerPaths.map((path) => (
                  <article key={path.title} className="info-card section-card">
                    <h3>{path.title}</h3>
                    <p>{path.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'daily' && (
          <section className="section-block">
            <div className="section-heading">
              <p className="eyebrow">Daily syllabus</p>
              <h2>Progressive study flow from scratch to advanced</h2>
            </div>

            <div className="calendar-panel section-card">
              <div className="calendar-header">
                <div>
                  <h3>Study calendar</h3>
                  <p>Complete today or a recent missed day. Future days stay locked.</p>
                </div>
                <span>{monthlyBackfills}/{catchupLimit} catch-up used this month</span>
              </div>

              {studyWarning && <div className="warning-banner">{studyWarning}</div>}

              <div className="calendar-grid">
                {studyCalendar.map((day) => (
                  <button
                    key={day.dateKey}
                    type="button"
                    className={`calendar-day ${day.done ? 'done' : ''} ${day.isToday ? 'today' : ''} ${day.isFuture ? 'locked' : ''}`}
                    onClick={() => toggleStudyDate(day.dateKey)}
                    disabled={day.isFuture}
                  >
                    <span className="calendar-weekday">{day.dayName}</span>
                    <strong>{day.label}</strong>
                    <small>{day.done ? 'done' : day.isFuture ? 'locked' : day.isToday ? 'today' : 'open'}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="upcoming-preview-grid">
              {upcomingPreview.map((item) => (
                <div key={`${item.dayName}-${item.dateLabel}`} className={`preview-card ${item.isLocked ? 'locked' : 'active'}`}>
                  <div className="preview-topline">
                    <span>{item.dayName}</span>
                    <strong>{item.isLocked ? 'Locked' : 'Ready'}</strong>
                  </div>
                  <h3>{item.dateLabel}</h3>
                  <p>{item.focus}</p>
                  <small>{item.level}</small>
                  <ul>
                    {item.steps.slice(0, 2).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="daily-grid">
              {Object.entries(syllabuses).map(([day, item]) => (
                <article key={day} className={`day-card section-card ${day === currentPlan.day ? 'today-card' : ''}`}>
                  <div className="day-header">
                    <h3>{day}</h3>
                    <span>{item.focus}</span>
                    <small>{item.level}</small>
                  </div>
                  <ul>
                    {item.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                  <p className="continuity-note">{item.continuity}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'roadmap' && (
          <section className="section-block">
            <div className="section-heading">
              <p className="eyebrow">Roadmap</p>
              <h2>12-month learning plan</h2>
            </div>

            <div className="card-grid roadmap-grid">
              {roadmap.map((item) => (
                <article key={item.phase} className="roadmap-card section-card">
                  <div className="phase-tag">{item.phase}</div>
                  <h3>{item.months}</h3>
                  <p>{item.focus}</p>
                  <span>{item.outcome}</span>
                </article>
              ))}
            </div>

            <div className="section-block">
              <div className="section-heading">
                <p className="eyebrow">Checklist</p>
                <h2>Action-by-month plan</h2>
              </div>

              <div className="checklist-grid">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`check-item ${planner.completed[item.id] ? 'checked' : ''}`}
                    onClick={() => toggleTask(item.id)}
                  >
                    <span className="check-box">{planner.completed[item.id] ? '✓' : ''}</span>
                    <span className="check-text">
                      <strong>{item.month}</strong>
                      <small>{item.task}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'projects' && (
          <section className="section-block">
            <div className="section-heading">
              <p className="eyebrow">Project tracker</p>
              <h2>Portfolio management board</h2>
            </div>

            <div className="project-list section-card">
              {projectEntries.map(([project, status]) => (
                <div key={project} className="project-item">
                  <span className="project-dot" />
                  <div className="project-copy">
                    <p>{project}</p>
                    <select
                      value={status}
                      onChange={(event) => updateProjectStatus(project, event.target.value)}
                    >
                      <option value="planned">Planned</option>
                      <option value="in-progress">In progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-block">
              <div className="section-heading">
                <p className="eyebrow">Weekly rhythm</p>
                <h2>How to stay consistent with an 8-hour shift</h2>
              </div>

              <div className="schedule-layout">
                <div className="section-card">
                  <ul className="schedule-list">
                    {weeklyPlan.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </div>
                <div className="section-card focus-card">
                  <h3>Core skills ladder</h3>
                  <ul>
                    <li>C fundamentals</li>
                    <li>Pointers and memory safety</li>
                    <li>Embedded peripherals</li>
                    <li>Debugging and testing</li>
                    <li>RTOS and system thinking</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="section-block">
            <div className="section-heading">
              <p className="eyebrow">Profile</p>
              <h2>Your personal study profile</h2>
            </div>

            <div className="profile-grid section-card">
              <div className="field">
                <label>Name</label>
                <input value={profile.name} onChange={(event) => updateProfile('name', event.target.value)} />
              </div>
              <div className="field">
                <label>Career goal</label>
                <input value={profile.goal} onChange={(event) => updateProfile('goal', event.target.value)} />
              </div>
              <div className="field">
                <label>Work shift</label>
                <input value={profile.workShift} onChange={(event) => updateProfile('workShift', event.target.value)} />
              </div>
              <div className="field">
                <label>Study hours</label>
                <input value={profile.studyHours} onChange={(event) => updateProfile('studyHours', event.target.value)} />
              </div>
              <div className="field field-wide">
                <label>Focus area</label>
                <input value={profile.focus} onChange={(event) => updateProfile('focus', event.target.value)} />
              </div>
            </div>

            <div className="section-block">
              <div className="section-heading">
                <p className="eyebrow">Notes</p>
                <h2>Your study journal</h2>
              </div>

              <div className="notes-box section-card">
                <textarea
                  value={planner.notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Write your goals, reflections, mistakes, and next actions..."
                />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
