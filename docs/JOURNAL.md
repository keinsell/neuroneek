# Project's Journal

## 2025

### January

#### 01

- **Spent 4 hours** working on implementing a migration toolkit with `Atlas`, only to realize that it’s not really
  compatible with code-first ORMs like `SeaORM` and adds more complexity than just writing migrations manually in Rust.
  Well, these things happen. For now, it’s fine for the current scope, but I’ll likely remove `Atlas` in the future. It
  seems better suited for cloud-native applications, whereas for our **local-first application**, tools like `Sqitch`
  and `Prisma` seem like more fitting options. **Atlas** does have its use cases, but it’s not a good fit here.

- **Cleaned up the database schema**—we had a lot of unnecessary, chemical-specific data that wasn’t adding any real
  value to the project. Now, we’re only storing the essential information, which keeps the database clean and focused,
  without unnecessary bloat.