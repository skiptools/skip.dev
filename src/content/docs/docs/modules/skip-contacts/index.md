---
title: Contacts
description: Documentation for Contacts fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-contacts/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-contacts/releases' alt='Releases for skip-contacts'><img decoding='async' loading='lazy' alt='Releases for skip-contacts' src='https://img.shields.io/github/v/release/skiptools/skip-contacts.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-contacts](https://github.com/skiptools/skip-contacts) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


A cross-platform contacts framework for Skip apps, providing a unified API for querying, creating, updating, and deleting contacts on both iOS and Android.

On iOS, SkipContacts wraps Apple's [Contacts](https://developer.apple.com/documentation/contacts) and [ContactsUI](https://developer.apple.com/documentation/contactsui) frameworks. On Android, it uses the [ContactsContract](https://developer.android.com/reference/android/provider/ContactsContract) content provider.

## Setup

To use SkipContacts in your project, add the dependency to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://source.skip.tools/skip-contacts.git", "0.0.0"..<"2.0.0")
]
```

And add `SkipContacts` as a dependency of your target:

```swift
.target(name: "MyApp", dependencies: [
    .product(name: "SkipContacts", package: "skip-contacts")
])
```

## Prerequisites

### iOS

Add the following usage description to your app's `Info.plist` or `.xcconfig`:

```xml
<key>NSContactsUsageDescription</key>
<string>This app needs access to your contacts.</string>
```

Or in your `.xcconfig`:

```
INFOPLIST_KEY_NSContactsUsageDescription = This app needs access to your contacts.
```

### Android

Add the following permissions to your `AndroidManifest.xml` (or the test target's `Skip/AndroidManifest.xml`):

```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />
```

## Permissions

Always check and request contacts permission before performing operations:

```swift
import SkipContacts

// Check current permission status (synchronous, no prompt)
let status = ContactManager.queryContactsPermission()

switch status {
case .authorized:
    // Full access granted
    break
case .limited:
    // Limited access (iOS 18+)
    break
case .denied:
    // User denied access
    break
case .restricted:
    // Access restricted by policy
    break
case .unknown:
    // Not yet determined - request permission
    let result = await ContactManager.requestContactsPermission()
    if result == .authorized {
        // Access granted
    }
}
```

## Fetching Contacts

### Fetch all contacts

```swift
let manager = ContactManager.shared
let result = try manager.getContacts()
for contact in result.contacts {
    print("\(contact.displayName): \(contact.phoneNumbers.first?.value ?? "")")
}
```

### Fetch with options

```swift
let options = ContactFetchOptions(
    nameFilter: "John",
    pageSize: 20,
    pageOffset: 0,
    sortOrder: .givenName,
    includeImages: true,
    includeNote: true
)
let result = try manager.getContacts(options: options)

// Check if there are more results
if result.hasNextPage {
    // Fetch next page
    let nextOptions = ContactFetchOptions(
        nameFilter: "John",
        pageSize: 20,
        pageOffset: 20
    )
    let nextResult = try manager.getContacts(options: nextOptions)
}
```

### Fetch a single contact by ID

```swift
if let contact = try manager.getContact(id: contactID, includeImages: true) {
    print(contact.displayName)
    print(contact.givenName)
    print(contact.familyName)
}
```

### Check if contacts exist

```swift
let hasAny = try manager.hasContacts()
```

## Creating Contacts

```swift
let contact = Contact(
    contactType: .person,
    givenName: "Jane",
    familyName: "Doe",
    organizationName: "Acme Corp",
    jobTitle: "Engineer"
)

contact.phoneNumbers = [
    ContactPhoneNumber(label: .mobile, value: "+1-555-0123"),
    ContactPhoneNumber(label: .work, value: "+1-555-0456")
]

contact.emailAddresses = [
    ContactEmailAddress(label: .work, value: "jane@acme.com"),
    ContactEmailAddress(label: .home, value: "jane@example.com")
]

contact.postalAddresses = [
    ContactPostalAddress(
        label: .home,
        street: "123 Main St",
        city: "Springfield",
        state: "IL",
        postalCode: "62701",
        country: "USA"
    )
]

contact.birthday = ContactDate(label: .birthday, day: 15, month: 6, year: 1990)

contact.relationships = [
    ContactRelationship(label: .spouse, name: "John Doe")
]

contact.note = "Met at conference"

let newID = try manager.createContact(contact)
```

## Updating Contacts

```swift
// Fetch the contact first
if var contact = try manager.getContact(id: contactID) {
    contact.jobTitle = "Senior Engineer"
    contact.phoneNumbers.append(
        ContactPhoneNumber(label: .home, value: "+1-555-9999")
    )
    try manager.updateContact(contact)
}
```

## Deleting Contacts

```swift
try manager.deleteContact(id: contactID)
```

## Contact Groups

```swift
// List groups
let groups = try manager.getGroups()
for group in groups {
    print("\(group.name) (\(group.id ?? ""))")
}

// Create a group
let groupID = try manager.createGroup(name: "Book Club")

// Add a contact to a group
try manager.addContactToGroup(contactID: contactID, groupID: groupID)

// Remove a contact from a group
try manager.removeContactFromGroup(contactID: contactID, groupID: groupID)

// Delete a group
try manager.deleteGroup(id: groupID)
```

## Containers / Accounts

```swift
// List containers (accounts)
let containers = try manager.getContainers()
for container in containers {
    print("\(container.name) - \(container.type)")
}

// Get default container
let defaultID = try manager.getDefaultContainerID()
```

## Contact UI

SkipContacts provides SwiftUI view modifiers for presenting native contact interfaces.

### Contact Picker

Present the system contact picker to let the user select a contact:

```swift
struct MyView: View {
    @State var showPicker = false
    @State var selectedContactID: String?

    var body: some View {
        Button("Pick Contact") {
            showPicker = true
        }
        .withContactPicker(
            isPresented: $showPicker,
            onSelectContact: { contactID in
                selectedContactID = contactID
                // Fetch full contact details
                if let contact = try? ContactManager.shared.getContact(id: contactID) {
                    print("Selected: \(contact.displayName)")
                }
            },
            onCancel: {
                print("Picker cancelled")
            }
        )
    }
}
```

### Contact Viewer

Display a contact's details using the native viewer:

```swift
struct ContactDetailView: View {
    @State var showViewer = false
    let contactID: String

    var body: some View {
        Button("View Contact") {
            showViewer = true
        }
        .withContactViewer(
            isPresented: $showViewer,
            contactID: contactID
        )
    }
}
```

### Contact Editor

Present the native editor for creating or editing contacts:

```swift
// Create a new contact with defaults
struct CreateContactView: View {
    @State var showEditor = false

    var body: some View {
        Button("New Contact") {
            showEditor = true
        }
        .withContactEditor(
            isPresented: $showEditor,
            options: ContactEditorOptions(
                defaultGivenName: "Jane",
                defaultFamilyName: "Doe",
                defaultPhoneNumber: "+1-555-0123",
                defaultEmailAddress: "jane@example.com"
            ),
            onComplete: { result in
                switch result {
                case .saved: print("Contact saved")
                case .deleted: print("Contact deleted")
                case .canceled: print("Cancelled")
                case .unknown: print("Unknown result")
                }
            }
        )
    }
}

// Edit an existing contact
struct EditContactView: View {
    @State var showEditor = false
    let contact: Contact

    var body: some View {
        Button("Edit Contact") {
            showEditor = true
        }
        .withContactEditor(
            isPresented: $showEditor,
            options: ContactEditorOptions(contact: contact),
            onComplete: { result in
                print("Editor result: \(result)")
            }
        )
    }
}
```

## Contact Data Types

### Contact

The `Contact` class contains all fields for a contact record:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `String?` | Unique identifier (nil for new contacts) |
| `contactType` | `ContactType` | `.person` or `.organization` |
| `namePrefix` | `String` | e.g., "Dr.", "Mr." |
| `givenName` | `String` | First name |
| `middleName` | `String` | Middle name |
| `familyName` | `String` | Last name |
| `nameSuffix` | `String` | e.g., "Jr.", "PhD" |
| `nickname` | `String` | Nickname |
| `phoneticGivenName` | `String` | Phonetic first name |
| `phoneticMiddleName` | `String` | Phonetic middle name |
| `phoneticFamilyName` | `String` | Phonetic last name |
| `previousFamilyName` | `String` | Maiden name |
| `organizationName` | `String` | Company name |
| `departmentName` | `String` | Department |
| `jobTitle` | `String` | Job title |
| `phoneNumbers` | `[ContactPhoneNumber]` | Phone numbers |
| `emailAddresses` | `[ContactEmailAddress]` | Email addresses |
| `postalAddresses` | `[ContactPostalAddress]` | Postal addresses |
| `urlAddresses` | `[ContactURLAddress]` | URL addresses |
| `instantMessageAddresses` | `[ContactInstantMessageAddress]` | IM addresses |
| `socialProfiles` | `[ContactSocialProfile]` | Social profiles (iOS only) |
| `birthday` | `ContactDate?` | Birthday |
| `dates` | `[ContactDate]` | Other dates (anniversary, etc.) |
| `relationships` | `[ContactRelationship]` | Relationships |
| `note` | `String` | Notes |
| `image` | `ContactImage?` | Contact photo |
| `displayName` | `String` | Computed display name |

### Labels

All labeled values (phone, email, address, etc.) support standard labels and custom labels:

**Phone labels:** `main`, `home`, `work`, `mobile`, `iPhone`, `homeFax`, `workFax`, `pager`, `other`

**Email labels:** `home`, `work`, `iCloud`, `other`

**Address labels:** `home`, `work`, `other`

**Date labels:** `birthday`, `anniversary`, `other`

**Relationship labels:** `spouse`, `child`, `mother`, `father`, `parent`, `sibling`, `friend`, `manager`, `assistant`, `partner`, `other`

**URL labels:** `home`, `work`, `homepage`, `other`

### ContactPostalAddress

```swift
let address = ContactPostalAddress(
    label: .home,
    street: "123 Main St",
    city: "Springfield",
    state: "IL",
    postalCode: "62701",
    country: "USA",
    isoCountryCode: "US"
)
print(address.formattedAddress) // "123 Main St, Springfield, IL, 62701, USA"
```

### ContactDate

Dates support year-less values for recurring events like birthdays:

```swift
let birthday = ContactDate(label: .birthday, day: 15, month: 6, year: 1990)
let anniversary = ContactDate(label: .anniversary, day: 20, month: 9) // no year
```

### ContactImage

```swift
if let image = contact.image {
    if let thumbnail = image.thumbnailData {
        // Use thumbnail data
    }
    if let fullImage = image.imageData {
        // Use full-size image data
    }
}
```

## Platform-Specific Access

### iOS

Access the underlying `CNContactStore` for advanced operations not covered by the cross-platform API:

```swift
#if !SKIP
import Contacts

let store = ContactManager.shared.contactStore

// Use CNContactStore directly
let predicate = CNContact.predicateForContacts(matchingEmailAddress: "test@example.com")
let keys: [CNKeyDescriptor] = [CNContactGivenNameKey as CNKeyDescriptor]
let contacts = try store.unifiedContacts(matching: predicate, keysToFetch: keys)
#endif
```

### Android

In `#if SKIP` blocks, you can use Android's `ContactsContract` directly:

```swift
#if SKIP
let context = ProcessInfo.processInfo.androidContext
let resolver = context.getContentResolver()

let cursor = resolver.query(
    android.provider.ContactsContract.Contacts.CONTENT_URI,
    nil, nil, nil, nil
)
// Process cursor...
cursor?.close()
#endif
```

## Platform Differences

| Feature | iOS | Android |
|---------|-----|---------|
| Social profiles | Supported | Not available |
| Contact groups | Full support | Full support |
| Containers/Accounts | Full support (iCloud, Exchange, CardDAV) | Approximate (via RawContacts accounts) |
| Contact picker | CNContactPickerViewController | ACTION_PICK intent |
| Contact viewer | CNContactViewController | ACTION_VIEW intent |
| Contact editor | CNContactViewController | ACTION_INSERT/EDIT intent |
| Multiple selection | Supported | Not supported (single pick) |
| Image data | Thumbnail + full-size | Thumbnail + full-size |
| Notes | Full support | Full support |
| Previous family name | Supported | Not available |
| Phonetic names | Supported | Supported |

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

