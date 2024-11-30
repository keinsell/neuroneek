# Development

## Testing

When it comes to testing a lot of knowledge is outdated for modern JavaScript I think.

- **Unit Testing**, for testing behavior of the functions— like `addDiscount` or something, this should not be written for "getters and setter" which eventually mean we do not test data classes and dtos, preferably only technical aspects and domain aspects.
- **Integration Testing**, is there to check if code have reached other parts of the system, ex. When we're using Stripe we want to check if request for stripe was  sent and if stripe have received the messeage—it's the worst possible part for testing.
- **Acceptance Testing**, check if business requirements are met, ex. When we're using Stripe we want to check if the payment was successful and if the user have received the product.
- **Functional (E2E) Testing**, programmable walkthrough of the application to satisfy specific user paths, ex. When we're using Stripe we want to check if the user can pay for the product and if the product is delivered.

As I start writing tests, I think
some sort of rule of thumb is "When some function or implementation
that I've written is correct on the first try it do not need
to be covered in tests" and the second one would be "When one thing has been changed at least one time, it should be covered in tests".