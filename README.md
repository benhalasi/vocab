# Vocab - Foreign Vocabulary Learning App

should be available [here](https://vocab.benedek.dev/). Registration is disabled, since it runs on a free GCP machine, if you want to try it, throw me a mail.

## tech stuff

### kubernetes

The chosen environment is k8s because why not. I wanted to try it. I'm planning on cleaning up the k8s configurations, they are not in a good shape at the moment, sorry for that.

### vocab-core

stack: java, [quarkus](https://quarkus.io/), gradle.

This application communicates with our db, defines our data-model and provides REST endpoints for limited CRUD features via open-api, could be used for authentication but it is not authorizing requests.

If you don't know quarkus, it's a very spring like framework but smaller, built by RedHat and has greater performance accoring to some people. I chose this again, because I wanted to try it.

### vocab-front

stack: [qwik](https://qwik.builder.io/)

This application responsible for providing UI. It is useable already but has long way to go implementing some extra features to have this project rounded up.

If you don't know Qwik, it is a react like framework, but has some truly amazing improvements and I choosed it, because - you guessed it; I wanted to try it.

## some whys

The goals of this application is to implement a specific foreign vocabulary building method with the adaquate suppporting features like _authentication_.

In this specific foreign vocabulary building method, every word in the user's vocabulary has a main metric which is the `confidence score`, this metric tells us how confident is the user in the specific word. This metric is effected by the correctness of the user's answares, the timespan between questions and it also can be affected by other minor things.

Words are getting into the user's vocabulary with `'0' confidence score` and with 'a-b-c-d option questions' the user builds their score up the point where they will be tested with an open (free-text) question.

Generaly the words will appear less and less in questions as their `confidence score` builds up, but there could be different question providing algorithms.

currently we have two:

- `weak words` words with low confidence score.
- `old words` words that weren't asked in the near past.

and we also have plans on implementing:

- `new words` words that weren't asked as much as others.

---

Users can and supposed to have multiple `vocabulary sets`, which will provide the pool for the chosen algorithm to generate questions from. The user cannot choose a specific `set` to study but can specify which `sets` should not be used to generate questions. This may seem like a minor but odly specific rule, but it has it's reasons;

- This way the user can always bring in new words while also getting more comfortable with older words in their vocabulary, which provides a more seemless experience.
- Users are not forced to choose which set they want to learn, so they have an easier time to go learn.
- This provides larger pools of words to generate questions from which is useful for smarter algorithms.

Users can share their `vocabulary sets` which makes them searchable, so other users can add them to their own collection.
