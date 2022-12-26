import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import App from './App';
import { store } from './store/configureStore';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';
import './assets/css/main.css';
import AxiosGlobalConfig from './config/axios.config';

AxiosGlobalConfig.setup();

function AppBundle() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <CookiesProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </CookiesProvider>
  );
}

window.onload = () => {
  Loadable.preloadReady().then(() => {
    ReactDOM.render(<AppBundle />, document.getElementById('root'));
  });
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
