---
layout: docs
title: Bridging Reference
permalink: /docs/bridging/
---

Skip's [documentation](/docs/modes/#bridging) describes Skip's technology for bridging between compiled Swift and transpiled Swift or Kotlin and Java. This reference details the Swift language features and types that can be bridged. Bridging capabilities are symmetrical unless otherwise noted. That is, if something is marked as bridgeable, then you can use it whether you are bridging from native Swift to Kotlin/Java, or from transpiled Kotlin/Java to native Swift.

## Language Features

The following table details Skip’s support for bridging various Swift language features. A ✓ indicates that a feature is fully or very strongly supported. A ~ indicates that a feature is partially supported. And a ✕ indicates that a feature is not supported, or is only weakly supported. Future releases may address some unsupported language features, but others reflect deep incompatibilities between the Swift and Kotlin languages and runtimes.

- ✓ Classes 
    - ✓ Inheritance - up to 4 levels
- ✓ Structs - see the [Mutable Structs](#structs) topic below
    - ✓ Constructor synthesis
    - ✓ `Equatable` synthesis 
    - ✓ `Hashable` synthesis 
- ✓ Protocols
    - ✓ Inheritance
    - ✓ Property requirements
    - ✓ Function requirements
    - ✕ Constructor requirements
    - ✕ Static requirements
- ✓ Enums
    - ✓ Enums without associated values
    - ✓ Enums with associated values
    - ✕ Mutating properties and functions
- ✓ Nested types
- ~ Extensions
    - ✓ Concrete type extensions
    - ~ Protocol extensions
    - ✓ Extending a type within the current module
    - ~ Extending a type in another module (Kotlin to Swift only)
- ~ Generic types - see the [Generics](#generics) topic below
- ✓ Tuples - up to 5 elements
    - ✕ Not supported as collection elements or closure parameters
- ✓ Typealiases
- ✓ Properties
    - ✓ Globals
    - ✓ Members
    - ✓ `let`
    - ✓ `var`
    - ✓ Static properties 
    - ✓ Stored properties
    - ✓ Computed properties
    - ✓ Throwing properties
    - ✕ Lazy properties
- ✓ Functions
    - ✓ Globals
    - ✓ Members
    - ✓ Overloading on types
    - ✓ Overloading on param labels
    - ✕ Overloading on return type 
    - ✓ Static functions
    - ~ Generic functions - see the [Generics](#generics) topic below
    - ✓ Throwing functions 
    - ✓ Default parameter values
    - ✕ `inout` parameters
    - ✕ Variadic parameters
    - ✕ `@autoclosure` parameters
    - ✕ Parameter packs
- ✓ Constructors 
    - ✕ Optional constructors
- ✓ Deconstructors 
- ✓ Closures - up to 5 parameters
    - ✕ Not supported as collection elements or parameters to other closures
- ✓ Errors - see the [Errors](#errors) topic below
- ~ Concurrency
    - ✓ Async functions
    - ✓ Async properties
    - ✓ Async closures
    - ✓ `@MainActor`
    - ✓ Custom actors
        - Non-private mutable properties not supported. Use functions to mutate state
- ~ Operators
    - ✓ Custom `Equatable` with `==`
    - ✓ Custom `Hashable` with `hash(into:)`
    - ✓ Custom `Comparable` with `<`
    - ✕ Custom subscript operators
    - ✕ `callAsFunction` support
    - ✕ Other custom operators
- ✕ Key paths

## Builtin Types

The following table details Skip’s support for bridging builtin Swift standard library types.

- ✓ `Any`
- ✓ `AnyHashable`
- ✓ `AnyObject`
- ✓ `Bool`
- ✕ `Character`
- ✓ Numeric types
    - ~ `Int` and `UInt` are 32 bit on JVM
- ✓ `String`
- ✓ Optionals
- ✕ Compound types (e.g. `A & B`)
- ✓ Fully-qualified Kotlin/Java types - translate to `AnyDynamicObject`
- ✓ `Array` - translates to `kotlin.collections.List` in `kotlincompat` mode
- ✓ `AsyncStream` - translates to `kotlinx.coroutines.flow.Flow` in `kotlincompat` mode
- ✓ `AsyncThrowingStream<*, Error>` - translates to `kotlinx.coroutines.flow.Flow` in `kotlincompat` mode
- ✓ `Data` - translates to `[byte]` in `kotlincompat` mode
- ✓ `Date` - translates to `java.util.Date` in `kotlincompat` mode
- ✓ `Dictionary` - translates to `kotlin.collections.Map` in `kotlincompat` mode
- ✓ `Error` - translates to `kotlin.Throwable` in `kotlincompat` mode
- ✓ `NSNumber` - translates to `java.lang.Number`
- ✕ `OptionSet`
- ✓ `Result` - translates to `kotlin.Pair<Success?, Failure?>` in `kotlincompat` mode
- ✓ `Set` - translates to `kotlin.collections.Set` in `kotlincompat` mode
- ✓ `2-Tuple` - translates to `kotlin.Pair` in `kotlincompat` mode
- ✓ `3-Tuple` - translates to `kotlin.Triple` in `kotlincompat` mode
- ✓ `URL` - translates to `java.net.URI` in `kotlincompat` mode
- ✓ `UUID` - translates to `java.util.UUID` in `kotlincompat` mode

## Special Topics

### Equality

**Do not** rely on object identity and `===` comparisons of bridged instances. The same object may get wrapped by multiple bridging instances. Because Kotlin/Java types have built-in `equals` and `hashCode` functions that default to using identity, Skip's Kotlin projections of your native types will implement `equals` and `hashCode` so that wrappers around the same native instance will compare equal and have the same hash. 

Skip supports bridging of `Equatable`, `Hashable`, and `Comparable` types, so you should implement these protocols for any additional needs.

### Errors

Skip supports bridging your custom `Error` types as well as functions that may throw errors. Keep in mind the following: 

- Any `Error`-conforming type will extend `Exception` when translated to Kotlin, so your bridged Swift `Error` types cannot be subclasses.
- You can bridge functions that throw `Error` types that are not themselves bridged. You must treat these throwing functions as if they might throw any error at all: use general `catch` blocks that do not rely on catching a specific type of error.

### Generics

Kotlin and Swift have very different generic implementation strategies. Swift generics are built deep into the language as first-class citizens of its type system. Kotlin generics, on the other hand, don't exist at the JVM level and are only present at compile time. Additionally, the Java Native Interface (JNI) API that allows Swift and Kotlin to communicate is based on the C language, which has no generics at all. This makes it impossible to preserve generic information across the JNI boundary. 

All of these factors conspire to limit the bridging of generic functions and types. Whether bridging from compiled Swift to Kotlin or vice versa, the following restrictions apply:

- You cannot bridge a subclass of a generic type.
- Static members of generic types are limited. Skip can only support static members that either don't use the defining type's generics or that can be converted into a generic function that is defined independently of the defining type's generics.
- Generic specializations by type extensions (e.g. `extension C where T: Equatable`) cannot be bridged.
- Inner types on generic outer types are not supported.
- Kotlin does not allow constructor functions to use generics other than those of the defining type.
- Kotlin does not allow `typealiases` to include generic constraints (e.g. `where T: Equatable`).

Bridging from transpiled Kotlin to compiled Swift has this additional limitation:

- If a transpiled Kotlin generic type is returned from a property or function whose exact type is unknown (i.e. is of type `Any` or is a protocol type, etc), the exact typing is lost in the transfer to Swift. For example if an instance of `C<T>` is read from a bridged Kotlin `Any` property, the Swift side will receive an instance of `C<Any>`, regardless of `T`'s type on the Kotlin side. Similarly, `C<T: P>` will bridge from an `Any` field as `C<P>`.  

This does not apply when bridging the other direction, from compiled Swift to Kotlin. That direction, however, has the following restrictions instead:

- You cannot construct instances of a bridged Swift generic type from Kotlin. So your Swift code can create and expose generic types to Kotlin, but your Kotlin code has no way to construct Swift generic instances. You must comment any public constructors on Swift generic types with `// SKIP @nobridge` so that they are not bridged to Kotlin.
- Kotlin also cannot access static members of Swift generic types. You must comment public static members with `// SKIP @nobridge` as well.
- Global generic functions do not retain generic type information when called from Kotlin. So when called from Kotlin, a global Swift function `f<T>(p: T)` will always be invoked as if `T` is of type `Any`. Similarly, `f<T: P>(p: P)` will always be invoked as if `T` is of type `P`.

### Mutable Structs {#structs}

We only recommend bridging native mutable structs if their projection will be consumed by transpiled Swift, where Skip can maintain value semantics on the Kotlin side. If you plan on using your native types from pure Kotlin or Java code, stick to classes, which mirror Kotlin/Java's reference semantics.

We also recommend against bridging transpiled mutable structs to native Swift, as they require a significant amount of object copying on the JVM side.
