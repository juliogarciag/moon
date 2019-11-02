import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import DashboardPage from "components/DashboardPage";
import "./App.css";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <DashboardPage />
    </ApolloProvider>
  );
}
