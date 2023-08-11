import { ApolloClient, InMemoryCache } from "@apollo/client";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
//import { GraphQLWsLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
//import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
const httpLink = new HttpLink({
  uri: "http://chatht.nlp-lab.ir/",//"http://localhost:4000/",////"http://nlplab.sbu.ac.ir:55083/",//
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const errorLink = onError(({ response, graphQLErrors, networkError }) => {
  if (!response) {
    // window.location.href = "/error";
    // window.location.href = "/chatlobby";
    return;
  }
  // alert(JSON.stringify(graphQLErrors, null, 2));
  response.errors = null;
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

    window.location.href = "/error";
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});
// const wsLink = new GraphQLWsLink(createClient({
//   url: 'ws://chatws.nlp-lab.ir/graphql',
// }));
const wsLink = new WebSocketLink({
  uri: `ws://chatws.nlp-lab.ir/graphql`,//`ws://localhost:4000/graphql`,//`ws://nlplab.sbu.ac.ir:55083/graphql`,//,//`ws://193.105.234.184:4000/graphql`, 194.225.24.40:55083
  options: {
    reconnect: true,
    connectionParams: {
      authToken: "Bearer " + localStorage.getItem("jwtToken"),
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(splitLink),
  cache: new InMemoryCache(),
});
export const closeSocket = () => {
  wsLink.subscriptionClient.close();
};
export const openSocket = () => {
  wsLink.subscriptionClient.connect();
};
export default client;
