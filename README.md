# Welcome to gateway-storage-api

This is a [Next.js](https://nextjs.org/) project bootstrapped with `create-next-app`, using node v14.15.4.

## Getting Started

First, run the build script:

```bash
npm run build
#This command run an interactive script to make initial project configuration.
```

or run the project manually

```bash
npm install
npm run start
#This command run project with default configuration
```

Go to the browser and open a tab with the url passed to the script, or open <http://localhost:3000> if you run script with default options.

## Unit Test

After run solution, you can run unit test script to verify some api functionalities, with the next command:

```bash
npm run test
```

## Database structure

To model the requirements, mongodb was used. Two collections were created, gateway and peripherals, with the following structure:

### Gateways:

| Field     | Type                        | Editable |
| --------- | --------------------------- | -------- |
| serialId  | string \[unique\]           | no       |
| name      | string                      | yes      |
| ipAddress | string \[valid ip address\] | yes      |

### Peripherals:

| Field      | Type                            | Editable |
| ---------- | ------------------------------- | -------- |
| uid        | number \[unique\]               | no       |
| vendor     | string                          | yes      |
| status     | 'online' or 'offline'           | yes      |
| date       | date                            | yes      |
| gateway_id | string \[monodb \_id document\] | no       |

## API routes

### \[get\] /api/gateways

- To load all gateways and his peripheral associated

### \[get\] /api/gateways/details

- To load details of one gateway and his peripherals associated.

```json
Arguments: {
    "serialId": "string" | "undefined",
    "_id": "string" | "undefined"
}
```

### \[post\] /api/gateways/add

- To add one gateway and his peripherals

```json
Arguments: {
    "serialId": "string",
    "name": "string",
    "ipAddress": "string",
    "peripherals": [{
        "uid": "number",
        "vendor": "string",
        "status": "string",
        "date": "date"
    }]
}
```

### \[put\] /api/gateways/edit

- To change editable properties of one gateway

```json
Arguments: {
    "serialId": "string",
    "name": "string",
    "ipAddress": "string"
}
```

### \[delete\] /api/gateways/delete

- To delete one gateway and his peripherals associated

```json
Arguments: {
    "serialId": "string" | "undefined",
    "_id": "string" | "undefined"
}
```

### \[post\] /api/gateways/peripherals/add

- To add peripheral to a gateway

```json
Arguments: {
    "gateway": {
        "serialId": "string" | "undefined",
        "_id": "string" | "undefined"
    },
    "peripheral": {
        "uid": "number",
        "vendor": "string",
        "status": "string",
        "date": "date"
    }

}
```

### \[delete\] /api/gateways/peripherals/delete

- To delete peripheral from a gateway

```json
Arguments: {
    "uid": "number" | "undefined",
    "_id": "string" | "undefined"
}
```
