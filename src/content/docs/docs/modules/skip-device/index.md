---
title: Sensors
description: Documentation for Sensors fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/skiptools/skip-device/edit/main/README.md
---

:::note[Source Repository <a href='https://github.com/skiptools/skip-device/releases' alt='Releases for skip-device'><img decoding='async' loading='lazy' alt='Releases for skip-device' src='https://img.shields.io/github/v/release/skiptools/skip-device.svg?style=flat' /></a>]{icon="github"}
This framework is available at [github.com/skiptools/skip-device](https://github.com/skiptools/skip-device) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::


The SkipDevice module is a dual-platform Skip framework that provides access to
network reachability, location services, and device sensor data (accelerometer, gyroscope, magnetometer, and barometer).

On iOS, the module wraps [CoreMotion](https://developer.apple.com/documentation/coremotion) and [CoreLocation](https://developer.apple.com/documentation/corelocation). On Android, it wraps the [Sensor](https://developer.android.com/reference/android/hardware/SensorManager) and [Location](https://developer.android.com/reference/android/location/LocationManager) APIs. All sensor providers expose a unified `AsyncThrowingStream` interface that works identically on both platforms.

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
        .package(url: "https://source.skip.dev/skip-device.git", "0.0.0"..<"2.0.0"),
    ],
    targets: [
        .target(name: "MyTarget", dependencies: [
            .product(name: "SkipDevice", package: "skip-device")
        ])
    ]
)
```

## Usage Pattern

All sensor providers follow the same pattern:

1. Create a provider instance (retain it for the lifetime of the monitoring session)
2. Optionally set `updateInterval` before calling `monitor()`
3. Iterate the `AsyncThrowingStream` returned by `monitor()`
4. The stream automatically stops when the task is cancelled or the provider is deallocated

```swift
let provider = SomeProvider()
provider.updateInterval = 0.1 // optional, in seconds
do {
    for try await event in provider.monitor() {
        // process event
    }
} catch {
    // handle error
}
```

Check `provider.isAvailable` before starting to determine if the hardware is present on the device.

## Network Reachability

Check whether the device currently has network access.

| | iOS | Android |
|---|---|---|
| API | [SCNetworkReachability](https://developer.apple.com/documentation/systemconfiguration/scnetworkreachability-g7d) | [ConnectivityManager](https://developer.android.com/reference/android/net/ConnectivityManager) |

```swift
import SkipDevice

let isReachable = NetworkReachability.isNetworkReachable
```

### Network Reachability Permissions

| Platform | Requirement |
|---|---|
| iOS | No permission required |
| Android | Declare `ACCESS_NETWORK_STATE` in `AndroidManifest.xml` |

Android manifest entry:

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Location

Access the device's geographic location via GPS, network, and fused providers. Provides latitude, longitude, altitude, speed, course, and accuracy information.

| | iOS | Android |
|---|---|---|
| API | [CLLocationManager](https://developer.apple.com/documentation/corelocation/cllocationmanager) | [LocationManager](https://developer.android.com/reference/android/location/LocationManager) (FUSED_PROVIDER) |

### Single Location Request

```swift
import SkipDevice

let provider = LocationProvider()
let location = try await provider.fetchCurrentLocation()
print("lat: \(location.latitude), lon: \(location.longitude), alt: \(location.altitude)")
```

### Continuous Location Updates

```swift
import SwiftUI
import SkipKit // for PermissionManager
import SkipDevice

struct LocationView: View {
    @State var event: LocationEvent?
    @State var errorMessage: String?

    var body: some View {
        VStack {
            if let event = event {
                Text("Latitude: \(event.latitude)")
                Text("Longitude: \(event.longitude)")
                Text("Altitude: \(event.altitude) m")
                Text("Speed: \(event.speed) m/s")
                Text("Course: \(event.course)")
                Text("Accuracy: \(event.horizontalAccuracy) m")
            } else if let errorMessage = errorMessage {
                Text(errorMessage).foregroundStyle(.red)
            } else {
                ProgressView()
            }
        }
        .task {
            let status = await PermissionManager.requestLocationPermission(precise: true, always: false)
            guard status.isAuthorized == true else {
                errorMessage = "Location permission denied"
                return
            }

            let provider = LocationProvider()
            do {
                for try await event in provider.monitor() {
                    self.event = event
                }
            } catch {
                errorMessage = "\(error)"
            }
        }
    }
}
```

### LocationEvent Properties

| Property | Type | Description |
|---|---|---|
| `latitude` | `Double` | Latitude in degrees |
| `longitude` | `Double` | Longitude in degrees |
| `horizontalAccuracy` | `Double` | Horizontal accuracy in meters |
| `altitude` | `Double` | Altitude (Mean Sea Level) in meters |
| `ellipsoidalAltitude` | `Double` | Ellipsoidal altitude in meters |
| `verticalAccuracy` | `Double` | Vertical accuracy in meters |
| `speed` | `Double` | Speed in meters per second |
| `speedAccuracy` | `Double` | Speed accuracy in meters per second |
| `course` | `Double` | Course/bearing in degrees |
| `courseAccuracy` | `Double` | Course accuracy in degrees |
| `timestamp` | `TimeInterval` | Event timestamp |

### Location Permissions

Location requires both a metadata declaration and a runtime permission request on both platforms. Use [SkipKit](https://source.skip.tools/skip-kit)'s `PermissionManager` for cross-platform runtime permission handling.

| Platform | Requirement |
|---|---|
| iOS | Declare `NSLocationWhenInUseUsageDescription` in `Darwin/AppName.xcconfig` |
| Android | Declare `ACCESS_FINE_LOCATION` and/or `ACCESS_COARSE_LOCATION` in `AndroidManifest.xml` |
| Both | Request permission at runtime via `PermissionManager.requestLocationPermission()` |

iOS xcconfig entry:

```
INFOPLIST_KEY_NSLocationWhenInUseUsageDescription = "This app uses your location to …"
```

Android manifest entries:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

## Motion Sensors

The accelerometer, gyroscope, magnetometer, and barometer share a common iOS permission requirement and usage pattern. On Android, motion sensors do not require any runtime permissions.

### Motion Permissions

| Platform | Requirement |
|---|---|
| iOS | Declare `NSMotionUsageDescription` in `Darwin/AppName.xcconfig` (no runtime request needed) |
| Android | No permission required for accelerometer, gyroscope, or magnetometer. Barometer requires a `<uses-feature>` declaration. |

iOS xcconfig entry:

```
INFOPLIST_KEY_NSMotionUsageDescription = "This app uses motion sensors to …"
```

## Accelerometer

Measures acceleration force on three axes in G's (gravitational force units, where 1G = 9.81 m/s). At rest face-up, the device reports approximately (0, 0, -1) G.

| | iOS | Android |
|---|---|---|
| API | [CMMotionManager.startAccelerometerUpdates](https://developer.apple.com/documentation/coremotion/cmmotionmanager/startaccelerometerupdates(to:withhandler:)) | [Sensor.TYPE_ACCELEROMETER](https://developer.android.com/reference/android/hardware/SensorEvent#sensor.type_accelerometer:) |
| Units | G's | m/s (converted to G's by SkipDevice) |

```swift
import SwiftUI
import SkipDevice

struct AccelerometerView: View {
    @State var event: AccelerometerEvent?

    var body: some View {
        VStack {
            if let event = event {
                Text("X: \(event.x) G")
                Text("Y: \(event.y) G")
                Text("Z: \(event.z) G")
            }
        }
        .task {
            let provider = AccelerometerProvider()
            guard provider.isAvailable else { return }
            provider.updateInterval = 0.1
            do {
                for try await event in provider.monitor() {
                    self.event = event
                }
            } catch {
                logger.error("accelerometer error: \(error)")
            }
        }
    }
}
```

### AccelerometerEvent Properties

| Property | Type | Description |
|---|---|---|
| `x` | `Double` | X-axis acceleration in G's |
| `y` | `Double` | Y-axis acceleration in G's |
| `z` | `Double` | Z-axis acceleration in G's |
| `timestamp` | `TimeInterval` | Event timestamp (seconds since boot) |

## Gyroscope

Measures angular rotation rate on three axes in radians per second.

| | iOS | Android |
|---|---|---|
| API | [CMMotionManager.startGyroUpdates](https://developer.apple.com/documentation/coremotion/cmmotionmanager/startgyroupdates(to:withhandler:)) | [Sensor.TYPE_GYROSCOPE](https://developer.android.com/reference/android/hardware/SensorEvent#sensor.type_gyroscope:) |
| Units | rad/s | rad/s |

```swift
import SwiftUI
import SkipDevice

struct GyroscopeView: View {
    @State var event: GyroscopeEvent?

    var body: some View {
        VStack {
            if let event = event {
                Text("X: \(event.x) rad/s")
                Text("Y: \(event.y) rad/s")
                Text("Z: \(event.z) rad/s")
            }
        }
        .task {
            let provider = GyroscopeProvider()
            guard provider.isAvailable else { return }
            provider.updateInterval = 0.1
            do {
                for try await event in provider.monitor() {
                    self.event = event
                }
            } catch {
                logger.error("gyroscope error: \(error)")
            }
        }
    }
}
```

### GyroscopeEvent Properties

| Property | Type | Description |
|---|---|---|
| `x` | `Double` | Angular speed around the x-axis in rad/s |
| `y` | `Double` | Angular speed around the y-axis in rad/s |
| `z` | `Double` | Angular speed around the z-axis in rad/s |
| `timestamp` | `TimeInterval` | Event timestamp (seconds since boot) |

## Magnetometer

Measures the ambient magnetic field on three axes in microteslas. Returns calibrated values with device bias removed on both platforms. Useful for compass headings and magnetic field detection.

| | iOS | Android |
|---|---|---|
| API | [CMDeviceMotion.magneticField](https://developer.apple.com/documentation/coremotion/cmdevicemotion/magneticfield) (calibrated) | [Sensor.TYPE_MAGNETIC_FIELD](https://developer.android.com/reference/android/hardware/SensorEvent#sensor.type_magnetic_field:) (calibrated) |
| Units | microteslas | microteslas |

Earth's magnetic field strength is typically 25-65 microteslas. Both platforms return calibrated geomagnetic field values with the device's own magnetic bias (hard iron distortion) removed.

```swift
import SwiftUI
import SkipDevice

struct MagnetometerView: View {
    @State var event: MagnetometerEvent?

    var heading: Double {
        guard let event = event else { return 0 }
        let angle = atan2(event.y, event.x) * 180.0 / .pi
        return angle < 0 ? angle + 360 : angle
    }

    var body: some View {
        VStack {
            if let event = event {
                Text("X: \(event.x) uT")
                Text("Y: \(event.y) uT")
                Text("Z: \(event.z) uT")
                Text("Heading: \(heading)")
            }
        }
        .task {
            let provider = MagnetometerProvider()
            guard provider.isAvailable else { return }
            provider.updateInterval = 0.1
            do {
                for try await event in provider.monitor() {
                    self.event = event
                }
            } catch {
                logger.error("magnetometer error: \(error)")
            }
        }
    }
}
```

### MagnetometerEvent Properties

| Property | Type | Description |
|---|---|---|
| `x` | `Double` | X-axis magnetic field in microteslas |
| `y` | `Double` | Y-axis magnetic field in microteslas |
| `z` | `Double` | Z-axis magnetic field in microteslas |
| `timestamp` | `TimeInterval` | Event timestamp (seconds since boot) |

## Barometer

Measures atmospheric pressure in kilopascals (kPa) and tracks relative altitude changes in meters since monitoring began.

| | iOS | Android |
|---|---|---|
| API | [CMAltimeter](https://developer.apple.com/documentation/coremotion/cmaltimeter) | [Sensor.TYPE_PRESSURE](https://developer.android.com/reference/android/hardware/SensorEvent#sensor.type_pressure:) |
| Pressure units | kPa | hPa (converted to kPa by SkipDevice) |
| Altitude | Relative meters since start | Computed via [SensorManager.getAltitude](https://developer.android.com/reference/android/hardware/SensorManager#getAltitude(float,%20float)) |

Standard atmospheric pressure at sea level is approximately 101.325 kPa.

```swift
import SwiftUI
import SkipDevice

struct BarometerView: View {
    @State var event: BarometerEvent?

    var body: some View {
        VStack {
            if let event = event {
                Text("Pressure: \(event.pressure) kPa")
                Text("Relative altitude: \(event.relativeAltitude) m")
            }
        }
        .task {
            let provider = BarometerProvider()
            guard provider.isAvailable else { return }
            provider.updateInterval = 0.5
            do {
                for try await event in provider.monitor() {
                    self.event = event
                }
            } catch {
                logger.error("barometer error: \(error)")
            }
        }
    }
}
```

### BarometerEvent Properties

| Property | Type | Description |
|---|---|---|
| `pressure` | `Double` | Atmospheric pressure in kilopascals (kPa) |
| `relativeAltitude` | `Double` | Altitude change in meters since monitoring started |
| `timestamp` | `TimeInterval` | Event timestamp |

### Barometer Permissions

| Platform | Requirement |
|---|---|
| iOS | `NSMotionUsageDescription` (same as other motion sensors) |
| Android | Declare sensor feature in `AndroidManifest.xml` |

Android manifest entry:

```xml
<uses-feature android:name="android.hardware.sensor.barometer" android:required="false" />
```

Set `android:required="false"` so the app can still be installed on devices without a barometer.

## Permissions Summary

| Sensor | iOS Declaration | iOS Runtime | Android Declaration | Android Runtime |
|---|---|---|---|---|
| Network Reachability | None | None | `ACCESS_NETWORK_STATE` | None |
| Location | `NSLocationWhenInUseUsageDescription` | Yes (via `PermissionManager`) | `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION` | Yes (via `PermissionManager`) |
| Accelerometer | `NSMotionUsageDescription` | None | None | None |
| Gyroscope | `NSMotionUsageDescription` | None | None | None |
| Magnetometer | `NSMotionUsageDescription` | None | None | None |
| Barometer | `NSMotionUsageDescription` | None | `uses-feature` (barometer) | None |

## API Reference

| Provider | Event Type | Key Properties | `isAvailable` | `updateInterval` |
|---|---|---|---|---|
| `NetworkReachability` | -- | `.isNetworkReachable: Bool` (static) | -- | -- |
| `LocationProvider` | `LocationEvent` | latitude, longitude, altitude, speed, course, accuracy | Yes | No (1s default) |
| `AccelerometerProvider` | `AccelerometerEvent` | x, y, z (G's) | Yes | Yes |
| `GyroscopeProvider` | `GyroscopeEvent` | x, y, z (rad/s) | Yes | Yes |
| `MagnetometerProvider` | `MagnetometerEvent` | x, y, z (microteslas) | Yes | Yes |
| `BarometerProvider` | `BarometerEvent` | pressure (kPa), relativeAltitude (m) | Yes | Yes |

All sensor providers share the same interface:

| Method / Property | Description |
|---|---|
| `init()` | Create a provider instance |
| `isAvailable: Bool` | Whether the sensor hardware is present |
| `updateInterval: TimeInterval?` | Set before calling `monitor()` |
| `monitor() -> AsyncThrowingStream` | Start streaming sensor events |
| `stop()` | Stop monitoring (also called automatically on `deinit` and task cancellation) |

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

## Contributing

We welcome contributions to this package in the form of enhancements and bug fixes.

The general flow for contributing to this and any other Skip package is:

1. Fork this repository and enable actions from the "Actions" tab
2. Check out your fork locally
3. When developing alongside a Skip app, add the package to a [shared workspace](/docs/contributing) to see your changes incorporated in the app
4. Push your changes to your fork and ensure the CI checks all pass in the Actions tab
5. Add your name to the Skip [Contributor Agreement](https://source.skip.dev/clabot-config)
6. Open a Pull Request from your fork with a description of your changes

