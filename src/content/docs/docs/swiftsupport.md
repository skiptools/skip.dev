---
layout: docs
title: Transpilation Reference
permalink: /docs/swiftsupport/
---

Skip's Swift to Kotlin language transpiler is able to convert a large subset of the Swift language into Kotlin. The transpiler has the following goals:

1. Avoid generating buggy code. We would rather give you an immediate error or generate Kotlin that fails to compile altogether than to generate Kotlin that compiles but behaves differently than your Swift source.
1. Allow you to write natural Swift. Swift is a sprawling language; we attempt to supports its most common and useful features so that you can code with confidence.
1. Generate idiomatic Kotlin. Where possible, we strive to generate clean and idiomatic Kotlin from your Swift source. 

These goals form a hierarchy. For example, if generating more idiomatic Kotlin would run the risk of introducing subtle behavioral differences from the source Swift, Skip will always opt for a less idiomatic but bug-free transpilation.

:::tip
Transpilation is not just for Skip Lite apps. It is also used for bridging between native Swift and Java/Kotlin transparently. See the [Cross Platform Topics](/docs/platformcustomization/#calling-kotlin-api) reference for more information on the interplay between transpilation and Skip Fuse modules.
:::

## Language Features {#swift-language-features}

The following table details Skip's support for transpiling various Swift language features. A ✓ indicates that a feature is fully or very strongly supported. A ~ indicates that a feature is partially supported. And a ✕ indicates that a feature is not supported, or is only weakly supported. Future releases may address some unsupported language features, but others reflect deep incompatibilities between the Swift and Kotlin languages.

- ✓ Classes 
    - ✓ Inheritance
    - ✓ `Codable` synthesis
- ✓ Structs
    - ✓ Value semantics. See the [Structs](#structs) topic below
    - ✓ Constructor synthesis
    - ✓ `Equatable` synthesis 
    - ✓ `Hashable` synthesis 
    - ✓ `Codable` synthesis 
- ✓ Protocols
    - ✓ Inheritance
    - ✓ Property requirements
    - ✓ Function requirements
    - ✓ `where Self == Type`
    - ~ Constructor requirements. Limited support when combined with [Generics](#generics)
    - ~ Static requirements. Limited support when combined with [Generics](#generics)
- ✓ Enums
    - ✓ Enums with associated values
    - ✓ `RawRepresentable` synthesis
    - ✓ `CaseIterable` synthesis 
    - ✓ `Equatable` synthesis 
    - ✓ `Hashable` synthesis 
    - ~ `Codable` synthesis 
        - Skip can only synthesize `Codable` conformance for `RawRepresentable` enums
- ✓ Nested types
    - ✓ Types defined within types
    - ✕ Types defined within functions
- ✓ Extensions
    - ✓ Concrete type extensions 
    - ✓ Protocol extensions 
    - ~ Limits on [generic specialization](#generics)
    - ~ Limits on extending types defined in other modules
- ✓ Generic types
    - ~ See the [Generics](#generics) topic below for limitations
- ✓ Tuples
    - ✓ Labeled or unlabeled
    - ✓ Destructuring 
    - ✓ Arity 2 through 5
    - ✕ Arity 6+
- ✓ Typealiases
    - ✓ Nested typealiases
        - Skip fully resolves typealiases during transpilation to work around Kotlin typealias limitations 
- ✓ Properties
    - ✓ `let`
    - ✓ `var`
    - ✓ Static properties 
    - ✓ Stored properties
    - ✓ Computed properties
    - ✓ Throwing properties
    - ✓ Lazy properties
    - ✓ Custom get/set 
    - ✓ `willSet`
    - ✓ `didSet`
    - ✓ SwiftUI property wrappers: `@State`, `@Environment`, etc
    - ✕ Custom property wrappers
- ✓ Functions
    - ✓ Overloading on types
    - ✓ Overloading on param labels
    - ✕ Overloading on return type 
    - ✓ Static functions
    - ✓ Generic functions
    - ✓ Throwing functions 
    - ✓ `self` assignment in mutable functions 
    - ✓ Default parameter values
    - ✓ `inout` parameters
    - ✓ Closures and trailing closures
    - ✓ Variadic parameters
    - ✕ `@autoclosure` parameters
    - ✕ Parameter packs
- ✓ Nested functions
- ✓ Constructors 
    - ✓ Optional constructors
    - ✓ `self` assignment in constructors 
    - ~ Kotlin imposes some limitations on calling `super.init` or `self.init` in a delegating constructor
    - ✕ Constructors cannot use generic parameter types that are not declared by the owning type
- ✓ Deconstructors 
    - ~ `deinit` is transpiled into Kotlin's `finalize`. See the [Garbage Collection](#garbage-collection) topic
- ✓ Closures
    - ✓ Explicit and implicit (`$0`, `$1`, etc) parameters
    - ~ Weak and unowned capture is ignored. We rely on Kotlin [garbage collection](#garbage-collection)
- ✓ Error handling
    - ✓ `throw`
    - ✓ `do / catch`
    - ✓ `try, try?, try!`
    - ✓ Throw custom enums, structs, classes 
    - ✓ Catch pattern matching
    - ✕ Error types cannot be subclasses
- ✓ Concurrency
    - ✓ `Task` / `Task.detached`
    - ✓ Task groups
    - ✓ `async / await`
    - ~ `async let`
        - The implicit task group is not cancelled when exiting scope
    - ✓ Async functions
    - ✓ Async properties
    - ✓ Async closures
    - ✓ `AsyncSequence`
    - ✓ `AsyncStream`
    - ✓ `@MainActor` 
    - ~ Custom actors
        - Non-private mutable properties not supported. Expose functions to access private state
    - ✕ Grand Central Dispatch
- ✓ Defer
- ✓ If
    - ✓ `if let`
        - See the [If let](#if-let) topic for additional information
    - ✓ `if case`
- ✓ Guard
    - ✓ `guard let`
        - See the [If let](#if-let) topic for additional information
    - ✓ `guard case`
- ✓ Switch 
    - ✓ Case pattern matching
    - ✓ Case binding 
    - ~ Limits on partial matching and binding
    - ✕ `case … where`
- ✓ While loop 
- ✓ Do while loop
- ✓ For in loop
    - ✓ `for … in … where …`
    - ✓ `for let …`
    - ✓ `for case …`
- ✓ Operators
    - ✓ Standard operators
    - ✓ Logical operators 
    - ✓ Optional chaining
    - ✓ Optional unwrapping
    - ✓ Range operators
    - ~ Slice operators
        - Slices are not mutable
    - ~ Some advanced operators not supported
    - ✓ Custom `Equatable` with `==`
    - ✓ Custom `Hashable` with `hash(into:)`
    - ✓ Custom `Comparable` with `<`
    - ~ Custom subscript operators
        - Cannot overload subscript operators on parameter labels or types
    - ✓ `callAsFunction` support
    - ✕ Other custom operators
- ~ Key paths
    - ✓ As implicit closure parameters
    - ✓ As `@Environment` keys
    - ✕ Other uses
- ✕ Macros
    - ✓ `@Observable`
    - ✓ `@ObservationIgnored`
    - ✕ Other macros

---

## Builtin Types {#swift-types}

The following table details Skip's support for using builtin Swift standard library types in transpiled code. Support for these types is divided between the Skip language transpiler and the SkipLib open source library.

:::caution
**Not all API is available on all types.** Consult the [SkipLib library](/docs/modules/skip-lib/) for current status.
:::

- ✓ Numeric types
    - ✓ Use Kotlin native types 
    - ~ `Int` is 32 bit on JVM
    - ~ All unsigned and `Float` values must be explicit - e.g. `Float(1.0)`; no implicit conversion from signed types or `Double`
- ✓ `String`
    - ✓ Uses Kotlin native `String` 
    - ✕ Mutation is not supported
- ✓ `Any`, `AnyObject`
- ✓ Optionals
    - ✕ Kotlin does not represent `Optional` as its own type, so `.some` and `.none` do not exist
- ✕ Compound types (e.g. `A & B`)
- ✓ `Array`
    - ✓ Value semantics
    - ✓ Slicing
- ✓ `Dictionary`
    - ✓ Value semantics
- ✓ `Set`
    - ✓ Value semantics
- ✓ `OptionSet`
    - ~ You must implement `OptionSet` with a `struct`
- ✓ `CaseIterable`
    - ✓ Automatic synthesis
    - ✓ Custom implementations
- ✓ `Codable`
    - ✓ Automatic synthesis
    - ✓ Custom implementations
- ✓ `CustomStringConvertible`
- ✓ `Comparable`
    - ✓ Automatic synthesis
    - ✓ Custom implementations
- ✓ `Equatable`
    - ✓ Automatic synthesis
    - ✓ Custom implementations
- ✓ `Error`
- ✓ `Hashable`
    - ✓ Automatic synthesis
    - ✓ Custom implementations
- ✓ `RawRepresentable`
    - ✓ Automatic synthesis
    - ✓ Custom implementations
- ✓ `Result``
- ~ Result builders
    - ✓ `@ViewBuilder`
        - The `@ViewBuilder` attribute is not inherited when overriding API other than `View.body`. Specify it explicitly
    - ✕ Other result builders

---

## Special Topics {#special-topics}

The Skip transpiler performs a large number of interesting code transformations to bridge the differences between Swift and Kotlin. The following sections address particular areas that deserve some explanation, either because the transpilation affects the behavior of your code, or because the resulting Kotlin is unusual in some way.

### Numeric Types

Numeric types are a particularly common source of subtle runtime and compilation problems in dual-platform apps. Runtime issues may arise because Kotlin `Ints` are 32 bits. Technically Swift `Ints` can be either 32 or 64 bits depending on the hardware, but all of Apple's recent devices are 64 bit, so Swift programmers tend to assume 64 bit integers. Take care to use `Int64` when your code demands more than 32 bit integer values. In Java, overflowing the 32 bit range does not cause an error condition like in Swift, but instead silents wraps `Int.max` around to `Int.min`, making such issues a potential cause of hidden bugs.

You may also experience Android compilation problems because Kotlin can be picky about converting between numeric types. In general, you should be explicit when using any types other than `Int` and `Double`. For example, if `var f` is a `Float`, write `f = Float(1.0)` rather than `f = 1.0`. Also, although `Int` and `Double` do not need explicit casts, Kotlin does not allow you to assign an integer literal to a double variable or parameter. For example, if `var d` is a `Double`, Kotlin requires you to write `d = 1.0` rather than `d = 1`. Skip attempts to convert your integer literals to decimals when needed, but there may be times when you'll have to write your `Double` values as `1.0` rather than `1`.

### Other Primitive Types

Skip does not wrap Kotlin's primitive types. We have chosen the massive efficiency and interoperability wins that come with using Kotlin's primitive types directly over the additional Swift language compatibility we might be able to achieve if we wrapped Kotlin's primitives in our own classes.

This means that we have to live with Kotlin's primitive types as-is, and they have some limitations that will impact your code. The most significant is that these types are immutable. Functions like `Bool.toggle()` are not supported, and **Strings are immutable** in Skip code. Rather than `append`ing to a `String` in place, you must create a new string. Rather than calling `String.sort()`, you must call `let sorted = string.sorted()`, etc. Additionally, **Strings are not Collections**. While we have added the `Collection` API to `String`, there is no way to add a new protocol to an existing Kotlin type. So while you can make all the `Collection` API calls you're used to, you cannot pass a `String` to code that expects a `Collection<Character>`.

### Garbage Collection {#garbage-collection}

Swift uses automatic reference counting to determine when to free memory for an object. Kotlin uses garbage collection. This difference has important consequences that you should keep in mind:

- On Android, your `deinit` functions will be called at an indeterminate time, and may not be called at all. While Swift calls `deinit` functions and deallocates memory as soon as an object's reference count reaches zero, the timing of these tasks on Android is entirely at the discretion of the garbage collector.
- The Android garbage collector can detect and cleanup reference cycles. In Swift, the most common uses of the `weak` and `unowned` modifiers are to avoid strong reference cycles. This is not a problem in Kotlin, and Kotlin therefore does not have these modifiers. Skip has chosen to ignore `weak` and `unowned` modifiers on properties and in closure capture lists, relying on the garbage collector instead. If you were planning to use a `weak` or `unowned` reference for reasons *other* than avoiding a strong reference cycle, you should consider alternatives.

### Structs {#structs}

All Kotlin objects are reference types. Apart from primitives like `Int`, there are no value types. In order to allow you to use Swift structs but ensure identical behavior in your Android programs, Skip employs its own `MutableStruct` protocol.

Skip automatically adds the `MutableStruct` protocol to all mutable struct types. It uses the functions of this protocol to give Kotlin classes value semantics. You will notice this when you examine any Kotlin transpiled from Swift that uses mutable struct types:

- The Kotlin classes for your mutable struct types will adopt the `MutableStruct` protocol and implement its required functions.
- You will see calls to `.sref()` sprinkled throughout your code. This stands for *struct reference*. Skip adds `sref()` calls when it is necessary to copy Kotlin objects representing structs in order to maintain value semantics - e.g. when assigning a struct to a variable.
- Properties that hold mutable struct types will gain custom getter and setter code to copy the value on the way in and out as needed.
- Functions that return mutable struct types will `sref()` the value being returned.

While modern virtual machines are very good at managing large numbers of objects, in extreme cases you might want to modify your code to avoid excessive copying. We recommend that you do not worry about it until you see a performance problem.

For cases in which a struct is technically mutable but is never modified after you set its properties once - i.e. a configuration object - add the `@nocopy` attribute. This instructs Skip to treat the struct as immutable and avoid copying.

```swift
// SKIP @nocopy
struct S {
    …
}
```

### Generics

There's no getting around it: Swift generics are complicated. And converting from Swift generics to Kotlin generics is even more so, because the two languages have very different generic implementation strategies. Swift generics are built deep into the language as first-class citizens of its type system. Kotlin generics, on the other hand, don't exist at the JVM level and are only present at compile time.

This difference has far-reaching effects. For example, because generics are built into Swift's type system, `Dictionary<Int, String>.Entry` is a Swift type. But in Kotlin, the equivalent type is `Dictionary.Entry<Int, String>`. When it is used as a scope for other types or even static members, `Dictionary`'s generics disappear.

Fortunately, Skip is able to bridge enough of the divergence between the languages that you may not run into issues in normal, day-to-day use. Skip fully supports:

- ✓ Using built-in generic data structures like `Array`, `Dictionary`, and `Set`
- ✓ Defining your own generic classes, structs, enums
- ✓ Defining and conforming to protocols with `associatedtypes`
- ✓ Generic functions
- ✓ Generic constraints such as `where T: Equatable`

But there are limits to the incompatibilities that Skip can overcome. The following features are not well supported:

- ~ Static members of generic types are limited. Skip can only support static members that either don't use the defining type's generics or that can be converted into a generic function that is defined independently of the defining type's generics
- ~ Generic specialization by type extensions (e.g. `extension C where T: Equatable`) is limited
- ✕ Inner types on generic outer types are not supported - see the `Dictionary` example above
- ✕ Kotlin does not allow constructor functions to use generics other than those of the defining type
- ✕ Kotlin does not allow `typealiases` to include generic constraints (e.g. `where T: Equatable`)
- ✕ `is` testing and `as?` casts do not consider the generic portions of type signatures, because the generic types don't exist at runtime

The Skip transpiler generally detects unsupported patterns and provides an appropriate error message. You may, however, run into additional limitations as well. Our general advice is to take advantage of generics for straightforward use cases, but to avoid complex generics definitions and constraints.

#### Reified Types

One way to preserve generic information in Kotlin is to use inline functions with *reified types*. You can read more about this topic in the [Kotlin language documentation](https://kotlinlang.org/docs/inline-functions.html#reified-type-parameters). Skip automatically converts any Swift function with the `@inline(__always)` attribute into a Kotlin inline function with reified generics.

```swift
@inline(__always) public func f<T>(param: T) {
   ...
}
```

Transpiles to:

```kotlin
inline fun <reified T> f(param: T) {
    ...
} 
```

### Concurrency

Skip does not support Grand Central Dispatch. Rather, it supports Swift's modern concurrency with `async` and `await`, `Task` and `TaskGroup`, and actors.

Note that neither `@MainActor` nor custom actors are features of Kotlin. Skip supports actors by adding its own calls to jump to and from the actor's isolated context. You will see these inserted calls in the generated Kotlin, and they may look surprising.

Currently `@MainActor` is not automatically inherited from superclass and protocol members. Add the attribute to all overrides explicitly. Skip does, however, make an exception for `View.body` - your `View` bodies will automatically be `@MainActor`-bound.

### Enums and case matching

Skip transpiles enums to Kotlin enums, along with creating similar case statements. There are some comlpex case matching constructions that Kotlin doesn't support, meaning you would need to find and alternative way of expressing the logic in Swift. These limitation assume:

1. Cannot translate compound case matches with associated values, like `case .caseA(let value), .caseB(let value):`
1. Cannot translate case matches that also conditionally check values, like `case .caseA(let value) where value == "X"`


### If Let {#if-let}

Swift's `if let x = f()` (or `guard let x = f()`) syntax does a few things at the same time:

1. Executes `f()` exactly once.
1. Tests that the value is not `nil`.
1. Binds the value to a new variable with the appropriate scope.

While Kotlin's `if (x != null)` checks do have some intelligence - Kotlin will *usually* let you treat `x` as non-null in the body of of the `if` block - there is no Kotlin language construct that can do all of the things `if let` does. Depending on the details of how your Swift code uses `if let`, therefore, Skip may have to generate a significant amount of Kotlin to ensure identical behavior across platforms. This includes generating nested `if` statements and potentially duplicating entire `else` code blocks. While the resulting Kotlin may look complicated, it is no less efficient than the original Swift.

