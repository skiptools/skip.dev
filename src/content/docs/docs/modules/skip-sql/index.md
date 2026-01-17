---
title: SQLite
layout: docs
note: This documentation section is derived from https://raw.githubusercontent.com/skiptools/skip-sql/main/README.md using the scripts/syncdocs.sh script. Do not change the file here, change it there.
---

:::note[Source Repository]{icon="github"}
The skip-sql framework is available at [https://github.com/skiptools/skip-sql.git](https://source.skip.tools/skip-sql.git), which can be checked out and tested with `skip test` once Skip is [installed](/docs/gettingstarted/).
:::

The SkipSQL module is a dual-platform [Skip Lite](/docs/status#skip_lite) framework that provides access to sqlite database in Darwin and Android systems.

## Usage

### Connection example

To connect 
```swift
import SkipSQLCore
import SkipSQL

let dbpath = URL.applicationSupportDirectory.appendingPathComponent("db.sqlite")

let ctx = try SQLContext(path: dbpath, flags: [.create, .readWrite], configuration: .platform)
defer { ctx.close() }

try sqlite.exec(sql: "CREATE TABLE IF NOT EXISTS SOME_TABLE (STRING TEXT)")

try sqlite.exec(sql: "INSERT INTO SOME_TABLE (STRING) VALUES (?)", parameters: [SQLValue.text("ABC")])

let rows: [[SQLValue]] = ctx.selectAll(sql: "SELECT STRING FROM SOME_TABLE")
assert(rows[0][0] == SQLValue.text("ABC"))

```

### In-memory databases 

When passing `nil` as the path, the `SQLContext` will reside entirely in memory, and will not persist once the context is closed. This can be useful for unit testing and performing in-memory calculations, or as a temporary engine for calculations and sorting.

```swift
import SkipSQLCore
import SkipSQL

let ctx = try SQLContext(path: nil, configuration: .platform)
defer { ctx.close() }

let rows: [[SQLValue]] = ctx.selectAll(sql: "SELECT 1, 1.1+2.2, 'AB'||'C'")

assert(rows[0][0] == SQLValue.long(1))
assert(rows[0][1] == SQLValue.real(3.3))
assert(rows[0][2] == SQLValue.text("ABC"))

```

### Transactions

Performing multiple operations in the context of a transaction will ensure that either all the operations succeed (`COMMIT`) or fail (`ROLLBACK`) together.

```swift
try ctx.transaction {
    try ctx.exec(sql: "INSERT INTO TABLE_NAME VALUES(1)")
    try ctx.exec(sql: "INSERT INTO TABLE_NAME VALUES(2)")
}
```

The default transaction type is `.deferred`, but it can be specified as a parameter to `transaction` to override the default, or `nil` to perform the operation without a transaction.

### Bound parameters

Retaining a prepared `SQLStatement` will mean that the SQL doesn't need to be re-parsed each time a query or insert/update statement is performed.

SQL statements with a `?` symbol will expect those parameters to be applied with the `bind` function before the statement is executed. 

```swift

let insert = try sqlite.prepare(sql: "INSERT INTO TABLE_NAME (NUM, STR) VALUES (?, ?)")
defer { insert.close() }

// insert 1,000 rows in a single transaction, re-using the insert statement
try sqlite.transaction {
    for i in 1...1_000 {
        let params: [SQLValue] = [
            SQLValue.long(Int64(i)),
            SQLValue.text("Row #\(i)")
        ]
        try insert.update(parameters: params)
    }
}

```


### Schema Migration

There is no built-in support for schema migrations. Following is a part of a sample of how you might perform migrations in your own app.

```swift
// track the version of the schema with the `userVersion` pragma, which can be used for schema migration
func migrateSchema(v version: Int64, ddl: String) throws {
    if ctx.userVersion < version {
        let startTime = Date.now
        try ctx.transaction {
            try ctx.exec(sql: ddl) // perform the DDL operation
            // then update the schema version
            ctx.userVersion = version
        }
        logger.log("updated database schema to \(version) in \(startTime.durationToNow)")
    }
}

// the initial creation script for a new database
try migrateSchema(v: 1, ddl: """
CREATE TABLE DATA_ITEM (ID INTEGER PRIMARY KEY AUTOINCREMENT)
""")
// migrate records to have new description column
try migrateSchema(v: 2, ddl: """
ALTER TABLE DATA_ITEM ADD COLUMN DESCRIPTION TEXT
""")
```

### Concurrency

As a thin layer over a SQLite connection, SkipSQL itself performs no locking or manages threads in any way. It is up to the application layer to set up reader/writer locks, or else just perform all the operations in an isolated context (e.g., using an actor).

The SQLite guide on [Locking And Concurrency](https://www.sqlite.org/lockingv3.html) can provide additional guidance.

## SQLCodable

SkipSQL includes a simple mechanism for mapping Swift types to tables through the `SQLCodable` protocol and `SQLTable` and `SQLColumn` types. An example of a type that implements this is:

```swift
/// A struct that can read and write its values to the `DEMO_TABLE` table.
public struct DemoTable : SQLCodable, Equatable {
    public var id: Int64
    static let id = SQLColumn(name: "ID", type: .long, primaryKey: true, autoincrement: true)

    public var txt: String?
    static let txt = SQLColumn(name: "TXT", type: .text, unique: true, nullable: false, index: SQLIndex(name: "IDX_TXT"))

    public var num: Double?
    static let num = SQLColumn(name: "NUM", type: .real)

    public var int: Int
    static let int = SQLColumn(name: "INT", type: .long, nullable: false)

    public var dbl: Double?
    static let dbl = SQLColumn(name: "DBL", type: .real, defaultValue: SQLValue(Double.pi), index: SQLIndex(name: "IDX_DBL", unique: false))

    public var blb: Data?
    static let blb = SQLColumn(name: "BLB", type: .blob)

    public static let table = SQLTable(name: "DEMO_TABLE", columns: [id, txt, num, int, dbl, blb])

    public init(id: Int64 = 0, txt: String? = nil, num: Double? = nil, int: Int, dbl: Double? = nil, blb: Data? = nil) {
        self.id = id
        self.txt = txt
        self.num = num
        self.int = int
        self.dbl = dbl
        self.blb = blb
    }

    /// Required initializer to create an instance from the given `SQLRow = [SQLColumn: SQLValue]`
    public init(row: SQLRow, context: SQLContext) throws {
        self.id = try Self.id.longValueRequired(in: row)
        self.txt = try Self.txt.textValueRequired(in: row)
        self.num = Self.num.realValue(in: row)
        self.int = try Int(Self.int.longValueRequired(in: row))
        self.dbl = Self.dbl.realValue(in: row)
        self.blb = Self.blb.blobValue(in: row)
    }

    /// Encode the current instance into the given `SQLRow` dictionary.
    public func encode(row: inout SQLRow) throws {
        row[Self.id] = SQLValue(self.id)
        row[Self.txt] = SQLValue(self.txt)
        row[Self.num] = SQLValue(self.num)
        row[Self.int] = SQLValue(self.int)
        row[Self.dbl] = SQLValue(self.dbl)
        row[Self.blb] = SQLValue(self.blb)
    }
}
```

The `init` and `encode` implementations can be used to coerce the primitive SQLite value types into other Swift types. For example, to have a `UUID` property, you might implement it like:

```swift
public struct UUIDHolder : SQLCodable, Identifiable {
    public var id: UUID
    static let id = SQLColumn(name: "ID", type: .text, primaryKey: true)

    public static let table = SQLTable(name: "UUID_HOLDER", columns: [id])

    public init(id: UUID = UUID()) {
        self.id = id
    }

    public init(row: SQLRow, context: SQLContext) throws {
        self.id = try SQLBindingError.checkNonNull(UUID(uuidString: Self.id.textValueRequired(in: row)), in: Self.id)
    }

    public func encode(row: inout SQLRow) throws {
        row[Self.id] = SQLValue(self.id.uuidString)
    }
}
```

### Querying with SQLPredicate

The `SQLPredicate` type enables querying the database for instances of a `SQLCodable` instance. For example:

```swift
// issues: SELECT "ID", "TXT", "NUM", "INT", "DBL", "BLB" FROM "DEMO_TABLE" WHERE ("NUM" IS NULL OR "TXT" = 'ABC')
let predicate = DemoTable.num.isNull().or(DemoTable.txt.equals(SQLValue("ABC")))

let resultSet = try sqlite.query(DemoTable.self).where(predicate).eval()
defer { resultSet.close() }

let cursor = resultSet.makeIterator()
while let row = cursor.next() {
    let instance = try row.get() // instantiate the type from the row
    logger.log("got instance: \(instance)")
}
```

### Primary keys and auto-increment columns

SkipSQL supports primary keys that work with SQLite's ROWID mechanism,
such that when an `INTEGER` column (i.e., `SQLValue.long`) is the primary
key, the same storage is used as the underlying `ROWID` that all tables
automatically have (see 
[ROWIDs and the INTEGER PRIMARY KEY](https://sqlite.org/lang_createtable.html#rowids_and_the_integer_primary_key)).

The property should be either an optional `Int64?`, or if it marked with
`autoincrement: true` and the type is a non-optional `Int64`, then inserting
a value with the id property set to `0` will automatically assign the
primary key when `.insert(ob)` is called. This enables a table to
have a required primary key (which is useful when implementing `Identifiable`)
with the special sentinal value of `0` that indicates that it is a new instance.

```swift
public var id: Int64
static let id = SQLColumn(name: "ID", type: .long, primaryKey: true, autoincrement: true)
```

If the primary key is not marked with `autoincrement: true` and the
property is not optional, then it is assumed that the primary key
is manually assigned by the developer and care must be taken to
ensure that duplicate values are not inserted.

### Date fields

SQLite does not have any dedicated column type that handles date fields
(see [Date And Time Functions](https://sqlite.org/lang_datefunc.html#overview)),
but it can handle dates encoded either as a ISO-8601 string in a column
of type TEXT, or in a numeric column containing the number of seconds since January 1, 1970.

Examples of mapping to each type are as follows:

#### Mapping Date to a REAL column

```swift
public struct SQLDateAsReal : SQLCodable {
    public var rowid: Int64
    static let rowid = SQLColumn(name: "ROWID", type: .long, primaryKey: true, autoincrement: true)

    public var date: Date
    static let date = SQLColumn(name: "DATE", type: .real)

    public static let table = SQLTable(name: "SQL_DATE_AS_REAL", columns: [rowid, date])

    public init(date: Date) {
        self.rowid = 0
        self.date = date
    }

    public init(row: SQLRow, context: SQLContext) throws {
        self.rowid = try Self.rowid.longValueRequired(in: row)
        self.date = try Self.date.dateValueRequired(in: row)
    }

    public func encode(row: inout SQLRow) throws {
        row[Self.rowid] = SQLValue(self.rowid)
        row[Self.date] = SQLValue(self.date.timeIntervalSince1970)
    }
}
```

#### Mapping Date to a TEXT column

```swift
public struct SQLDateAsText : SQLCodable {
    public var rowid: Int64
    static let rowid = SQLColumn(name: "ROWID", type: .long, primaryKey: true, autoincrement: true)

    public var date: Date
    static let date = SQLColumn(name: "DATE", type: .text)

    public static let table = SQLTable(name: "SQL_DATE_AS_TEXT", columns: [rowid, date])

    public init(date: Date) {
        self.rowid = 0
        self.date = date
    }

    public init(row: SQLRow, context: SQLContext) throws {
        self.rowid = try Self.rowid.longValueRequired(in: row)
        self.date = try Self.date.dateValueRequired(in: row)
    }

    public func encode(row: inout SQLRow) throws {
        row[Self.rowid] = SQLValue(self.rowid)
        row[Self.date] = SQLValue(self.date.ISO8601Format())
    }
}
```

### Relations and joins

SkipSQL is not a complete object-relational mapping (ORM) package,
but it does contain the ability to perform joins across multiple
`SQLCodable` tables when one of the `SQLColumn` definitions
includes a `SQLForeignKey`.

```swift
/// A struct that can read and write its values to the `DEMO_TABLE` table.
public struct DemoParent : SQLCodable {
    public var id: Int64
    static let id = SQLColumn(name: "ID", type: .long, primaryKey: true, autoincrement: true)

    public var parentInfo: String?
    static let parentInfo = SQLColumn(name: "PARENT_INFO", type: .text)

    public static let table = SQLTable(name: "DEMO_TABLE", columns: [id, parentInfo])
}

public struct DemoChild : SQLCodable {
    public var id: Int64
    static let id = SQLColumn(name: "ID", type: .long, primaryKey: true, autoincrement: true)

    public var parentID: Int64
    static let parentID = SQLColumn(name: "PARENT_ID", type: .long, references: SQLForeignKey(table: DemoParent.table, column: DemoParent.id, onDelete: .cascade))

    public var childInfo: String?
    static let childInfo = SQLColumn(name: "CHILD_INFO", type: .text)

    public static let table = SQLTable(name: "DEMO_CHILD", columns: [id, parentID, childInfo])
}

// perform a join between all the parents and children
let joined2: [(DemoParent?, DemoChild?)] = try sqlite.query(DemoParent.self, alias: "t0")
    .join(DemoChild.self, "t1", kind: .inner, on: DemoChild.parentID)
    .eval()
    .load()
```

This operation will perform a one-to-many inner join from the `DemoParent`
to the `DemoChild` tables, and return a list of tuples between the matching
instances. Note that the tuple values are types as optionals, because for
outer join types, it is possible to have empty rows, which would map to
`nil` values.

## Implementation

SkipSQL speaks directly to the low-level SQLite3 C library that is pre-installed on all iOS and Android devices.
On Darwin/iOS, and with SkipFuse on Android, it communicates directly through Swift's C integration.
With transpiled SkipLite on Android, it uses the [SkipFFI](/docs/modules/skip-ffi) module to interact directly with the underlying sqlite installation on Android for SkipSQL, or with the locally-built SQLite that is packages and bundled with the application as a shared object file.

Note that for performance and a consistent API, SkipSQL eschews Android's `android.database.sqlite` Java wrapper, and instead uses the same SQLite C API on both Android and Darwin platforms.

## SQLite Versions

### Vendored SQLite Versions

Because SkipSQL uses the version of SQLite that is shipped with the platform, care should be taken when using recent SQLite features, such as the [`json`](https://sqlite.org/json1.html) function, which is new in SQLite 3.38. This would raise an error on Android versions below 14.0 (API 34) and iOS versions below 16.0.

Be aware that some very useful SQL features may only have been added to more recent versions of SQLite, such as strict tables (added in 3.37). This may impact the Android API version you can deploy back to, so be sure to test your code on the oldest available Android emulator and iOS simulator for your project.

Also be aware that the availability of some SQL features are contingent on the compile flags used to build the vendored sqlite implementation provided as part of the OS, such as `SQLITE_ENABLE_JSON1` enabling the various [`json_`](https://www.sqlite.org/json1.html) operations. In the case of Android, be aware that local Robolectric testing will be insufficient to identify any limitations resulting from sqlite compile flags, since local testing will use the local (i.e., macOS-vendored) version of SQLite. Testing against an Android emulator (or device) should be performed when developing new SQL operations.


| OS Version             | SQLite Version |
|------------------------|----------------|
| Android 9 (API 28)     | 3.22           |
| iOS 13                 | 3.28           |
| Android 10 (API 30)    | 3.28           |
| iOS 14                 | 3.32           |
| Android 11 (API 31)    | 3.32           |
| Android 12 (API 32)    | 3.32           |
| Android 13 (API 33)    | 3.32           |
| iOS 15                 | 3.36           |
| iOS 16                 | 3.39           |
| Android 14 (API 34)    | 3.39           |
| Android 15 (API 35)    | 3.44           |
| SQLPlus                | 3.50           |
| Android 16 (API 36)    | 3.50           |


Note that as cautioned in the [Android documentation](https://developer.android.com/reference/android/database/sqlite/package-summary), some Android device manufacturers include different versions of SQLite on their devices, so if your app depends on a SQLite version that may not be available on a device that your app supports, you may want to consider using [SQLPlus](#sqlplus) instead.

---

### SQLPlus

The `skip-sql` framework includes an additional `SQLPlus` module,
which creates a local build with the following extensions enabled:

 - Full Text Search (FTS)
 - Encryption (sqlcipher)

The `SQLPlus` module uses sqlite version 3.50.4, which means
that it will be safe to use newer sqlite features like
the [`json`](https://sqlite.org/json1.html) function,
RIGHT and FULL outer joins, and full text search,
regardless of the Android API and iOS versions of the 
deployment platform.

This comes at the cost of additional build time for the native libraries,
as well as a larger artifact size (around 1MB on iOS and 4MB on Android),
but has the benefit that every device you deploy your app to — on iOS and Android —
will be using the exact same build of SQLite.

#### Using SQLPlus

The SQLPlus extensions can be used by importing the `SkipSQLPlus` module
and passing `configuration: .plus` to the `SQLContext` constructor, like so:

```swift
import SkipSQLCore
import SkipSQLPlus

let dbpath = URL.applicationSupportDirectory.appendingPathComponent("db.sqlite")
let db = try SQLContext(path: dbpath.path, flags: [.create, .readWrite], configuration: .plus)
// do something with the database
db.close()
```

#### JSON

SQLPlus enables the [`json`](https://sqlite.org/json1.html) extensions:

```swift
let sqlplus = SQLContext(configuration: .plus)
try sqlplus.exec(sql: #"CREATE TABLE users (id INTEGER PRIMARY KEY, profile JSON)"#)

try sqlplus.exec(sql: #"INSERT INTO users (id, profile) VALUES (1, '{"name": "Alice", "age": 30}')"#)
try sqlplus.exec(sql: #"INSERT INTO users (id, profile) VALUES (2, '{"name": "Bob", "age": 25}')"#)

let j1 = try sqlplus.selectAll(sql: #"SELECT json_extract(profile, '$.name') as name FROM users WHERE id = ?"#, parameters: [.integer(1)]).first
assert j1 == [.text("Alice")]

let j2 = try sqlplus.selectAll(sql: #"SELECT json_extract(profile, '$.name') as name, json_extract(profile, '$.age') as age FROM users WHERE id = ?"#, parameters: [.integer(2)]).first
assert j2 == [.text("Bob"), .integer(25)]
```

#### Encryption

SQLPlus contains the SQLCipher extension, which adds 256 bit AES encryption of database files and other security features like:

- On-the-fly encryption
- Tamper detection
- Memory sanitization
- Strong key derivation

SQLCipher is based on SQLite and stable upstream release features are periodically integrated. The extension is documented at the official [SQLCipher site](https://www.zetetic.net/sqlcipher/). It is used by many mobile applications like the [Signal](https://github.com/signalapp/sqlcipher) iOS and Android app to secure local database files. Cryptographic algorithms are provided by the [LibTomCrypt](https://github.com/libtom/libtomcrypt) C library, which is included alongside the sqlcipher sources.

An example of creating an encryped database:

```swift
import SkipSQLCore
import SkipSQLPlus

let dbpath = URL.applicationSupportDirectory.appendingPathComponent("encrypted.sqlite")
let db = try SQLContext(path: dbpath.path, flags: [.create, .readWrite], configuration: .plus)
try db.exec(sql: "PRAGMA key = 'password'")
try db.exec(sql: "CREATE TABLE SOME_TABLE(col)")
try db.exec(sql: "INSERT INTO SOME_TABLE(col) VALUES(?)", parameters: [.text("SOME SECRET STRING")])
try db.close()
```

##### Encrypting an unencrypted database

Note that setting the key on the database must be the first operation that is performed after the database is opened, before any other SQL is executed. To encrypt an unencryped database that has already been created, the database must be exported with the `export(path, key)` function and then re-opened with the key. An example utility extension to do this is:

```swift
extension SQLContext {
    /// Takes an unencrypted database and encrypts it with the given key
    func encryptDatabase(key: String, at dbPath: URL) throws -> SQLContext {
        let v = self.userVersion

        let tmpDBURL = dbPath.appendingPathExtension("rekey")

        // create a new temporary location to encrypt the database
        try self.export(tmpDBURL.path, key: key)

        try self.close() // disconnect the current DB so we can safely delete and overwrite it

        // move the encrypted database to the new path
        try FileManager.default.removeItem(at: dbPath)
        try FileManager.default.moveItem(at: tmpDBURL, to: dbPath)

        // reconnect to the newly converted database
        let ctx = try SQLContext(path: dbPath.path, flags: .readWrite, configuration: .plus)
        try ctx.key(key) // set the key on the database

        // re-set the userVersion, which is not copied by pragma sqlcipher_export:
        // “sqlcipher_export does not alter the user_version of the target database. Applications are free to do this themselves.” – https://www.zetetic.net/sqlcipher/sqlcipher-api/#notes-export
        ctx.userVersion = v

        return ctx // return the newly-created context
    }
}
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

