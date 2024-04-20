Requests mainly serve the user input in the application. They are very useful to automatically apply the Validation and
Authorization rules.

Requests are the best place to apply validations since the validation rules will be related to every request. Requests
can also check the Authorization, e.g., check if this user has access to this controller function (for example, check if
a specific user owns a product before deleting it, or check if this user is an admin to edit something).