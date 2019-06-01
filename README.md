# challonge phase 1
Phase 1 should just wrap challonge API. Persisting minimal data, just to associate an external user to a challonge user_id. Persisting existing tournament ids is also necessary

External user: _any user of this system_. All external users should self identify with an id that will never change

Authentication is done through a shared api key between all external users. It is expected to be a slackbot system holding api key in a secret environment variable.

## Main features

### 1. List tournaments
#### Description
API should support CRUD on tournaments.

### 2. Login
#### Key Endpoints
- List participants https://api.challonge.com/v1/documents/participants/index
#### Description
- It should receive challonge username from external user.
- If external user is already associated with challonge user, it should not allow changing. This should prevent someone from adding another person.
- External users can supply username

### 3. List matches
#### Key Endpoints
- List matches https://api.challonge.com/v1/documents/matches/index
#### Description
- If external user hasn't logged in yet, it should return an error.
- It receives tournament id as an optional parameter, if it doesn't it defaults to the last tournament.
- It will list as a result an ordered list with each match in the tournament:
  - Adversary:
    - challonge username
    - external username
  - score
  - suggested playing order


# challonge phase 2
start persisting and offering stats.`

## Main features

### 1. Load tournament
#### Key Endpoints
- List participants https://api.challonge.com/v1/documents/participants/index
- List matches https://api.challonge.com/v1/documents/matches/index
#### Description
It should persist tournament information (participant and matches)

### 2. List tournaments




<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://kamilmysliwiec.com/public/nest-logo.png#1" alt="Nest Logo" /></a>
</p>

## Deploy
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/jsanguinetti/nestjs-boilerplate-heroku)

## Description

[Nest](https://github.com/nestjs/nest) framework **TypeScript** starter repository. 
  
## Installation

```bash
$ yarn install
```

## Start

```
$ yarn run foreman
```

## People

- Author - [Javier Sanguinetti](https://github.com/jsanguinetti)
- Website - [https://nestjs.com](https://nestjs.com/)
