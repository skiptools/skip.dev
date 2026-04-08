---
title: Supabase
description: Documentation for Supabase fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-supabase/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-supabase/releases' alt='Releases for skip-supabase'><img decoding='async' loading='lazy' alt='Releases for skip-supabase' src='https://img.shields.io/github/v/release/skiptools/skip-supabase.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-supabase](https://github.com/skiptools/skip-supabase) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


[Supabase](https://supabase.com) support for Skip apps on both iOS and Android.

On iOS, this package re-exports the official [supabase-swift](https://github.com/supabase/supabase-swift) SDK (v2.43+). On Android, the Swift code is transpiled to Kotlin via Skip Lite and calls are forwarded to the community [supabase-kt](https://github.com/supabase-community/supabase-kt) SDK (v3.4).

:::note
[Skip Fuse](/docs/modes/) native apps can use the [Supabase Swift SDK](https://supabase.com/docs/reference/swift) directly without needing this package. SkipSupabase is designed for Skip Lite (transpiled) projects.
:::

## Setup

Add the dependency to your `Package.swift` file:

```swift
let package = Package(
    name: "my-package",
    products: [
        .library(name: "MyProduct", targets: ["MyTarget"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.dev/skip-supabase.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipSupabase", package: "skip-supabase")
        ])
    ]
)
```

The `SkipSupabase` product includes all modules. You can also depend on individual modules:

- `SkipSupabaseAuth` — Authentication
- `SkipSupabasePostgREST` — Database queries
- `SkipSupabaseStorage` — File storage
- `SkipSupabaseRealtime` — Real-time subscriptions (dependency only; no cross-platform wrapper)
- `SkipSupabaseFunctions` — Edge Functions (dependency only; no cross-platform wrapper)

### Supabase Project Setup

You need a [Supabase](https://supabase.com) project with its URL and anon key from your project's **Settings > API** page.

## Creating a Client

```swift
import SkipSupabase

let client = SupabaseClient(
    supabaseURL: URL(string: "https://your-project.supabase.co")!,
    supabaseKey: "your-anon-key"
)
```

## Authentication

### Sign Up and Sign In

```swift
let auth = client.auth

// Sign up with email
try await auth.signUp(email: "user@example.com", password: "securepassword")

// Sign in with email
try await auth.signIn(email: "user@example.com", password: "securepassword")

// Sign in with phone
try await auth.signIn(phone: "+15551234567", password: "securepassword")

// Sign in anonymously
try await auth.signInAnonymously()
```

### Sign Out

```swift
try await auth.signOut()                  // All sessions (global)
try await auth.signOut(scope: .local)     // Only this session
try await auth.signOut(scope: .others)    // All other sessions
```

### Accessing the Current Session

```swift
// Non-throwing — returns nil if no session
if let session = auth.currentSession {
    print("Access token: \(session.accessToken)")
    print("Refresh token: \(session.refreshToken)")
    print("Expires at: \(session.expiresAt)")
    print("Expires in: \(session.expiresIn) seconds")
    print("Token type: \(session.tokenType)")

    let user = session.user
    print("User ID: \(user.id)")
    print("Email: \(user.email ?? "none")")
    print("Phone: \(user.phone ?? "none")")
    print("Anonymous: \(user.isAnonymous)")
    print("Created: \(user.createdAt)")
}

// Throwing — throws AuthError.sessionMissing if not signed in
do {
    let session = try auth.session
    // Use session...
} catch {
    print("No active session")
}
```

### Refreshing Sessions

```swift
let session = try await auth.refreshSession()
```

### Updating User Attributes

```swift
// Update email
let user = try await auth.update(user: UserAttributes(email: "new@example.com"))

// Update password
let user = try await auth.update(user: UserAttributes(password: "newpassword"))

// Update phone
let user = try await auth.update(user: UserAttributes(phone: "+15559876543"))
```

### User Properties

The `User` object exposes the following properties:

| Property | Type | Description |
|---|---|---|
| `id` | `UUID` | Unique user identifier |
| `email` | `String?` | Email address |
| `phone` | `String?` | Phone number |
| `role` | `String?` | User role |
| `aud` | `String` | Audience claim |
| `isAnonymous` | `Bool` | Whether the user signed in anonymously |
| `createdAt` | `Date` | Account creation date |
| `updatedAt` | `Date` | Last update date |
| `lastSignInAt` | `Date?` | Last sign-in date |
| `confirmedAt` | `Date?` | Confirmation date |
| `emailConfirmedAt` | `Date?` | Email confirmation date |
| `phoneConfirmedAt` | `Date?` | Phone confirmation date |
| `confirmationSentAt` | `Date?` | Confirmation email sent date |
| `recoverySentAt` | `Date?` | Recovery email sent date |
| `emailChangeSentAt` | `Date?` | Email change notification date |
| `newEmail` | `String?` | Pending new email |
| `invitedAt` | `Date?` | Invitation date |
| `actionLink` | `String?` | Action link |

:::warning
The following auth features are **not yet available** in the Skip cross-platform wrapper:
:::
> - OAuth / Social login (Apple, Google, GitHub, etc.)
> - SSO (Single Sign-On)
> - OTP (One-Time Password) / Magic Link
> - MFA (Multi-Factor Authentication)
> - Auth state change listener (`authStateChanges`)
> - User metadata and app metadata
> - User identities and factors

## Database (PostgREST)

### Querying Data

```swift
struct Country: Codable {
    var id: Int
    var name: String
    var created: Date? = nil
    var gdp: Decimal? = nil
}

// Select all rows
let response: PostgrestResponse<[Country]> = try await client
    .from("countries")
    .select()
    .execute(options: FetchOptions(head: false, count: .exact))
let countries = response.value
let totalCount = response.count
```

### Counting Rows

```swift
let response: PostgrestResponse<Void> = try await client
    .from("countries")
    .select(count: .exact)
    .execute()
print("Total: \(response.count ?? 0)")
```

### Inserting Data

```swift
// Insert without returning data
let _: PostgrestResponse<Void> = try await client
    .from("countries")
    .insert(Country(id: 1, name: "USA"))
    .execute()

// Insert and return the inserted row
let response: PostgrestResponse<[Country]> = try await client
    .from("countries")
    .insert(Country(id: 2, name: "France"), returning: .representation)
    .execute(options: FetchOptions(head: false, count: .exact))
let inserted = response.value.first
```

### Updating Data

```swift
let _: PostgrestResponse<Void> = try await client
    .from("countries")
    .update(Country(id: 1, name: "Australia", gdp: Decimal(123.456)))
    .eq("id", value: 1)
    .execute()
```

### Upserting Data

```swift
let _: PostgrestResponse<Void> = try await client
    .from("countries")
    .upsert(Country(id: 1, name: "Japan"))
    .execute()
```

### Deleting Data

```swift
let _: PostgrestResponse<Void> = try await client
    .from("countries")
    .delete()
    .eq("id", value: 1)
    .execute()
```

### Filters

All filter methods return a chainable builder:

```swift
// Equality
.eq("column", value)                   // Equal
.neq("column", value)                  // Not equal

// Comparison
.gt("column", value)                   // Greater than
.gte("column", value)                  // Greater than or equal
.lt("column", value)                   // Less than
.lte("column", value)                  // Less than or equal

// Array membership
.in("column", [v1, v2, v3])           // In array
.contains("column", [v1])             // Contains values
.containedBy("column", [v1])          // Contained by values

// Pattern matching
.like("column", pattern: "%search%")   // LIKE (case-sensitive)
.ilike("column", pattern: "%search%")  // ILIKE (case-insensitive)

// Null / boolean check
.is("column", value: nil)             // IS NULL
.is("active", value: true)            // IS TRUE

// Full-text search
.textSearch("column", query: "word",
            config: "english",
            type: .plain)              // Full-text search
```

### Sorting and Pagination

```swift
.order("column", ascending: true, nullsFirst: false)
.limit(10)
.range(from: 0, to: 9)    // 0-based, inclusive
```

### RPC (Remote Procedure Calls)

```swift
// Call a function with no parameters
let response: PostgrestResponse<Void> = try await client
    .rpc("my_function")
    .execute()
let result = String(data: response.data, encoding: .utf8)

// Call a function with string parameters
let response: PostgrestResponse<Void> = try await client
    .rpc("search_users", params: [
        "query": "john",
        "limit": "10"
    ])
    .execute()
```

:::warning
**Database limitations:**
:::
> - Queries must use `PostgrestResponse<[T]>` (array). Single-value `PostgrestResponse<T>` decoding is not yet supported. Use `.limit(1)` and take the first element.
> - The `.single()` transform is defined but does not yet affect decoding.
> - RPC parameters must be `[String: String]` dictionaries. Codable parameter objects are not yet supported.
> - The `or` filter (combining multiple filters with OR logic) is not yet available.
> - CSV export (`csv()`), GeoJSON format (`geojson()`), and EXPLAIN (`explain()`) are not available.

## Storage

### Uploading Files

```swift
let storage = client.storage

// Upload from Data
let fileData: Data = ...
let response = try await storage
    .from("images")
    .upload("public/photo.png", data: fileData, options: FileOptions(
        contentType: "image/png",
        upsert: false
    ))
print("Uploaded to: \(response.fullPath)")

// Upload from a file URL
let response = try await storage
    .from("images")
    .upload("public/photo.png", fileURL: localFileURL, options: FileOptions(
        contentType: "image/png"
    ))
```

### Downloading Files

```swift
let data = try await storage
    .from("images")
    .download(path: "public/photo.png")

// Download with image transformation
let data = try await storage
    .from("images")
    .download(path: "public/photo.png", options: TransformOptions(
        width: 200, height: 100, resize: "fill", quality: 80
    ))
```

### Listing Files

```swift
let files = try await storage
    .from("images")
    .list(path: "public", options: SearchOptions(
        limit: 100,
        offset: 0,
        search: "photo"
    ))

for file in files {
    print("\(file.name)")
}
```

### Public and Signed URLs

```swift
let bucket = storage.from("images")

// Public URL (bucket must be public)
let publicURL = try bucket.getPublicURL(
    path: "public/photo.png",
    download: false
)

// Public URL with image transformation
let transformedURL = try bucket.getPublicURL(
    path: "public/photo.png",
    download: false,
    options: TransformOptions(width: 200, height: 100, resize: "fill", quality: 80)
)

// Signed URL (time-limited access)
let signedURL = try await bucket.createSignedURL(
    path: "public/photo.png",
    expiresIn: 3600,       // seconds
    download: false,
    transform: TransformOptions(width: 10, height: 10, resize: "fill", quality: 100)
)
```

### File Operations

```swift
let bucket = storage.from("images")

// Copy
try await bucket.copy(from: "public/photo.png", to: "archive/photo.png")

// Move (optionally across buckets)
try await bucket.move(
    from: "public/photo.png",
    to: "public/renamed.png",
    options: DestinationOptions(destinationBucket: "other-bucket")
)

// Update (replace) — supports both Data and file URL
try await bucket.update("public/photo.png", data: newData, options: FileOptions(
    contentType: "image/png",
    upsert: true
))

// Delete
let removed = try await bucket.remove(paths: ["public/photo.png"])
```

### File Info and Existence

```swift
let bucket = storage.from("images")

// Check if a file exists
let exists = try await bucket.exists(path: "public/photo.png")

// Get detailed file metadata
let info: FileObjectV2 = try await bucket.info(path: "public/photo.png")
print("Name: \(info.name)")
print("Size: \(info.size ?? 0) bytes")
print("Created: \(info.createdAt?.description ?? "unknown")")
print("ETag: \(info.etag ?? "none")")
```

### Signed Upload URLs

Create a pre-signed URL that allows uploading without further authentication:

```swift
let bucket = storage.from("images")

// Create a signed upload URL
let signedUpload = try await bucket.createSignedUploadURL(
    path: "public/upload-target.png",
    options: CreateSignedUploadURLOptions(upsert: true)
)
print("Upload URL: \(signedUpload.signedURL)")
print("Token: \(signedUpload.token)")

// Upload to the signed URL
let response = try await bucket.uploadToSignedURL(
    "public/upload-target.png",
    token: signedUpload.token,
    data: imageData,
    options: FileOptions(contentType: "image/png")
)
```

### Multiple Signed URLs

Create signed download URLs for multiple files at once:

```swift
let urls = try await storage.from("images").createSignedURLs(
    paths: ["public/photo1.png", "public/photo2.png"],
    expiresIn: 3600
)
for url in urls {
    print("Signed URL: \(url)")
}
```

### Bucket Management

```swift
let buckets = try await storage.listBuckets()
let bucket = try await storage.getBucket("images")

try await storage.createBucket("uploads", options: BucketOptions(
    public: true,
    fileSizeLimit: "10mb",
    allowedMimeTypes: ["image/*", "application/pdf"]
))

try await storage.updateBucket("uploads", options: BucketOptions(
    public: false
))

try await storage.emptyBucket("uploads")
try await storage.deleteBucket("uploads")
```

:::note
**Storage platform differences:**
:::
> - File upload/update from file URL reads the file into memory first on Android.
> - `FileObjectV2.contentType` from `info()` is not populated on Android (the Kotlin SDK exposes it as a lazy computed property that cannot be directly accessed).
> - `FileObjectV2.metadata` from `info()` is not populated on Android (JSON metadata conversion is not yet implemented).

## Realtime

The `SkipSupabaseRealtime` module includes the Kotlin `realtime-kt` dependency but **does not yet provide a cross-platform wrapper API**. The native SDKs are available on each platform via conditional compilation (`#if SKIP` / `#if !SKIP`).

## Edge Functions

The `SkipSupabaseFunctions` module includes the Kotlin `functions-kt` dependency but **does not yet provide a cross-platform wrapper API**.

## Architecture

### Module Structure

| Module | iOS SDK | Android SDK |
|---|---|---|
| SkipSupabaseCore | supabase-swift | supabase-kt BOM 3.4.1 + ktor-client-okhttp |
| SkipSupabaseAuth | Auth | auth-kt, compose-auth, compose-auth-ui |
| SkipSupabasePostgREST | PostgREST | postgrest-kt |
| SkipSupabaseStorage | Storage | storage-kt |
| SkipSupabaseRealtime | Realtime | realtime-kt |
| SkipSupabaseFunctions | Functions | functions-kt |
| SkipSupabase | All of the above | All of the above |

### How It Works

On iOS, SkipSupabase re-exports the official Supabase Swift SDK directly (`@_exported import Supabase`). Your code uses the full native API. On Android, wrapper classes in `#if SKIP` blocks adapt the Swift-style API to calls on the Kotlin `supabase-kt` SDK.

This bridging is challenging because the Swift and Kotlin Supabase SDKs were designed independently with different API shapes. Key implementation details:

- **JSON serialization**: A custom `CodableSerializer` bridges Swift's `Codable` to Kotlin's serialization, with special handling for Supabase's ISO 8601 date format.
- **Generic decoding**: Due to Kotlin type erasure, decoding is performed at call sites using `@inline(__always)` functions.
- **Query builder**: The PostgREST query builder chain is replicated on Android by wrapping the Kotlin SDK's builder API.

:::note
On iOS, the full supabase-swift API is available — you are not limited to the cross-platform surface documented here. Features like OAuth, Realtime channels, and Edge Functions work natively on iOS. On Android, only the wrapped API surface is available.
:::

## Contributing

Please file an [issue](https://source.skip.dev/skip-supabase/issues) if there is a particular API that you need for your project, or if something isn't working right. Pull requests are welcome at [skip-supabase](https://source.skip.dev/skip-supabase/pulls).

## Building

This project is a Swift Package Manager module that uses the
Skip plugin to transpile Swift into Kotlin.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.

