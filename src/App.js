import './App.css';
import { Route, Switch } from 'react-router-dom';

// pages
import RepoDetails from './pages/repo-details';
import IssueDetails from './pages/issue-details';

function App() {
  return (
    <div className="container">
      <Switch>
        <Route path="/issue/:number" component={IssueDetails} />
        <Route path="/" component={RepoDetails} />
      </Switch>
    </div>
  );
}

export default App;
