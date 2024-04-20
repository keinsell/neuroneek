<h1 align="center"><code>@neuronek/osiris</code></h1>

<p align="center">
Osiris was the god of knowledge so here we have package that represents all the data models available in the system along with their rules, think about this package as barebones of application as a whole which can be used in any environment with any infrastructure - this was made because plans to build desktop application and mobile application which should have preferably same logic as the  server but without touching external sources in sake of privacy.
</p>

> This version of package stands for simplified version to start with application as previous one (like complete one) was too big to start with to deliver a minimally functioning application, this one introduces bare functionality that should be introduced and will be evolved over time until the need for the original one will be gone.

<h2 align="center">Installation</h2>

You should avoid installing this package by now, so documentation is omited by the purpose.

<h2 align="center">Usage</h2>

Here is an example of how package should be used and what's purpose of such package:

```ts
import { Subject, Ingestion, Substance } from "@neuronek/osiris"

// Data can be mapped from outer infrastructure,
// in case of server this would be based on profile
// in other cases a username provided by user
// as "What we should call you?" selection.
const subject = new Subject({
  username: "elonmusk",
})

// Similary to Subjects, we map infromation
// from database to Substance class.
const caffeine = new Substance({
  name: "Caffeine",
  // ...
})

// Creation of ingestion, the library will
// parse the input and create neccessary datamodels
// for the provided input.
const ingestion = Ingestion.ingest({
			subject: subject,
            substance: caffeine,
            description: "Cup of coffee",
            dosage: "80mg"
            // other known metadata...
  })

// Check time to soberity from ingestion
ingestion.whenSober() // Will output DateTime after "Aftereffects" stage.

// As example presented, think about library as embeedable "domain" of
// software distributed as npm package used by various application in
// project. As a creator of package I wonder to provide a shells for services
// which would allow users to implement their own way of ex. fetching substances
// however this seems to big for now.
```
