import React, { PureComponent } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import User from './containers/User/User';

class App extends PureComponent {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={User} />
      </Switch>
      </Router>
    );
  }
}

export default App;
