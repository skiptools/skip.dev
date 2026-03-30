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
3. Note your **Domain**, **Client ID**, and configure the **Allowed Callback URLs** and **Allowed Logout URLs** for both platforms.

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

Check whether stored credentials are available:

```swift
if Auth0SDK.shared.hasValidCredentials {
    print("User has valid stored credentials")
} else {
    print("User needs to log in")
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
    @State var errorMessage: String?

    var body: some View {
        VStack(spacing: 16) {
            if isLoggedIn {
                Text("You are logged in!")
                Button("Log Out") {
                    Auth0SDK.shared.logout { result in
                        if case .success = result {
                            isLoggedIn = false
                        }
                    }
                }
            } else {
                Text("Please log in")
                Button("Log In") {
                    Auth0SDK.shared.login { result in
                        switch result {
                        case .success:
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
            isLoggedIn = Auth0SDK.shared.hasValidCredentials
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
| `login(scope:audience:presenting:completion:)` | Start Universal Login (browser) |
| `loginWithCredentials(email:password:scope:audience:completion:)` | Direct email/password login |
| `logout(federated:presenting:completion:)` | Clear the session |
| `renewCredentials(refreshToken:completion:)` | Refresh an access token |
| `hasValidCredentials: Bool` | Whether stored credentials exist |
| `clearCredentials()` | Remove stored credentials |

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

### Auth0Error

| Case | Description |
|---|---|
| `.notConfigured` | `configure(_:)` has not been called |
| `.missingPresenter` | A platform presenter is required |
| `.webAuthFailed(String)` | The authentication flow failed |

## Limitations

:::warning
The following features are **not yet available** in the Skip cross-platform wrapper:
:::
> - **Sign up** (user registration) — Available on iOS via the native Auth0.swift SDK. On Android, use the Auth0 Universal Login which includes sign-up, or call the Auth0 Authentication API directly via `#if SKIP` blocks.
> - **Password reset** — Use the Universal Login page which includes a "Forgot Password" link, or use the native SDKs directly.
> - **User profile** (`/userinfo` endpoint) — Not yet wrapped. Use the `idToken` JWT to decode user info client-side, or call the endpoint directly.
> - **Token revocation** — Not yet wrapped. Use the native SDKs or call the Auth0 API directly.
> - **Social / OAuth login** — Supported through Universal Login (the browser-based flow handles all identity providers configured in your Auth0 dashboard).
> - **MFA (Multi-Factor Authentication)** — Handled by Universal Login when configured in your Auth0 dashboard. Programmatic MFA enrollment/verification is not wrapped.
> - **Credentials persistence** — On Android, `saveCredentials` is not yet supported through the cross-platform API. Use `hasValidCredentials` and `clearCredentials` to manage stored state. On iOS, the full `CredentialsManager` is available via the native Auth0 SDK.

:::note
On iOS, the full [Auth0.swift](https://github.com/auth0/Auth0.swift) API is available since SkipAuth0 re-exports it. Features like sign up, password reset, user profile, and token revocation work natively on iOS. The limitations above apply only to the cross-platform API surface on Android.
:::

## Building

This project is a free Swift Package Manager module that uses the
Skip plugin to transpile Swift into Kotlin.

Building the module requires that Skip be installed using
[Homebrew](https://brew.sh) with `brew install skiptools/skip/skip`.
This will also install the necessary build prerequisites:
Kotlin, Gradle, and the Android build tools.

## Testing

The module can be tested using the standard `swift test` command
or by running the test target for the macOS destination in Xcode,
which will run the Swift tests as well as the transpiled
Kotlin JUnit tests in the Robolectric Android simulation environment.

Parity testing can be performed with `skip test`,
which will output a table of the test results for both platforms.

