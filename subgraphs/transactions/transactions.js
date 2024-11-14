// Open Telemetry (optional)
const { ApolloOpenTelemetry } = require('supergraph-demo-opentelemetry');

if (process.env.APOLLO_OTEL_EXPORTER_TYPE) {
  new ApolloOpenTelemetry({
    type: 'subgraph',
    name: 'transactions',
    exporter: {
      type: process.env.APOLLO_OTEL_EXPORTER_TYPE, // console, zipkin, collector
      host: process.env.APOLLO_OTEL_EXPORTER_HOST,
      port: process.env.APOLLO_OTEL_EXPORTER_PORT,
    }
  }).setupInstrumentation();
}

const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const port = process.env.APOLLO_PORT || 4001;

const transactions = [
    { id: '5000', userId: '1' },
    { id: '5001', userId: '2' }
]

const typeDefs = gql(readFileSync('./transactions.graphql', { encoding: 'utf-8' }));
const resolvers = {
    Transaction: {
        user: (transaction) => {
          return { "id" : transactions.find(t => t.id == transaction.id).userId };
        },
        userHasCreditCardProduct: (transaction) => {
          return transaction.user.products.filter(p => p.type == 'Credit Card').length > 0;
        }
    },
    User: {
      transactions: (user) => {
        return transactions.filter(t => t.userId == user.id);
      }
    }
}
const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers }) });
server.listen( {port: port} ).then(({ url }) => {
  console.log(`🚀 Transactions subgraph ready at ${url}`);
}).catch(err => {console.error(err)});
