# System Audit

Changes made by users on their accounts and administrative actions made on
system.

## What Are Audit Logs?

Audit logs are centrally stored records of the events that affect a system’s state or behavior. Each record is a
historical footprint of a single change. It logs the event and contextual information about how it was initiated. Logs
can also incorporate information about why the event occurred.

The following data fields are usually tracked as part of an audit log event:

- The type of event that occurred.
- The time it was triggered.
- The identity of the client that initiated the event, such as a user ID or API token.
- Detailed information about the client device, such as its IP address, to track from where the event originated.
- Event-specific references to relevant data in your system, such as the IDs of any entities modified by the event.

## Why Audit Logs Are Important

Audit logs enable you to maintain compliance by proving whether certain actions have been performed. Having the ability
to retrieve the sequence of changes that a particular user’s initiated, or which occurred on a specific day, can be
critical when you need to demonstrate you’ve met the requirements of regulatory frameworks such as ICO 27001 or SOC2.

Selecting technologies that produce audit logs will ensure you’ve always got the information you need on hand. For
example, a PCI DSS audit might result in questions about who has accessed payment information and the context of their
request. If you use Cerbos as your authorization platform, you could retrieve its audit logs and list out the “accept”
decisions that relate to payment access.

Another side to audit logs and compliance is the ability to provide legal evidence that breaches have occurred. Without
audit logs, breaches could go undetected for months or years, and any signs of their existence might be non-conclusive.
A detailed audit trail informs when customers and regulators need to be notified. It can prove to insurers that a breach
did occur or defend a lawsuit by demonstrating your system’s integrity.

Audit logs also allow you to reconstruct the events that led up to unexpected behavior or a security breach. After
observing an issue, you can access the audit log and repeat the actions it’s recorded in a fresh development
environment. This can help reproduce the bug and identify how attackers gained access. Audit logs don’t usually contain
precise technical data, however, as they’re focused on answering business queries about who did what in the system.
Application-level logs are still required to reveal the specific code paths that handled a user action.

Finally, a robust audit log implementation challenges you to identify the turnkey points in your system that have a
bearing on your organization’s operations, both past and future. Each audit event increases accountability, provides
visibility into changes and helps you recognize where risks are lurking. They demonstrate to developers, legal teams,
customers and regulators that you’re proactively managing risks.

- https://auditum.io/
- https://becomegeeks.com/blog/how-to-audit-tables-in-mysql-using-nestjs/
- https://www.npmjs.com/package/@forlagshuset/nestjs-audit-logging
- https://medium.com/@yazid.abdrasid/nestjs-entity-audit-6ab4b0143843
- https://www.linkedin.com/pulse/database-audit-nestjs-done-right-way-mehdi-fracso/
- https://blog.cropsly.com/implementing-audit-logging-in-a-nestjs-application/