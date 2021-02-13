# Xmeme

Xmeme is an online memes exploring & posting app.

## Prerequisites

MongoDB Community Edition : https://www.mongodb.com/try/download/community

NodeJS: https://nodejs.org/en/

## Installation

Use node package manager npm to install

```bash
npm install
```

## Usage

### Starting local server

```bash
npm start
```

> Visit http://localhost:8081

_The backend and frontend are part of same of directory because I'm using ejs templating_

<br>

### Using REST API

#### **To get latest 100 memes**

```bash
get /memes
```

#### **To get latest 100 memes with more details**

```bash
get /memes/det
```

#### **To post a meme**

```bash
post /memes
```

_You can define body by json_

Body contents:

```
name
url
caption
```

_All fields are mandatory_

#### **To get a particular meme**

```bash
get /memes/id
```

_id: ID of the meme_

#### **To get a particular meme with more details**

```bash
get /memes/id/det
```

_id: ID of the meme_

#### **To update a particular meme**

```bash
patch /memes/id
```

_You can define body by json_

Body contents:

```
url
caption
```

_All fields are mandetory_

_id: ID of the meme_

#### **To delete a particular meme**

```bash
delete /memes/id
```

id: ID of the meme

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
