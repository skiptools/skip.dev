---
layout: docs
title: Deployment
permalink: /docs/deployment/

---

Skip app projects will build and launch the Android version of the app by starting the gradle process as part of the `Run Scripts` phase of the Xcode build process. This mechanism enables developers to rapidly iterate on an app by running both the iOS and Android versions side-by-side in the iOS Simulator and Android emulator. Similarly, Skip framework testing will run the transpiled Kotlin test cases by running `gradle test` on the translated modules.

:::tip
In order to be able to install and run an app on a connected Android device, you must enable USB debugging on the device, as per the [ADB documentation](https://developer.android.com/tools/adb#Enabling).
:::

:::note
If you have created separate iOS and Android apps, deploy each app in the standard way for its platform. This chapter applies to dual-platform apps and frameworks.
:::

## Exporting Build Artifacts {#export}

Running the `skip export` command from the Terminal in the project's directory will build your Skip framework or app, and export all the binary artifacts to the folder specified with the `-d` argument. This includes `.aar` library archives for each of the targets in the current project, as well as all the dependent archives. These binary artifacts can be used in any Kotlin or Java build process or IDE. For example, a Kotlin development team can manually add them to their Android Studio project in order to work with a shared data model that is created using Skip.

<img alt="Framework Export Screenshot" src="https://assets.skip.dev/framework-dev/framework-skip-export.png" style="width: 100%; max-width: 750px;" />

For app projects, the `skip export` command will additionally export `.apk` and `.aab` archives for the application, which can be installed directly on an Android device or uploaded to an Android app store, such as the Google Play Store.

<img alt="Framework Export Screenshot" src="https://assets.skip.dev/deployment/skip-export-app.png" style="width: 100%; max-width: 750px;" />

## Signing the Exported Android Artifacts {#export-signing}

By default, the exported `.build/skip-export/AppName-debug.apk` file is signed with a single-use temporary signature, which means that you can install it on an Android emulator or simulator but future versions of the app cannot be upgraded without first manually removing the existing app. 

The release APK at `.build/skip-export/AppName.apk`, on the other hand, is not signed at all by default. Signing the APK is something that you can manage manually however you want (such as by integrating signing into your app's CI workflow), but the default `Android/app/build.gradle.kts` build file will look for the presence of `keystore.properties` and `keystore.jks` files in the `Android/app/` folder.

For complete information on creating and managing Android signing keys, refer to the [Sign your app](https://developer.android.com/studio/publish/app-signing) documentation. But to get started quickly, you can create the `Android/app/keystore.jks` file by running this command from the root of your project and following the prompts:

```console
keytool -genkeypair -v -keystore Android/app/keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias app
``` 

Remember the passwords that you set for the keystore and the key itself, and then create a new `Android/app/keystore.properties` file with the contents:

```txt      
keyAlias=app
storeFile=keystore.jks
storePassword=PASSWORD
keyPassword=PASSWORD
```

:::caution
The `keystore.properties` and `keystore.jks` files will contain sensitive information, so be sure to avoid checking them into public source control repositories. For git, this can be done by adding them to the `.gitignore` file.
:::

Once these files are present, running `skip export` will automatically sign the release .apk file, which will enable you to distribute and run release builds of your app directly, without going through the Google Play Store.

The `apksigner` command-line tool (located in `~/Library/Android/sdk/build-tools/*/apksigner`) can be used to verify the signature for the .apk file.

:::tip
Note that the .apk signature is the app's own signature; in order to distribute the app on the Google Play Store, you will need an upload key. We recommend using Fastlane (see [below](#fastlane_signing_auth)) for automatically signing and uploading the app bundle to the Play Store.
:::

## Export Options {#export-options}

For detailed information on the command, see the [`skip export` CLI reference](/docs/skip-cli/#export).

---

## Running Gradle Manually {#gradle}

In addition to `skip export`, a Skip app project contains a gradle project in the `Android/` folder that can be run directly using the `gradle` command. This is useful for manually executing gradle tasks, such as launching the app on an emulator or configured device with the `launchDebug` task:

```
skipapp-showcase % gradle -p Android launchDebug
```

To release an Android app, you may want to perform the build yourself, either manually or as part of a continuous integration (CI) process. To build a release version of your app from the Terminal, you can run:

```console
gradle -p Android/ assemble
```

This will run the Gradle project specified in the `Android/gradle.settings.kts` file ([Showcase source code](https://github.com/skiptools/skipapp-showcase/blob/main/Android/settings.gradle.kts)), which will invoke the Swift Package Manager build to for Android. The resulting build artifacts can then be found in the `.build/Android/` folder, like so:

```plaintext
skiptools/skipapp-showcase % ls -lah .build/Android/app/outputs/apk/*/*.apk
73M .build/Android/app/outputs/apk/debug/app-debug.apk
11M .build/Android/app/outputs/apk/release/app-release.apk
```

If you need an Android Bundle for submitting to an app storefront, you can build it with:

```plaintext
skiptools/skipapp-showcase % gradle -p Android/ bundle
skiptools/skipapp-showcase % ls -lah .build/Android/app/outputs/bundle/*/*
 19M .build/Android/app/outputs/bundle/debug/app-debug.aab
5.6M .build/Android/app/outputs/bundle/release/app-release.aab
```

See the [Gradle project reference](/docs/gradle/) for more information on the structure of a Skip gradle project. More information on using the gradle CLI for building Android apps can be found at [https://developer.android.com/build/building-cmdline](https://developer.android.com/build/building-cmdline).

<!-- 
## GitHub Workflows
 -->

## Fastlane Integration {#fastlane}

Fastlane is a tool that automates the release of an app to the Apple App Store and the Google Play Store. It is an alternative to the manual steps required to create and upload a release of an app through the web site for each of the stores.

:::note
A complete example of a working fastlane configuration can be found in the Skip Showcase app for [Darwin](https://github.com/skiptools/skipapp-showcase/tree/main/Darwin) and [Android](https://github.com/skiptools/skipapp-showcase/tree/main/Android). This sample app is released on both the Google Play Store ([here](https://play.google.com/store/apps/details?id=org.appfair.app.Showcase)) and Apple App Store ([here](https://apps.apple.com/us/app/skip-showcase/id6474885022)), and is released using the process described herein.
:::


The fastlane command-line tool can be installed using Homebrew from the Terminal:

```
brew install fastlane
```

Full documentation for fastlane can be found at [https://docs.fastlane.tools](https://docs.fastlane.tools).

When you initialize a new Skip app with the following command:

```console
skip init --fastlane --appid=app.bundle.id package-name AppName
```

The `Darwin/` and `Android/` folders will each contain a template for the fastlane project, which holds the metadata files that can be edited to fill in information like the app's title, description, content ratings, and screenshots. These files can be localized for each language that your app supports.

The structure of the metadata for each platform is different. For iOS and other Apple platforms, the `Darwin/` folder will look like this:

```
Darwin/fastlane
├── AppStore.xcconfig
├── Appfile
├── Deliverfile
├── Fastfile
├── README.md
├── apikey.json*
├── metadata
│   └── en-US
│       ├── description.txt
│       ├── keywords.txt
│       ├── release_notes.txt
│       └── subtitle.txt
└── screenshots
    └── en-US
        ├── 0_APP_IPHONE_55_0.png
        ├── 0_APP_IPHONE_65_0.png
        ├── 1_APP_IPHONE_65_1.png
        ├── 2_APP_IPHONE_65_2.png
        ├── 3_APP_IPHONE_65_3.png
        ├── 4_APP_IPHONE_65_4.png
        └── 5_APP_IPHONE_65_5.png
```

The `Android/` folder will look like:

```
Android/fastlane
├── Appfile
├── Fastfile
├── README.md
├── apikey.json*
└── metadata
    └── android
        └── en-US
            ├── full_description.txt
            ├── images
            │   ├── featureGraphic.png
            │   ├── icon.png
            │   └── phoneScreenshots
            │       ├── 1_en-US.png
            │       ├── 2_en-US.png
            │       ├── 3_en-US.png
            │       └── 4_en-US.png
            ├── short_description.txt
            ├── title.txt
            └── video.txt
```

The fastlane `Fastfile`, `Appfile`, and `Deliverfile` for each platform can be configured to automatically submit the release for review, or to release it to the storefront's testing service. See the [fastlane documentation](https://docs.fastlane.tools) for further details.

### App Signing and Storefront Authentication {#fastlane_signing_auth}

An `apikey.json` file in each of the `fastlane/` folders (not created by `skip init`) must be downloaded for each of the App Store Connect service and the Google Play Console service. These contain the authentication information necessary to upload releases to the respective storefronts.
For the Apple App Store, follow the instructions for [using fastlane API Key JSON file](https://docs.fastlane.tools/app-store-connect-api/#using-fastlane-api-key-json-file). For the Google Play Store, follow the instructions for [upload to Play Store setup](https://docs.fastlane.tools/actions/upload_to_play_store/#setup).

In addition to the API keys, you must also follow each platform's app signing procedures. For Darwin platforms, this will mean downloading and installing the certificate and provisioning profile for the registered app id from [https://developer.apple.com](https://developer.apple.com). For Android, the `Android/app/` folder should contain a `keystore.jks` and `keystore.properties` file, which is used by the default `Android/app/build.gradle.kts` for signing the release artifacts when they are present.

:::caution
The `apikey.json` files, provisioning profiles, and keystore files will contain sensitive information, so be sure to avoid checking them into public source control repositories. For git, this can be done by adding them to the `.gitignore` file.
:::

Once you are ready to create a new release of your app, you can run the `fastlane release` command in each of the `Android/` and `Darwin/` folders to build the app (translating it first using Skip, in the case of Android), assemble it into an `.apk` or `.ipa`, and update the file to the appropriate storefront. 

### Fastlane Example (Darwin) {#fastlane_sample_darwin}

A sample session for releasing an iOS app will look like:

<details>
<summary><code>fastlane release</code></summary>
<div class="highlight">
<pre class="highlight" style="line-height: 1.0">
<code>
zap skipapp-showcase/Darwin % fastlane release
[✔] 🚀 
[10:59:50]: Get started using a Gemfile for fastlane https://docs.fastlane.tools/getting-started/ios/setup/#use-a-gemfile
[10:59:50]: ------------------------------
[10:59:50]: --- Step: default_platform ---
[10:59:50]: ------------------------------
[10:59:50]: Driving the lane 'release' 🚀
[10:59:50]: -------------------------------------
[10:59:50]: --- Step: Switch to assemble lane ---
[10:59:50]: -------------------------------------
[10:59:50]: Cruising over to lane 'assemble' 🚖
[10:59:50]: -----------------------
[10:59:50]: --- Step: build_app ---
[10:59:50]: -----------------------
[10:59:50]: Resolving Swift Package Manager dependencies...
[10:59:50]: $ xcodebuild -resolvePackageDependencies -scheme Showcase -project ./Showcase.xcodeproj -derivedDataPath ../.build/Darwin/DerivedData -xcconfig fastlane/AppStore.xcconfig
[10:59:51]: ▸ Command line invocation:
[10:59:51]: ▸     /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -resolvePackageDependencies -scheme Showcase -project ./Showcase.xcodeproj -derivedDataPath ../.build/Darwin/DerivedData -xcconfig fastlane/AppStore.xcconfig
[10:59:51]: ▸ Build settings from configuration file 'fastlane/AppStore.xcconfig':
[10:59:51]: ▸ Resolve Package Graph
[10:59:53]: ▸ dependency 'skip-ui' is not used by any targetdependency 'skip-av' is not used by any target
[10:59:53]: ▸ Resolved source packages:
[10:59:53]: ▸   skipapp-showcase: /srcroot/skipapp-showcase
[10:59:53]: ▸   skip-model: https://source.skip.tools/skip-model.git @ 0.7.0
[10:59:53]: ▸   skip-av: https://source.skip.tools/skip-av.git @ 0.0.2
[10:59:53]: ▸   skip-unit: https://source.skip.tools/skip-unit.git @ 0.7.2
[10:59:53]: ▸   skip: https://source.skip.tools/skip.git @ 0.8.46
[10:59:53]: ▸   skip-ui: https://source.skip.tools/skip-ui.git @ 0.9.6
[10:59:53]: ▸   skip-foundation: https://source.skip.tools/skip-foundation.git @ 0.6.11
[10:59:53]: ▸   skip-lib: https://source.skip.tools/skip-lib.git @ 0.7.13
[10:59:53]: ▸ resolved source packages: skipapp-showcase, skip-model, skip-av, skip-unit, skip, skip-ui, skip-foundation, skip-lib
[10:59:53]: $ xcodebuild -showBuildSettings -scheme Showcase -project ./Showcase.xcodeproj -derivedDataPath ../.build/Darwin/DerivedData -xcconfig fastlane/AppStore.xcconfig 2>&1

+-----------------------------------------------------------------------------+
|                           Summary for gym 2.220.0                           |
+--------------------------------------+--------------------------------------+
| sdk                                  | iphoneos                             |
| xcconfig                             | fastlane/AppStore.xcconfig           |
| derived_data_path                    | ../.build/Darwin/DerivedData         |
| output_directory                     | ../.build/fastlane/Darwin            |
| skip_archive                         | false                                |
| skip_codesigning                     | false                                |
| project                              | ./Showcase.xcodeproj                 |
| scheme                               | Showcase                             |
| clean                                | false                                |
| output_name                          | Showcase                             |
| silent                               | false                                |
| skip_package_ipa                     | false                                |
| skip_package_pkg                     | false                                |
| result_bundle                        | false                                |
| buildlog_path                        | ~/Library/Logs/gym                   |
| destination                          | generic/platform=iOS                 |
| xcodebuild_formatter                 | xcpretty                             |
| build_timing_summary                 | false                                |
| skip_profile_detection               | false                                |
| xcodebuild_command                   | xcodebuild                           |
| skip_package_dependencies_resolutio  | false                                |
| n                                    |                                      |
| disable_package_automatic_updates    | false                                |
| use_system_scm                       | false                                |
| xcode_path                           | /Applications/Xcode.app              |
+--------------------------------------+--------------------------------------+

[10:59:56]: $ set -o pipefail && xcodebuild -scheme Showcase -project ./Showcase.xcodeproj -derivedDataPath ../.build/Darwin/DerivedData -xcconfig fastlane/AppStore.xcconfig -sdk 'iphoneos' -destination 'generic/platform=iOS' -archivePath ~/Library/Developer/Xcode/Archives/App.xcarchive -skipPackagePluginValidation -skipMacroValidation archive | tee ~/Library/Logs/gym/Showcase-Showcase.log | xcpretty
[11:00:40]: ▸ Touching skipapp-showcase_Showcase.bundle (in target 'skipapp-showcase_Showcase' from project 'skipapp-showcase')
[11:00:40]: ▸ Linking Showcase.o
[11:00:40]: ▸ Processing empty-ShowcaseApp.plist
[11:00:40]: ▸ Linking ShowcaseApp
[11:00:40]: ▸ Generating 'ShowcaseApp.framework.dSYM'
[11:00:40]: ▸ Touching ShowcaseApp.framework (in target 'ShowcaseApp' from project 'skipapp-showcase')
[11:00:40]: ▸ Copying /srcroot/skipapp-showcase/.build/Darwin/DerivedData/Build/Intermediates.noindex/ArchiveIntermediates/Showcase/InstallationBuildProductsLocation/Applications/Showcase.app/protest_guerrilla.ttf
[11:00:40]: ▸ Linking Showcase
[11:00:41]: ▸ Running script 'Run skip gradle'
[11:00:41]: ▸ Processing Info.plist
[11:00:41]: ▸ Touching Showcase.app (in target 'Showcase' from project 'Showcase')
[11:00:41]: ▸ Archive Succeeded
[11:00:41]: Generated plist file with the following values:
[11:00:41]: ▸ -----------------------------------------
[11:00:41]: ▸ {
[11:00:41]: ▸   "method": "app-store"
[11:00:41]: ▸ }
[11:00:41]: ▸ -----------------------------------------
[11:00:41]: $ /usr/bin/xcrun /opt/homebrew/Cellar/fastlane/2.220.0/libexec/gems/fastlane-2.220.0/gym/lib/assets/wrap_xcodebuild/xcbuild-safe.sh -exportArchive -exportOptionsPlist '/var/folders/zl/wkdjv4s1271fbm6w0plzknkh0000gn/T/gym_config20240612-40159-xgzrb9.plist' -archivePath ~/Library/Developer/Xcode/Archives/2024-06-12/Showcase\ 2024-06-12\ 10.59.56.xcarchive -exportPath '/var/folders/zl/wkdjv4s1271fbm6w0plzknkh0000gn/T/gym_output20240612-40159-udedtq' -skipPackagePluginValidation -skipMacroValidation 
[11:00:55]: Successfully exported and signed the ipa file:
[11:00:55]: /srcroot/skipapp-showcase/.build/fastlane/Darwin/Showcase.ipa
[11:00:55]: Cruising back to lane 'release' 🚘
[11:00:56]: ---------------------------------
[11:00:56]: --- Step: upload_to_app_store ---
[11:00:56]: ---------------------------------
[11:00:56]: Successfully loaded '/srcroot/skipapp-showcase/Darwin/fastlane/Deliverfile' 📄

+--------------------------------------------------------------------------+
|              Detected Values from './fastlane/Deliverfile'               |
+-----------------------------------+--------------------------------------+
| copyright                         | 2024                                 |
| force                             | true                                 |
| automatic_release                 | true                                 |
| skip_screenshots                  | false                                |
| precheck_include_in_app_purchases | false                                |
| submit_for_review                 | true                                 |
+-----------------------------------+--------------------------------------+

[11:00:56]: Creating authorization token for App Store Connect API

+-----------------------------------------------------------------------------+
|                           deliver 2.220.0 Summary                           |
+--------------------------------------+--------------------------------------+
| api_key_path                         | fastlane/apikey.json                 |
| app_rating_config_path               | fastlane/metadata/rating.json        |
| screenshots_path                     | ./fastlane/screenshots               |
| metadata_path                        | ./fastlane/metadata                  |
| app_version                          | 1.0.3                                |
| username                             | appfair@appfair.org                  |
| app_identifier                       | org.appfair.app.Showcase             |
| platform                             | ios                                  |
| edit_live                            | false                                |
| use_live_version                     | false                                |
| skip_binary_upload                   | false                                |
| skip_screenshots                     | false                                |
| skip_metadata                        | false                                |
| skip_app_version_update              | false                                |
| force                                | true                                 |
| overwrite_screenshots                | false                                |
| screenshot_processing_timeout        | 3600                                 |
| sync_screenshots                     | false                                |
| submit_for_review                    | true                                 |
| verify_only                          | false                                |
| reject_if_possible                   | false                                |
| version_check_wait_retry_limit       | 7                                    |
| automatic_release                    | true                                 |
| phased_release                       | false                                |
| reset_ratings                        | false                                |
| run_precheck_before_submit           | true                                 |
| precheck_default_rule_level          | warn                                 |
| copyright                            | 2024                                 |
| ignore_language_directory_validation | false                                |
| precheck_include_in_app_purchases    | false                                |
+--------------------------------------+--------------------------------------+

[11:00:56]: Making sure the latest version on App Store Connect matches '1.0.3'...
[11:00:59]: Successfully set the version to '1.0.3'
[11:00:59]: Loading './fastlane/metadata/en-US/description.txt'...
[11:00:59]: Loading './fastlane/metadata/en-US/keywords.txt'...
[11:00:59]: Loading './fastlane/metadata/en-US/release_notes.txt'...
[11:00:59]: Loading './fastlane/metadata/en-US/support_url.txt'...
[11:00:59]: Loading './fastlane/metadata/en-US/subtitle.txt'...
[11:00:59]: Loading './fastlane/metadata/en-US/privacy_url.txt'...
[11:01:02]: No changes to localized App Info detected. Skipping upload.
[11:01:02]: Will begin uploading metadata for '1.0.3' on App Store Connect
[11:01:02]: Uploading metadata to App Store Connect for version
[11:01:06]: Uploading metadata to App Store Connect for localized version 'en-US'
[11:01:08]: Setting the app's age rating...
[11:01:09]: Will begin uploading snapshots for '1.0.3' on App Store Connect
[11:01:09]: Starting with the upload of screenshots...
[✔] Waiting for all the screenshots to finish being processed... 
[11:01:09]: Successfully uploaded all screenshots
[✔] Sorting screenshots uploaded... 
[11:01:10]: Successfully uploaded screenshots to App Store Connect
[11:01:10]: Uploading binary to App Store Connect
[11:01:10]: Going to upload updated app to App Store Connect
[11:01:10]: This might take a few minutes. Please don't interrupt the script.
[11:01:47]: --------------------------------------------------------------------
[11:01:47]: Successfully uploaded package to App Store Connect. It might take a few minutes until it's visible online.
[11:01:47]: --------------------------------------------------------------------
[11:01:47]: Finished the upload to App Store Connect
[11:01:47]: Running precheck before submitting to review, if you'd like to disable this check you can set run_precheck_before_submit to false
[11:01:47]: Making sure we pass precheck 👮‍♀️ 👮 before we submit  🛫

+-----------------------------------------------------+
|            Summary for precheck 2.220.0             |
+--------------------------+--------------------------+
| default_rule_level       | warn                     |
| include_in_app_purchases | false                    |
| app_identifier           | org.appfair.app.Showcase |
| api_key_path             | fastlane/apikey.json     |
| username                 | appfair@appfair.org      |
| platform                 | ios                      |
| use_live                 | false                    |
+--------------------------+--------------------------+

[11:01:47]: Creating authorization token for App Store Connect API
[11:01:47]: Checking app for precheck rule violations
[11:01:51]: ✅  Passed: No negative  sentiment
[11:01:51]: ✅  Passed: No placeholder text
[11:01:51]: ✅  Passed: No mentioning  competitors
[11:01:51]: ✅  Passed: No future functionality promises
[11:01:51]: ✅  Passed: No words indicating test content
[11:01:51]: ✅  Passed: No curse words
[11:01:51]: ✅  Passed: No words indicating your IAP is free
[11:01:51]: ✅  Passed: Incorrect, or missing copyright date
[11:01:51]: ✅  Passed: No broken urls
[11:01:51]: precheck 👮‍♀️ 👮  finished without detecting any potential problems 🛫
[11:01:51]: Selecting the latest build...
[11:01:51]: Waiting for processing on... app_id: 6474885022, app_version: 1.0.3, build_version: 103, platform: IOS
[11:01:52]: Read more information on why this build isn't showing up yet - https://github.com/fastlane/fastlane/issues/14997
[11:01:52]: Waiting for the build to show up in the build list - this may take a few minutes (check your email for processing issues if this continues)
[11:02:07]: Waiting for the build to show up in the build list - this may take a few minutes (check your email for processing issues if this continues)
[11:02:22]: Waiting for the build to show up in the build list - this may take a few minutes (check your email for processing issues if this continues)
[11:02:37]: Waiting for the build to show up in the build list - this may take a few minutes (check your email for processing issues if this continues)
[11:02:54]: Waiting for App Store Connect to finish processing the new build (1.0.3 - 103) for IOS
[11:03:10]: Waiting for App Store Connect to finish processing the new build (1.0.3 - 103) for IOS
[11:03:26]: Waiting for App Store Connect to finish processing the new build (1.0.3 - 103) for IOS
[11:03:42]: Successfully finished processing the build 1.0.3 - 103 for IOS
[11:03:42]: Selecting build 1.0.3 (103)...
[11:03:44]: Successfully selected build
[11:03:45]: Successfully updated IDFA declarations on App Store Connect
[11:03:46]: Successfully updated contents rights declaration on App Store Connect
[11:04:01]: Successfully submitted the app for review!

+------------------------------------------+
|             fastlane summary             |
+------+---------------------+-------------+
| Step | Action              | Time (in s) |
+------+---------------------+-------------+
| 1    | default_platform    | 0           |
| 2    | Switch to assemble  | 0           |
|      | lane                |             |
| 3    | build_app           | 65          |
| 4    | upload_to_app_store | 185         |
+------+---------------------+-------------+

[11:04:01]: fastlane.tools finished successfully 🎉

</code>
</pre>
</div>
</details>

### Fastlane Example (Android) {#fastlane_sample_android}

A sample session for Android will look like:

<details>
<summary><code>fastlane release</code></summary>
<div class="highlight">
<pre class="highlight" style="line-height: 1.0">
<code>
zap skipapp-showcase/Android % fastlane release
[✔] 🚀 
[15:29:48]: Get started using a Gemfile for fastlane https://docs.fastlane.tools/getting-started/ios/setup/#use-a-gemfile
[15:29:48]: ------------------------------
[15:29:48]: --- Step: default_platform ---
[15:29:48]: ------------------------------
[15:29:48]: ------------------------------
[15:29:48]: --- Step: default_platform ---
[15:29:48]: ------------------------------
[15:29:48]: Driving the lane 'release' 🚀
[15:29:48]: -------------------------------------
[15:29:48]: --- Step: Switch to assemble lane ---
[15:29:48]: -------------------------------------
[15:29:48]: Cruising over to lane 'assemble' 🚖
[15:29:48]: ---------------------------
[15:29:48]: --- Step: bundleRelease ---
[15:29:48]: ---------------------------
[15:29:48]: $ /opt/homebrew/bin/gradle bundleRelease -p .
[15:29:53]: ▸ [0/1] Planning build
[15:29:53]: ▸ [1/1] Compiling plugin Create SkipLink
[15:29:53]: ▸ [2/2] Compiling plugin skipstone
[15:29:53]: ▸ Building for debugging...
[15:29:53]: ▸ [2/8] Write sources
[15:29:53]: ▸ [3/13] Write swift-version--58304C5D6DBC2206.txt
[15:29:53]: ▸ note: Skip 0.8.46: transpile plugin to: /srcroot/skipapp-showcase/.build/plugins/outputs/skip-unit/SkipUnit/skipstone/SkipUnit/src/main at 15:29:53
…
[15:30:13]: ▸ > Task :app:processReleaseManifest
[15:30:13]: ▸ > Task :app:mergeReleaseArtProfile UP-TO-DATE
[15:30:13]: ▸ > Task :app:processApplicationManifestReleaseForBundle
[15:30:13]: ▸ > Task :app:mergeReleaseAssets UP-TO-DATE
[15:30:13]: ▸ > Task :app:mergeReleaseNativeLibs NO-SOURCE
[15:30:13]: ▸ > Task :app:stripReleaseDebugSymbols NO-SOURCE
[15:30:13]: ▸ > Task :app:extractReleaseNativeSymbolTables NO-SOURCE
[15:30:13]: ▸ > Task :app:processReleaseManifestForPackage
[15:30:13]: ▸ > Task :app:processReleaseResources
[15:30:14]: ▸ > Task :app:bundleReleaseResources
[15:30:14]: ▸ > Task :skipstone:Showcase:compileReleaseKotlin
[15:30:14]: ▸ > Task :skipstone:Showcase:compileReleaseJavaWithJavac NO-SOURCE
[15:30:14]: ▸ > Task :skipstone:Showcase:mergeReleaseGeneratedProguardFiles UP-TO-DATE
[15:30:14]: ▸ > Task :skipstone:Showcase:exportReleaseConsumerProguardFiles UP-TO-DATE
[15:30:14]: ▸ > Task :skipstone:Showcase:processReleaseJavaRes UP-TO-DATE
[15:30:14]: ▸ > Task :skipstone:Showcase:bundleLibRuntimeToJarRelease
[15:30:14]: ▸ > Task :skipstone:Showcase:bundleLibCompileToJarRelease
[15:30:15]: ▸ > Task :app:compileReleaseKotlin
[15:30:15]: ▸ > Task :app:compileReleaseJavaWithJavac
[15:30:15]: ▸ > Task :app:mergeReleaseGeneratedProguardFiles UP-TO-DATE
[15:30:15]: ▸ > Task :app:processReleaseJavaRes UP-TO-DATE
[15:30:15]: ▸ > Task :app:mergeReleaseJavaResource UP-TO-DATE
[15:30:15]: ▸ > Task :app:expandReleaseArtProfileWildcards
[15:30:45]: ▸ > Task :app:minifyReleaseWithR8
[15:31:05]: ▸ > Task :app:buildReleasePreBundle
[15:31:06]: ▸ > Task :app:compileReleaseArtProfile
[15:31:06]: ▸ > Task :app:packageReleaseBundle
[15:31:08]: ▸ > Task :app:shrinkBundleReleaseResources
[15:31:10]: ▸ > Task :app:signReleaseBundle
[15:31:10]: ▸ > Task :app:produceReleaseBundleIdeListingFile
[15:31:10]: ▸ > Task :app:createReleaseBundleListingFileRedirect UP-TO-DATE
[15:31:10]: ▸ > Task :app:bundleRelease
[15:31:10]: ▸ BUILD SUCCESSFUL in 1m 21s
[15:31:10]: ▸ 169 actionable tasks: 30 executed, 139 up-to-date
[15:31:10]: Cruising back to lane 'release' 🚘
[15:31:10]: ----------------------------------
[15:31:10]: --- Step: upload_to_play_store ---
[15:31:10]: ----------------------------------

+---------------------------------------------------------------------------+
|                        Summary for supply 2.220.0                         |
+------------------------------------+--------------------------------------+
| aab                                | ../.build/Android/app/outputs/bundl  |
|                                    | e/release/app-release.aab            |
| package_name                       | org.appfair.app.Showcase             |
| release_status                     | completed                            |
| track                              | production                           |
| metadata_path                      | ./fastlane/metadata/android          |
| json_key                           | fastlane/apikey.json                 |
| skip_upload_apk                    | false                                |
| skip_upload_aab                    | false                                |
| skip_upload_metadata               | false                                |
| skip_upload_changelogs             | false                                |
| skip_upload_images                 | false                                |
| skip_upload_screenshots            | false                                |
| sync_image_upload                  | false                                |
| track_promote_release_status       | completed                            |
| validate_only                      | false                                |
| check_superseded_tracks            | false                                |
| timeout                            | 300                                  |
| deactivate_on_promote              | true                                 |
| changes_not_sent_for_review        | false                                |
| rescue_changes_not_sent_for_review | true                                 |
| ack_bundle_installation_warning    | false                                |
+------------------------------------+--------------------------------------+

[15:31:11]: Preparing aab at path '../.build/Android/app/outputs/bundle/release/app-release.aab' for upload...
[15:31:28]: Updating track 'production'...
[15:31:29]: Preparing uploads for language 'en-US'...
[15:31:30]: ⬆️ Uploading image file ./fastlane/metadata/android/en-US/images/featureGraphic.png...
[15:31:32]: ⬆️ Uploading image file ./fastlane/metadata/android/en-US/images/icon.png...
[15:31:34]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/phoneScreenshots/1_en-US.png...
[15:31:37]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/phoneScreenshots/2_en-US.png...
[15:31:40]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/phoneScreenshots/3_en-US.png...
[15:31:42]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/phoneScreenshots/4_en-US.png...
[15:31:45]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/sevenInchScreenshots/1_en-US.png...
[15:31:48]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/sevenInchScreenshots/2_en-US.png...
[15:31:50]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/sevenInchScreenshots/3_en-US.png...
[15:31:53]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/sevenInchScreenshots/4_en-US.png...
[15:31:56]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/tenInchScreenshots/1_en-US.png...
[15:31:58]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/tenInchScreenshots/2_en-US.png...
[15:32:01]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/tenInchScreenshots/3_en-US.png...
[15:32:04]: ⬆️  Uploading screenshot ./fastlane/metadata/android/en-US/images/tenInchScreenshots/4_en-US.png...
[15:32:07]: Uploaded all items for language 'en-US'... (37.582534 secs)
[15:32:07]: Uploading all changes to Google Play...
[15:32:10]: Successfully finished the upload to Google Play

+-------------------------------------------+
|             fastlane summary              |
+------+----------------------+-------------+
| Step | Action               | Time (in s) |
+------+----------------------+-------------+
| 1    | default_platform     | 0           |
| 2    | default_platform     | 0           |
| 3    | Switch to assemble   | 0           |
|      | lane                 |             |
| 4    | bundleRelease        | 81          |
| 5    | upload_to_play_store | 59          |
+------+----------------------+-------------+

[15:32:10]: fastlane.tools finished successfully 🎉
</code>
</pre>
</div>
</details>

### Troubleshooting Fastlane {#fastlane_troubleshooting}

