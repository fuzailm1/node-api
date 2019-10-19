# node-api

API to add metrics by key, value, and return a sum of values by key for ones posted in the last 60 minutes. 

## Installation and Usage

Clone the repository 
```bash 
git clone https://github.com/fuzailm1/node-api
``` 
Navigate into the folder 
```bash
cd node-api
```  
Install packages. 
```bash 
npm install 
``` 

Run the server 
```bash 
npm run dev
```

The server will run on port 3001. 

Use any HTTP Client to hit the endpoints. 

### GET 
URL
```
http://localhost:3001/metric/{key}/sum
```
Output
```
{"value": sum}
```

### POST
URL
```
http://localhost:3001/metric/{key}

{
    "value": number
}
```

Output
```
{}
```

## Testing

Make sure the server is not currently running. 

```bash 
npm run test
```

or 
```bash 
npm test
```