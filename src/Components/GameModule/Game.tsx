import React from "react";
import { useRouteMatch, Switch, Route, Link } from "react-router-dom";

export const Game = () => {
  let match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/selection`}>
        <div>Select an identity for</div>
        <Link to={`${match.path}/waiting`}>Valider</Link>
      </Route>
      <Route path={`${match.path}/waiting`}>
        <div>waiting for</div>
        <Link to={`${match.path}/play`}>Continue</Link>
      </Route>
      <Route path={`${match.path}/play`}>
        <div>
          who are you?
          <input />
          <div>other identities</div>
        </div>
      </Route>
      <Route path={`${match.path}`}>
        <div>Players</div>
        <Link to={`${match.path}/waiting`}>Démarrer</Link>
      </Route>
    </Switch>
  );
};
