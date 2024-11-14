# Purpose
Testing `@requires` with a field being a list of elements. The _entities returning the list of elements should include the key ID as part of the payload.

## The entity field this is testing
`userHasCreditCardProduct: Boolean @requires(fields: "user { products { id type } }")`

# Execute

## Users subgraph
```
cd subgraphs/users
npm install
node users.js
```

## Products subgraph
```
cd subgraphs/products
npm install
node products.js
```

## Transactions subgraph
```
cd subgraphs/transactions
npm install
node transactions.js
```

## Router
```
rover dev --supergraph-config supergraph.yaml
```

# Query
http://localhost:4000

```
query AllUsers {
  allUsers {
    id
    email
    products {
      id
      type
    }
    transactions {
      id
      userHasCreditCardProduct
    }
  }
}
```

## Expected result
```
{
  "data": {
    "allUsers": [
      {
        "id": "1",
        "email": "support@apollographql.com",
        "products": [
          {
            "id": "1000",
            "type": "Loan"
          },
          {
            "id": "1001",
            "type": "Credit Card"
          }
        ],
        "transactions": [
          {
            "id": "5000",
            "userHasCreditCardProduct": true
          }
        ]
      },
      {
        "id": "2",
        "email": "support@meowcorp.com",
        "products": [
          {
            "id": "1002",
            "type": "Loan"
          }
        ],
        "transactions": [
          {
            "id": "5001",
            "userHasCreditCardProduct": false
          }
        ]
      }
    ]
  }
}
```

## Expected _entities call
```
{
    "query": "query AllUsers__transactions__3($representations:[_Any!]!){_entities(representations:$representations){...on Transaction{userHasCreditCardProduct}}}",
    "operationName": "AllUsers__transactions__3",
    "variables": {
        "representations": [
            {
                "__typename": "Transaction",
                "user": {
                    "products": [
                        {
                            "id": "1000",
                            "type": "Loan"
                        },
                        {
                            "id": "1001",
                            "type": "Credit Card"
                        }
                    ]
                },
                "id": "5000"
            },
            {
                "__typename": "Transaction",
                "user": {
                    "products": [
                        {
                            "id": "1002",
                            "type": "Loan"
                        }
                    ]
                },
                "id": "5001"
            }
        ]
    }
}
```