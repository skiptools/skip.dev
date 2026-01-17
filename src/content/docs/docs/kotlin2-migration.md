---
layout: docs
title: Kotlin 2 Migration
permalink: /docs/kotlin2-migration/
---

<!--
Keep this document here although we also have it in our update guide, because our tooling links to it
-->

Kotlin 2 introduces many improvements to the Kotlin language, as well as integration of the Compose compiler into the Kotlin compiler itself[^1]. Skip 0.9.2 adopts Kotlin 2 as the target language, which involves some changes to the Gradle project that Skip creates[^2]. Internally, this involves changing some of the dependencies that Skip adds to the Android Gradle project.

[^1]: Jetpack Compose compiler moving to the Kotlin repository: [https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)

[^2]: Migrating a Jetpack Compose project: [https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-jetpack-compose-project](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-jetpack-compose-project)

These changes are, for the most part, transparent to Skip framework projects. But Skip app projects that were created before Skip 0.9.2 will need to make a couple of changes in order to work with the new Compose compiler.

To upgrade a Skip app project, open the `Android/app/build.gradle.kts` file in any text editor (e.g., Xcode, Android Studio, or TextEdit), and make the following changes:

1. Add `alias(libs.plugins.kotlin.compose)` to the `plugins { }` block
2. Remove the `kotlinCompilerExtensionVersion = libs.versions.kotlin.compose.compiler.extension.get()` from the `composeOptions { }` block

The `skip-build-plugin`, which is included in all Skip app projects created with `skip init`, will provide helpful error messages if it detects that your project needs to be updated:

![Xcode error messages for Skip project that needs upgrading](https://assets.skip.dev/screens/kotlin2-migration-xcode.png){: style="width: 100%;"}
{: style="text-align: center; margin: auto;"}

## Required Changes to Android/app/build.gradle.kts

A condensed comparison of the changes needed to be made to the `Android/app/build.gradle.kts` follows. For a complete example, you can reference the build file for the `skip-hello` app: [https://source.skip.tools/skipapp-hello/blob/main/Android/app/build.gradle.kts](https://source.skip.tools/skipapp-hello/blob/main/Android/app/build.gradle.kts).

Before:

```kotlin
plugins {
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.android.application)
    id("skip-build-plugin")
}

android {
    namespace = group as String
    compileSdk = libs.versions.android.sdk.compile.get().toInt()
    compileOptions {
        sourceCompatibility = JavaVersion.toVersion(libs.versions.jvm.get())
        targetCompatibility = JavaVersion.toVersion(libs.versions.jvm.get())
    }
    
    defaultConfig {
        minSdk = libs.versions.android.sdk.min.get().toInt()
        targetSdk = libs.versions.android.sdk.compile.get().toInt()
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = libs.versions.kotlin.compose.compiler.extension.get()
    }
}
```

After:

```kotlin
plugins {
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose) // this line added
    alias(libs.plugins.android.application)
    id("skip-build-plugin")
}

android {
    namespace = group as String
    compileSdk = libs.versions.android.sdk.compile.get().toInt()
    
    compileOptions {
        sourceCompatibility = JavaVersion.toVersion(libs.versions.jvm.get())
        targetCompatibility = JavaVersion.toVersion(libs.versions.jvm.get())
    }
    
    kotlinOptions {
        jvmTarget = libs.versions.jvm.get().toString() // this line added
    }
    
    defaultConfig {
        minSdk = libs.versions.android.sdk.min.get().toInt()
        targetSdk = libs.versions.android.sdk.compile.get().toInt()
    }
    
    composeOptions {
        // kotlinCompilerExtensionVersion = libs.versions.kotlin.compose.compiler.extension.get() // this line removed
    }
}
```


## Troubleshooting

### Error: Inconsistent JVM-target compatibility detected for tasks 'compileDebugJavaWithJavac' (17) and 'compileDebugKotlin' (22).

The same JVM target must be used across the entire Gradle project, which includes both your own app as well as any and all Skip dependencies. This was done automatically using the `compileOptions` block's `sourceCompatibility` and `targetCompatibility` properties, but now it also needs to be added to the `kotlinOptions` block using the `jvmTarget` property. Edit your `build.gradle.kts` file like so:

```kotlin
android {
    compileOptions {
        sourceCompatibility = JavaVersion.toVersion(libs.versions.jvm.get())
        targetCompatibility = JavaVersion.toVersion(libs.versions.jvm.get())
    }

    kotlinOptions {
        jvmTarget = libs.versions.jvm.get().toString() // this line added
    }
}
```

### Error: Exception during IR lowering

This is the error that occurs when the Compose compiler plugin has not been added to the apps's `Android/app/build.gradle.kts` file. Make sure you've followed the instructions in this migration guide to fix the error.

A condensed representation of this error is as follows:

```
e: org.jetbrains.kotlin.backend.common.BackendException: Backend Internal error: Exception during IR lowering
> Task :app:compileDebugKotlin FAILED
File being compiled: /opt/src/github/skiptools/skipapp-hello/Android/app/src/main/kotlin/hello/skip/Main.kt
The root cause java.lang.RuntimeException was thrown at: org.jetbrains.kotlin.backend.jvm.codegen.FunctionCodegen.generate(FunctionCodegen.kt:50)
    at org.jetbrains.kotlin.backend.common.CodegenUtil.reportBackendException(CodegenUtil.kt:253)
    at org.jetbrains.kotlin.backend.common.CodegenUtil.reportBackendException$default(CodegenUtil.kt:236)
    at org.jetbrains.kotlin.backend.common.phaser.PerformByIrFilePhase.invokeSequential(performByIrFile.kt:65)
    …
Caused by: java.lang.RuntimeException: Exception while generating code for:
FUN LOCAL_FUNCTION_FOR_LAMBDA name:PresentationRootView$lambda$1 visibility:private modality:FINAL <> (ctx:skip.ui.ComposeContext) returnType:kotlin.Unit?
  VALUE_PARAMETER name:ctx index:0 type:skip.ui.ComposeContext
  BLOCK_BODY
    VAR name:contentContext type:skip.ui.ComposeContext [val]

```
