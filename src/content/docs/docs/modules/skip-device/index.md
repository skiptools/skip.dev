---
title: Device Hardware
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-device/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-device framework is available at [https://github.com/skiptools/skip-device.git](https://source.skip.tools/skip-device.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

The SkipDevice module is a dual-platform Skip framework that provides access to 
network reachability, location, and device sensor data.

## Setup

To include this framework in your project, add the following
dependency to your `Package.swift` file:

```swift
let package = Package(
    name: "my-package",
    products: [
        .library(name: "MyProduct", targets: ["MyTarget"]),
    ],
    dependencies: [
        .package(url: "https://source.skip.tools/skip-device.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipDevice", package: "skip-device")
        ])
    ]
)
```

## Network Reachability

You can check whether the device is currenly able to access the network with:

```swift
let isReachable: Bool = networkReachability.isNetworkReachable
```

### Network Reachability Permissions

In order to access the device's photos or media library, you will need to 
declare the permissions in the app's metadata.

On Android, the `app/src/main/AndroidManifest.xml` file will need to be edited to include:

```
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Location

You can request a single current device location with:

```swift
let provider = LocationProvider()
let location: LocationEvent = try await provider.fetchCurrentLocation()
logger.log("latitude: \(location.latitude) longitude: \(location.longitude) altitude: \(location.altitude)")
```

You can also subscribe to a stream of location updates like so:

```swift
import SwiftUI
import SkipKit // for PermissionManager
import SkipDevice

struct LocationView : View {
    @State var event: LocationEvent?

    var body: some View {
        VStack {
            if let event = event {
                Text("latitude: \(event.latitude)")
                Text("longitude: \(event.longitude)")
                Text("altitude: \(event.altitude)")
                Text("course: \(event.course)")
                Text("speed: \(event.speed)")
            }
        }
        .font(Font.body.monospaced())
        .task {
            // SkipKit provided PermissionManager, which creates a user-interface to request individual permissions
            if await PermissionManager.requestLocationPermission(precise: true, always: false).isAuthorized == false {
                logger.warning("permission refused for ACCESS_FINE_LOCATION")
                return
            }

            let provider = LocationProvider() // must retain reference
            provider.updateInterval = 1.0
            do {
                for try await event in provider.monitor() {
                    self.event = event
                    // if cancelled { break }
                }
            } catch {
                logger.error("error updating location: \(error)")
            }
            provider.stop()
        }
    }
}
```


### Location Permissions

In order to access the device's location, you will need to 
declare the permissions in the app's metadata.

On Android, the `app/src/main/AndroidManifest.xml` file will need to be edited to include one of the
following permissions:

```
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```

On iOS, you will need to add the `NSLocationWhenInUseUsageDescription` key to your `Darwin/AppName.xcconfig` file:

```
INFOPLIST_KEY_NSLocationWhenInUseUsageDescription = "This app uses your location to …"
```

## Motion

### Motion Permissions

On iOS, you will need to add the `NSMotionUsageDescription` key to your `Darwin/AppName.xcconfig` file:

```
INFOPLIST_KEY_NSMotionUsageDescription = "This app uses your motion information to …"
```


## Accelerometer

The `AccelerometerProvider` type provides an `AsyncThrowingStream<AccelerometerEvent, Event>` of device accelerometer changes.

It can be used in a View like this:

```swift
import SwiftUI
import SkipDevice

struct AccelerometerView : View {
    @State var event: AccelerometerEvent?

    var body: some View {
        VStack {
            if let event = event {
                Text("x: \(event.x)")
                Text("y: \(event.y)")
                Text("z: \(event.z)")
            }
        }
        .task {
            let provider = AccelerometerProvider() // must retain reference
            provider.updateInterval = 0.1
            do {
                for try await event in provider.monitor() {
                    self.event = event
                    // if cancelled { break }
                }
            } catch {
                logger.error("error updating accelerometer: \(error)")
            }
            provider.stop()
        }
    }
}
```

## Gyroscope

The `GyroscopeProvider` type provides an `AsyncThrowingStream<GyroscopeEvent, Event>` of device gyroscope changes.

It can be used in a View like this:

```swift
import SwiftUI
import SkipDevice

struct GyroscopeView : View {
    @State var event: GyroscopeEvent?

    var body: some View {
        VStack {
            if let event = event {
                Text("x: \(event.x)")
                Text("y: \(event.y)")
                Text("z: \(event.z)")
            }
        }
        .task {
            let provider = GyroscopeProvider() // must retain reference
            provider.updateInterval = 0.1
            do {
                for try await event in provider.monitor() {
                    self.event = event
                    // if cancelled { break }
                }
            } catch {
                logger.error("error updating gyroscope: \(error)")
            }
            provider.stop()
        }
    }
}
```


## Magnetometer

The `MagnetometerProvider` type provides an `AsyncThrowingStream<MagnetometerEvent, Error>` of device magnetometer changes.

It can be used in a View like this:

```swift
import SwiftUI
import SkipDevice

struct MagnetometerView : View {
    @State var event: MagnetometerEvent?

    var body: some View {
        VStack {
            if let event = event {
                Text("x: \(event.x)") // X-axis magnetic field in microteslas
                Text("y: \(event.y)") // Y-axis magnetic field in microteslas
                Text("z: \(event.z)") // Z-axis magnetic field in microteslas
            }
        }
        .font(Font.body.monospaced())
        .task {
            let provider = MagnetometerProvider() // must retain reference
            provider.updateInterval = 0.1
            do {
                for try await event in provider.monitor() {
                    self.event = event
                    // if cancelled { break }
                }
            } catch {
                logger.error("error updating magnetometer: \(error)")
            }
            provider.stop()
        }
    }
}
```


## Barometer

The `BarometerProvider` type provides an `AsyncThrowingStream<BarometerEvent, Event>` of device barometer changes.

It can be used in a View like this:

```swift
import SwiftUI
import SkipDevice

struct BarometerView : View {
    @State var event: BarometerEvent?

    var body: some View {
        VStack {
            if let event = event {
                Text("pressure: \(event.pressure)") // The recorded pressure, in kilopascals.
                Text("relativeAltitude: \(event.relativeAltitude)") // The change in altitude (in meters) since the first reported event.
            }
        }
        .font(Font.body.monospaced())
        .task {
            let provider = BarometerProvider() // must retain reference
            provider.updateInterval = 0.1
            do {
                for try await event in provider.monitor() {
                    self.event = event
                    // if cancelled { break }
                }
            } catch {
                logger.error("error updating barometer: \(error)")
            }
            provider.stop()
        }
    }
}
```

### Barometer Permissions

In order to access the device's barometer, you will need to 
declare the permissions in the app's metadata.

On Android, the `app/src/main/AndroidManifest.xml` file will need to be edited to include:

```
<uses-feature android:name="android.hardware.sensor.barometer" android:required="true" />
```


## Building

This project is a Swift Package Manager module that uses the
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

## Contributing

We welcome contributions to this package in the form of enhancements and bug fixes.

The general flow for contributing to this and any other Skip package is:

1. Fork this repository and enable actions from the "Actions" tab
2. Check out your fork locally
3. When developing alongside a Skip app, add the package to a [shared workspace](/docs/contributing) to see your changes incorporated in the app
4. Push your changes to your fork and ensure the CI checks all pass in the Actions tab
5. Add your name to the Skip [Contributor Agreement](https://source.skip.tools/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

