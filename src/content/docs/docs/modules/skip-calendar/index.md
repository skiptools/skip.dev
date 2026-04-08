---
title: Calendar
description: Documentation for Calendar fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-calendar/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-calendar/releases' alt='Releases for skip-calendar'><img decoding='async' loading='lazy' alt='Releases for skip-calendar' src='https://img.shields.io/github/v/release/skiptools/skip-calendar.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-calendar](https://github.com/skiptools/skip-calendar) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


Cross-platform calendar access for Skip apps. SkipCalendar provides a unified Swift API for querying, creating, and updating calendar events on both iOS and Android.

- **iOS**: Uses [EventKit](https://developer.apple.com/documentation/eventkit) and [EventKitUI](https://developer.apple.com/documentation/eventkitui)
- **Android**: Uses [CalendarContract](https://developer.android.com/reference/android/provider/CalendarContract) and system calendar intents

## Installation

Add `skip-calendar` to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://source.skip.tools/skip-calendar.git", "0.0.0"..<"2.0.0")
]
```

And add it to your target:

```swift
.target(name: "MyApp", dependencies: [
    .product(name: "SkipCalendar", package: "skip-calendar")
])
```

## Prerequisites

### iOS

Add the following usage description keys to your `Info.plist`:

```xml
<key>NSCalendarsUsageDescription</key>
<string>This app needs access to your calendar to display and manage events.</string>

<!-- iOS 17+ requires full access description -->
<key>NSCalendarsFullAccessUsageDescription</key>
<string>This app needs full access to your calendar to create and edit events.</string>

<!-- Only if using reminders -->
<key>NSRemindersFullAccessUsageDescription</key>
<string>This app needs access to your reminders.</string>
```

### Android

Add the following permissions to your `AndroidManifest.xml` (or your app's `Skip/skip.yml`):

```xml
<uses-permission android:name="android.permission.READ_CALENDAR" />
<uses-permission android:name="android.permission.WRITE_CALENDAR" />
```

To add these via `skip.yml` in your app module:

```yaml
build:
  contents:
    - block: 'android'
      contents:
        - block: 'defaultConfig'
          contents:
            - 'manifestPlaceholders["READ_CALENDAR"] = "android.permission.READ_CALENDAR"'
            - 'manifestPlaceholders["WRITE_CALENDAR"] = "android.permission.WRITE_CALENDAR"'
```

## Permissions

Always request permission before accessing calendar data:

```swift
import SkipCalendar

// Check current permission status (synchronous, does not prompt)
let status = CalendarManager.queryCalendarPermission()

// Request permission (async, may show system prompt)
let granted = await CalendarManager.requestCalendarPermission()
if granted == .authorized {
    // Access calendar data
}
```

For iOS reminders (a separate permission on iOS; on Android, calendar permission covers both):

```swift
let reminderStatus = await CalendarManager.requestReminderPermission()
```

## Querying Calendars

```swift
let manager = CalendarManager.shared

// Get all calendars
let calendars = try manager.getCalendars()
for cal in calendars {
    print("\(cal.title) (id: \(cal.id), readOnly: \(cal.isReadOnly))")
}

// Get the default calendar for new events
if let defaultCal = try manager.getDefaultCalendar() {
    print("Default: \(defaultCal.title)")
}

// Create a local calendar
let newCalID = try manager.createCalendar(title: "My Calendar", color: "#FF6B35")

// Delete a calendar
try manager.deleteCalendar(id: newCalID)
```

### CalendarItem Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `String` | Unique identifier |
| `title` | `String` | Display name |
| `color` | `String?` | Hex color (e.g. `"#FF0000"`) |
| `isReadOnly` | `Bool` | Whether the calendar can be modified |
| `isPrimary` | `Bool` | Whether this is the default calendar |
| `source` | `CalendarSource?` | Account/source info |
| `accountName` | `String?` | Account name (Android) |
| `ownerAccount` | `String?` | Owner account (Android) |
| `timeZone` | `String?` | Time zone identifier (Android) |
| `accessLevel` | `CalendarAccessLevel` | Access level |
| `isVisible` | `Bool` | Whether the calendar is visible |

## Working with Events

### Query Events

```swift
let manager = CalendarManager.shared

// Get events in a date range
let startDate = Date()
let endDate = Calendar.current.date(byAdding: .month, value: 1, to: startDate)!
let events = try manager.getEvents(startDate: startDate, endDate: endDate)

// Filter by specific calendars
let filteredEvents = try manager.getEvents(
    calendarIDs: ["cal-id-1", "cal-id-2"],
    startDate: startDate,
    endDate: endDate
)

// Get a single event by ID
if let event = try manager.getEvent(id: "event-id") {
    print("\(event.title) at \(event.location ?? "no location")")
}
```

### Create Events

```swift
let event = CalendarEvent(
    calendarID: defaultCalendar.id,
    title: "Team Meeting",
    location: "Conference Room A",
    notes: "Quarterly review",
    startDate: meetingStart,
    endDate: meetingEnd,
    isAllDay: false,
    availability: .busy
)

// Add an alarm (15 minutes before)
event.alarms = [CalendarAlarm(relativeOffset: -15.0)]

let eventID = try manager.createEvent(event)
// event.id is also set to the new ID
```

### Update Events

```swift
event.title = "Updated Team Meeting"
event.location = "Conference Room B"
try manager.updateEvent(event)

// For recurring events, update this and all future occurrences
try manager.updateEvent(event, span: .futureEvents)
```

### Delete Events

```swift
try manager.deleteEvent(id: eventID)

// For recurring events, delete this and all future occurrences
try manager.deleteEvent(id: eventID, span: .futureEvents)
```

### CalendarEvent Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `String?` | Unique identifier (nil for new events) |
| `calendarID` | `String` | Parent calendar ID |
| `title` | `String` | Event title |
| `location` | `String?` | Event location |
| `notes` | `String?` | Event notes/description |
| `url` | `String?` | Associated URL (iOS) |
| `startDate` | `Date` | Start date/time |
| `endDate` | `Date` | End date/time |
| `timeZone` | `String?` | Time zone identifier |
| `isAllDay` | `Bool` | Whether this is an all-day event |
| `availability` | `EventAvailability` | `.busy`, `.free`, `.tentative`, `.unavailable` |
| `status` | `EventStatus` | `.none`, `.confirmed`, `.tentative`, `.canceled` |
| `alarms` | `[CalendarAlarm]` | Event alarms/reminders |
| `recurrenceRules` | `[RecurrenceRule]` | Recurrence rules |
| `attendees` | `[CalendarAttendee]` | Event attendees (read-only) |
| `organizerEmail` | `String?` | Organizer email |
| `creationDate` | `Date?` | When the event was created (read-only) |
| `lastModifiedDate` | `Date?` | When the event was last modified (read-only) |

## Recurrence Rules

Create repeating events using `RecurrenceRule`, which follows the iCal RFC 5545 standard:

```swift
// Every day
let daily = RecurrenceRule(frequency: .daily)

// Every other week
let biweekly = RecurrenceRule(frequency: .weekly, interval: 2)

// Every Monday, Wednesday, Friday
let mwf = RecurrenceRule(
    frequency: .weekly,
    daysOfTheWeek: [
        DayOfWeek(dayOfTheWeek: 2),  // Monday
        DayOfWeek(dayOfTheWeek: 4),  // Wednesday
        DayOfWeek(dayOfTheWeek: 6)   // Friday
    ]
)

// 15th of every month
let monthly15 = RecurrenceRule(
    frequency: .monthly,
    daysOfTheMonth: [15]
)

// Second Friday of every month
let secondFriday = RecurrenceRule(
    frequency: .monthly,
    daysOfTheWeek: [DayOfWeek(dayOfTheWeek: 6, weekNumber: 2)]
)

// Last day of every month
let lastDay = RecurrenceRule(
    frequency: .monthly,
    daysOfTheMonth: [-1]
)

// Every year on March 15
let yearly = RecurrenceRule(
    frequency: .yearly,
    daysOfTheMonth: [15],
    monthsOfTheYear: [3]
)

// Repeat 10 times
let limited = RecurrenceRule(frequency: .daily, occurrenceCount: 10)

// Repeat until a specific date
let untilDate = RecurrenceRule(frequency: .weekly, endDate: someDate)
```

### RRULE String Conversion

RecurrenceRules can be converted to and from iCal RRULE strings:

```swift
let rule = RecurrenceRule(frequency: .weekly, interval: 2)
let rruleString = rule.toRRule()  // "FREQ=WEEKLY;INTERVAL=2"

let parsed = RecurrenceRule.fromRRule("FREQ=MONTHLY;BYDAY=2FR;COUNT=12")
// Second Friday of every month, 12 times
```

### DayOfWeek Reference

| `dayOfTheWeek` | Day |
|---|---|
| 1 | Sunday |
| 2 | Monday |
| 3 | Tuesday |
| 4 | Wednesday |
| 5 | Thursday |
| 6 | Friday |
| 7 | Saturday |

## Alarms

Add reminders to events:

```swift
// 15 minutes before the event
let alarm15min = CalendarAlarm(relativeOffset: -15.0)

// 1 hour before the event
let alarm1hr = CalendarAlarm(relativeOffset: -60.0)

// At a specific date/time (iOS only)
let alarmAbsolute = CalendarAlarm(absoluteDate: reminderDate)

event.alarms = [alarm15min, alarm1hr]
```

The `relativeOffset` is in minutes. Negative values mean before the event start.

## Attendees

Read attendees for an event (read-only on iOS, managed by the calendar service):

```swift
let attendees = try manager.getAttendees(eventID: event.id!)
for attendee in attendees {
    print("\(attendee.name ?? "Unknown") - \(attendee.status)")
}
```

### CalendarAttendee Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `String?` | Identifier (Android) |
| `name` | `String?` | Display name |
| `email` | `String?` | Email address |
| `role` | `AttendeeRole` | `.unknown`, `.required`, `.optional`, `.chair`, `.nonParticipant`, `.organizer` |
| `status` | `AttendeeStatus` | `.unknown`, `.pending`, `.accepted`, `.declined`, `.tentative`, `.delegated`, `.completed`, `.inProcess` |
| `type` | `AttendeeType` | `.unknown`, `.person`, `.room`, `.group`, `.resource` |
| `isCurrentUser` | `Bool` | Whether this is the current user (iOS) |

## Event Editor UI

Present the system event editor using the `withEventEditor` view modifier:

```swift
import SwiftUI
import SkipCalendar

struct MyView: View {
    @State var showEditor = false

    var body: some View {
        Button("Create Event") {
            showEditor = true
        }
        .withEventEditor(
            isPresented: $showEditor,
            options: EventEditorOptions(
                defaultTitle: "New Event",
                defaultStartDate: Date(),
                defaultEndDate: Date().addingTimeInterval(3600)
            ),
            onComplete: { result in
                switch result {
                case .saved: print("Event saved")
                case .deleted: print("Event deleted")
                case .canceled: print("Cancelled")
                case .unknown: print("Unknown result")
                }
            }
        )
    }
}
```

### Edit an Existing Event

```swift
.withEventEditor(
    isPresented: $showEditor,
    options: EventEditorOptions(event: existingEvent)
)
```

### View an Event

```swift
.withEventViewer(
    isPresented: $showViewer,
    eventID: event.id!,
    onComplete: { result in
        print("Viewer dismissed: \(result)")
    }
)
```

**Platform behavior:**
- **iOS**: Presents the native `EKEventEditViewController` or `EKEventViewController` in a sheet.
- **Android**: Launches the system calendar app via an intent. The `onComplete` callback receives `.unknown` since Android intents don't report results back.

## Platform-Specific Access

### iOS: EventKit

Access the underlying `EKEventStore` for advanced EventKit operations:

```swift
#if !SKIP
let eventStore = CalendarManager.shared.eventStore

// Use EventKit directly
let predicate = eventStore.predicateForEvents(
    withStart: Date(),
    end: Date().addingTimeInterval(86400),
    calendars: nil
)
let ekEvents = eventStore.events(matching: predicate)
#endif
```

### Android: CalendarContract

Access Android calendar data directly using the ContentResolver in `#if SKIP` blocks:

```swift
#if SKIP
import android.provider.CalendarContract

let context = ProcessInfo.processInfo.androidContext
let cursor = context.contentResolver.query(
    CalendarContract.Events.CONTENT_URI,
    nil, nil, nil, nil
)
// Process cursor...
cursor?.close()
#endif
```

## Building

This project is a Swift Package Manager module that uses the
Skip plugin to build the package for both iOS and Android.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.

