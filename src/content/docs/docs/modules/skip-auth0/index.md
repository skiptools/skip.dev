---
title: Auth0
description: Documentation for Auth0 fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-auth0/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-auth0/releases' alt='Releases for skip-auth0'><img decoding='async' loading='lazy' alt='Releases for skip-auth0' src='https://img.shields.io/github/v/release/skiptools/skip-auth0.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-auth0](https://github.com/skiptools/skip-auth0) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


[Auth0](https://auth0.com) authentication for Skip apps on both iOS and Android.

On iOS this wraps the [Auth0.swift](https://github.com/auth0/Auth0.swift) SDK (v2.18+). On Android, the Swift code is transpiled to Kotlin via Skip Lite and wraps the [Auth0.Android](https://github.com/auth0/Auth0.Android) SDK (v3.14).

## Setup

Add the dependency to your `Package.swift` file:

```swift
let package = Package(
    name: "my-package",
    products: [
        .library(name: "MyProduct", targets: ["MyTarget"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.dev/skip-auth0.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipAuth0", package: "skip-auth0")
        ])
    ]
)
```

### Auth0 Account Setup

1. Create an [Auth0](https://auth0.com) account and tenant.
2. Create a **Native** application in your Auth0 dashboard.
3. Note your **Domain** and **Client ID**.
4. Configure **Allowed Callback URLs** and **Allowed Logout URLs** for both platforms (see below).
5. If you plan to use `loginWithCredentials` or `signUp`, enable the **Password** grant type in your application's advanced settings under **Grant Types**.

### iOS Configuration

Add your Auth0 domain and client ID to your `Info.plist`, and register the callback URL scheme:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>YOUR_BUNDLE_ID</string>
        </array>
    </dict>
</array>
```

In your Auth0 dashboard, add the callback URL: `YOUR_BUNDLE_ID://YOUR_AUTH0_DOMAIN/ios/YOUR_BUNDLE_ID/callback`

### Android Configuration

Add your Auth0 domain and scheme to your `AndroidManifest.xml` via Gradle manifest placeholders. In the test target's `Skip/skip.yml` this is configured as:

```yaml
build:
  contents:
    - block: 'android'
      contents:
        - block: 'defaultConfig'
          contents:
            - 'manifestPlaceholders["auth0Domain"] = "YOUR_AUTH0_DOMAIN"'
            - 'manifestPlaceholders["auth0Scheme"] = "YOUR_SCHEME"'
```

In your Auth0 dashboard, add the callback URL: `YOUR_SCHEME://YOUR_AUTH0_DOMAIN/android/YOUR_PACKAGE_NAME/callback`

See the Auth0 [Android quickstart](https://auth0.com/docs/quickstart/native/android) for details.

## Usage

### Configuration

Configure the SDK early in your app's lifecycle:

```swift
import SkipAuth0

@main struct MyApp: App {
    init() {
        Auth0SDK.shared.configure(Auth0Config(
            domain: "yourapp.us.auth0.com",
            clientId: "your-client-id",
            scheme: "com.example.myapp"  // Your URL scheme
        ))
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### Login with Universal Login (Web Auth)

The recommended approach is Auth0's Universal Login, which opens the system browser:

```swift
Auth0SDK.shared.login { result in
    switch result {
    case .success(let credentials):
        print("Logged in!")
        print("Access token: \(credentials.accessToken ?? "")")
        print("ID token: \(credentials.idToken ?? "")")
        print("Refresh token: \(credentials.refreshToken ?? "")")
        print("Expires at: \(credentials.expiresAt?.description ?? "")")
    case .failure(let error):
        print("Login failed: \(error)")
    }
}
```

With custom scopes and audience:

```swift
Auth0SDK.shared.login(
    scope: "openid profile email offline_access",
    audience: "https://api.example.com"
) { result in
    // Handle result...
}
```

### Login with Email and Password

For direct login without opening a browser (requires enabling the "Password" grant type in your Auth0 application):

```swift
Auth0SDK.shared.loginWithCredentials(
    email: "user@example.com",
    password: "securepassword"
) { result in
    switch result {
    case .success(let credentials):
        print("Logged in with credentials")
    case .failure(let error):
        print("Login failed: \(error)")
    }
}
```

### Sign Up (Register and Login)

Create a new user account and immediately log in to obtain tokens:

```swift
Auth0SDK.shared.signUp(
    email: "newuser@example.com",
    password: "securepassword"
) { result in
    switch result {
    case .success(let credentials):
        print("Signed up and logged in!")
        print("Access token: \(credentials.accessToken ?? "")")
    case .failure(let error):
        print("Sign up failed: \(error)")
    }
}
```

With additional options:

```swift
Auth0SDK.shared.signUp(
    email: "newuser@example.com",
    password: "securepassword",
    username: "newuser",            // If your connection requires usernames
    connection: "Username-Password-Authentication",
    scope: "openid profile email offline_access",
    audience: "https://api.example.com"
) { result in
    // Handle result...
}
```

> **Prerequisites:** The "Password" grant type must be enabled in your Auth0 application settings. The database connection must allow sign-ups (check **Disable Sign Ups** is unchecked in your connection settings).

### Create User (Registration Only)

Create a new user without logging in. Useful when an admin creates accounts or when you want to handle login separately:

```swift
Auth0SDK.shared.createUser(
    email: "newuser@example.com",
    password: "securepassword"
) { result in
    switch result {
    case .success(let user):
        print("User created: \(user.email)")
        print("Username: \(user.username ?? "none")")
        print("Email verified: \(user.emailVerified)")
    case .failure(let error):
        print("User creation failed: \(error)")
    }
}
```

### Password Reset

Send a password reset email to the user:

```swift
Auth0SDK.shared.resetPassword(email: "user@example.com") { result in
    switch result {
    case .success:
        print("Password reset email sent")
    case .failure(let error):
        print("Password reset failed: \(error)")
    }
}
```

> **Note:** For security reasons, this method will not fail if the email address does not exist in the database. The user will simply not receive an email.

### User Profile

Fetch the user's profile from the Auth0 `/userinfo` endpoint:

```swift
Auth0SDK.shared.userInfo(accessToken: credentials.accessToken!) { result in
    switch result {
    case .success(let profile):
        print("User ID: \(profile.sub)")
        print("Name: \(profile.name ?? "")")
        print("Email: \(profile.email ?? "")")
        print("Email verified: \(profile.emailVerified)")
        print("Picture: \(profile.picture ?? "")")
        print("Nickname: \(profile.nickname ?? "")")
    case .failure(let error):
        print("Failed to fetch profile: \(error)")
    }
}
```

> **Prerequisites:** Requires a valid access token from a login flow. The token must have the `openid` scope to return user claims.

### Token Revocation

Revoke a refresh token to invalidate it server-side:

```swift
Auth0SDK.shared.revokeToken(refreshToken: savedRefreshToken) { result in
    switch result {
    case .success:
        print("Token revoked")
    case .failure(let error):
        print("Revocation failed: \(error)")
    }
}
```

> **Note:** After revocation, the refresh token can no longer be used to obtain new access tokens. Call this during logout for complete session invalidation.

### Logout

```swift
Auth0SDK.shared.logout { result in
    switch result {
    case .success:
        print("Logged out")
    case .failure(let error):
        print("Logout failed: \(error)")
    }
}

// Federated logout (also logs out of the identity provider)
Auth0SDK.shared.logout(federated: true) { result in
    // Handle result...
}
```

### Renewing Credentials

Refresh an expired access token using a refresh token:

```swift
Auth0SDK.shared.renewCredentials(refreshToken: savedRefreshToken) { result in
    switch result {
    case .success(let newCredentials):
        print("Token renewed: \(newCredentials.accessToken ?? "")")
    case .failure(let error):
        print("Renewal failed: \(error)")
    }
}
```

### Credentials Manager

Store and retrieve credentials using the platform's secure storage (Keychain on iOS, SharedPreferences on Android):

```swift
// Save credentials after login
Auth0SDK.shared.login { result in
    if case .success(let credentials) = result {
        Auth0SDK.shared.saveCredentials(credentials)
    }
}

// Check whether stored credentials are available
if Auth0SDK.shared.hasValidCredentials {
    print("User has valid stored credentials")
} else {
    print("User needs to log in")
}

// Retrieve stored credentials (auto-renews if expired)
Auth0SDK.shared.getCredentials { result in
    switch result {
    case .success(let credentials):
        print("Retrieved credentials: \(credentials.accessToken ?? "")")
    case .failure(let error):
        print("Failed to retrieve credentials: \(error)")
    }
}

// Clear stored credentials
Auth0SDK.shared.clearCredentials()
```

### SwiftUI Example

```swift
import SwiftUI
import SkipAuth0

struct LoginView: View {
    @State var isLoggedIn = false
    @State var userName: String?
    @State var errorMessage: String?

    var body: some View {
        VStack(spacing: 16) {
            if isLoggedIn {
                if let userName {
                    Text("Welcome, \(userName)!")
                } else {
                    Text("You are logged in!")
                }
                Button("Log Out") {
                    Auth0SDK.shared.logout { result in
                        if case .success = result {
                            Auth0SDK.shared.clearCredentials()
                            isLoggedIn = false
                            userName = nil
                        }
                    }
                }
            } else {
                Text("Please log in")
                Button("Log In") {
                    Auth0SDK.shared.login { result in
                        switch result {
                        case .success(let credentials):
                            Auth0SDK.shared.saveCredentials(credentials)
                            isLoggedIn = true
                            // Fetch user profile
                            if let token = credentials.accessToken {
                                Auth0SDK.shared.userInfo(accessToken: token) { profileResult in
                                    if case .success(let profile) = profileResult {
                                        userName = profile.name
                                    }
                                }
                            }
                        case .failure(let error):
                            errorMessage = error.localizedDescription
                        }
                    }
                }
                Button("Sign Up") {
                    Auth0SDK.shared.signUp(
                        email: "user@example.com",
                        password: "securepassword"
                    ) { result in
                        switch result {
                        case .success(let credentials):
                            Auth0SDK.shared.saveCredentials(credentials)
                            isLoggedIn = true
                        case .failure(let error):
                            errorMessage = error.localizedDescription
                        }
                    }
                }
            }
            if let errorMessage {
                Text(errorMessage).foregroundStyle(.red)
            }
        }
        .padding()
        .onAppear {
            if Auth0SDK.shared.hasValidCredentials {
                Auth0SDK.shared.getCredentials { result in
                    if case .success = result {
                        isLoggedIn = true
                    }
                }
            }
        }
    }
}
```

## API Reference

### Auth0SDK

The main singleton for all Auth0 operations.

| Method / Property | Description |
|---|---|
| `shared` | The singleton instance |
| `configure(_:)` | Initialize with an `Auth0Config` |
| `isConfigured: Bool` | Whether the SDK has been configured |
| `config: Auth0Config?` | The current configuration |
| **Web Auth** | |
| `login(scope:audience:presenting:completion:)` | Start Universal Login (browser) |
| `logout(federated:presenting:completion:)` | Clear the session |
| **Authentication API** | |
| `loginWithCredentials(email:password:scope:audience:completion:)` | Direct email/password login |
| `signUp(email:password:username:connection:scope:audience:completion:)` | Register a new user and log in |
| `createUser(email:password:username:connection:completion:)` | Register a new user without logging in |
| `resetPassword(email:connection:completion:)` | Send a password reset email |
| `renewCredentials(refreshToken:completion:)` | Refresh an access token |
| `userInfo(accessToken:completion:)` | Fetch the user profile |
| `revokeToken(refreshToken:completion:)` | Revoke a refresh token |
| **Credentials Manager** | |
| `hasValidCredentials: Bool` | Whether stored credentials exist |
| `clearCredentials()` | Remove stored credentials |
| `saveCredentials(_:) -> Bool` | Store credentials in secure storage |
| `getCredentials(completion:)` | Retrieve stored credentials (auto-renews) |

### Auth0Config

| Property | Description |
|---|---|
| `domain: String` | Auth0 tenant domain (e.g. `"yourapp.us.auth0.com"`) |
| `clientId: String` | OAuth client ID from your Auth0 application |
| `scheme: String` | URL scheme for callbacks (e.g. `"com.example.myapp"`) |
| `logoutReturnTo: String?` | Optional custom return-to URL for logout |

### Auth0Credentials

| Property | Type | Description |
|---|---|---|
| `accessToken` | `String?` | OAuth2 access token |
| `idToken` | `String?` | OpenID Connect ID token (JWT) |
| `refreshToken` | `String?` | Refresh token for renewing credentials |
| `tokenType` | `String?` | Token type (typically `"Bearer"`) |
| `expiresAt` | `Date?` | When the access token expires |
| `scope` | `String?` | Granted OAuth scopes |

### Auth0UserProfile

| Property | Type | Description |
|---|---|---|
| `sub` | `String` | The user's unique identifier (the `sub` claim) |
| `name` | `String?` | Full name |
| `givenName` | `String?` | Given (first) name |
| `familyName` | `String?` | Family (last) name |
| `nickname` | `String?` | Nickname |
| `email` | `String?` | Email address |
| `emailVerified` | `Bool` | Whether the email has been verified |
| `picture` | `String?` | URL of the user's profile picture |

### Auth0DatabaseUser

| Property | Type | Description |
|---|---|---|
| `email` | `String` | The user's email address |
| `username` | `String?` | Username (if the connection requires it) |
| `emailVerified` | `Bool` | Whether the email has been verified |

### Auth0Error

| Case | Description |
|---|---|
| `.notConfigured` | `configure(_:)` has not been called |
| `.missingPresenter` | A platform presenter is required |
| `.webAuthFailed(String)` | The web authentication flow failed |
| `.authenticationFailed(String)` | An authentication API call failed |

## Prerequisites Summary

| Feature | Requirement |
|---|---|
| All features | Auth0 account with a **Native** application configured |
| Universal Login | Callback URLs configured in Auth0 dashboard for both platforms |
| `loginWithCredentials` | "Password" grant type enabled in application settings |
| `signUp` / `createUser` | "Password" grant type enabled; sign-ups enabled on the database connection |
| `resetPassword` | A database connection (e.g. `Username-Password-Authentication`) |
| `userInfo` | Access token with `openid` scope |
| `revokeToken` | A valid refresh token (request `offline_access` scope during login) |
| iOS | `CFBundleURLSchemes` registered in `Info.plist` |
| Android | `auth0Domain` and `auth0Scheme` manifest placeholders in `skip.yml` |

## Limitations

:::note
On iOS, the full [Auth0.swift](https://github.com/auth0/Auth0.swift) API is available since SkipAuth0 re-exports it. The limitations below apply only to the cross-platform API surface.
:::

- **Social / OAuth login** — Supported through Universal Login (the browser-based flow handles all identity providers configured in your Auth0 dashboard). Direct social token exchange is not wrapped.
- **MFA (Multi-Factor Authentication)** — Handled by Universal Login when configured in your Auth0 dashboard. Programmatic MFA enrollment/verification is not wrapped.
- **Passwordless login** (email/SMS codes) — Not yet wrapped. Use the native SDKs directly or Universal Login.
- **Organizations** — Auth0 Organizations support is available through Universal Login but not wrapped in the cross-platform API.

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

