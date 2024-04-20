Tasks are classes that hold shared business logic between multiple Actions across different Containers.

Each Task is responsible for a small part of the logic, and it usually has a single function called run(). However,
Tasks can have more functions with explicit names if needed, which makes the Task class replace the concept of function
flags.

Tasks are optional, but in most cases, you find yourself in need of them. For example, if you have Action 1 that needs
to find a record by its ID from the DB, then fires an Event. And you have an Action 2 that needs to find the same record
by its ID, then makes a call to an external API. Since both actions are performing the "find a record by ID" logic, we
can take that business logic and put it in its own class, that class is the Task. This Task is now reusable by both
Actions and any other Action you might create in the future.

The rule is, whenever you see the possibility of reusing a piece of code from an Action, you should put that piece of
code in a Task. Do not blindly create Tasks for everything. You can always start by writing all the business logic in an
Action and only create a dedicated Task when you need to reuse it. Refactoring is essential to adapt to the code growth.