SubActions are designed to eliminate code duplication in Actions. SubActions allow Actions to share a sequence of Tasks,
while Tasks allows Actions to share a piece of functionality.

The SubActions are created to solve a problem. Sometimes a big chunk of business logic is reused in multiple Actions,
and that code is already calling some Tasks. In such cases, the solution is to create a SubAction.

For example, assuming an Action A1 is calling Task1, Task2 and Task3, and another Action A2 is calling Task2, Task3,
Task4, and Task5. Notice both Actions are calling Tasks 2 and 3. To eliminate code duplication, we can create a
SubAction that contains all the common code between both Actions.