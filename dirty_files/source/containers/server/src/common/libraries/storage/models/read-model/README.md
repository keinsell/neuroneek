# Read Model

Read Model is a database model which is constructed in a way that is optimized
for reading data. It is used to query
data from the database. It is also used to store data that is not critical to
the business and can be easily recreated.

- In `typeorm` the read model is called `entity`.
- In `sequelize` the read model is called `model`.
- In `mongoose` the read model is called `schema`.

Distinction between read model and write model is important because it allows us
to optimize the database for reading
and writing separately. For example, we can use a different database engine for
read model and write model. We can also
use different database servers for read model and write model.