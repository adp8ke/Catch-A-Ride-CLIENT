import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from '../context/UserContext';
import TokenService from '../services/token-service';

export default function PrivateRoute({ component, ...props }) {
  const Component = component;
  return (
    <Route
      {...props}
      render={componentProps => (
        <UserContext.Consumer>
          {userContext => 
            userContext.loggedIn
              ? <Component {...componentProps} />
              : (<Redirect
                to={{
                  pathname: '/',
                  state: { from: componentProps.location }
                }}
              />
              )
          }
        </UserContext.Consumer>
      )}
    />
  );
}