import '../src/css/styles.css'
import '../src/css/theme.scss'
import '../src/css/manager.scss'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from '../src/reducers'

const store = createStore(rootReducer)

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
