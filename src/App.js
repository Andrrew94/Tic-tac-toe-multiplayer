import React, { Component } from 'react';
import Layout from './components/Layout/Layout';
import TicTacToe from "./components/TicTacToe/TicTacToe";
import Header from "./components/Header/Header";

class App extends Component {
  render() {
    return (
        <Layout>
          <Header/>
          <TicTacToe/>
        </Layout>
      
    );
  }
}

export default App;
