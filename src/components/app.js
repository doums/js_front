import { hot } from 'react-hot-loader/root'
import React from 'react'
import 'tachyons/css/tachyons.min.css'
import '../style.css'
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation
} from 'react-router-dom'
import { useApolloClient } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'
import { AUTH_TOKEN } from '../constants'
import Login from './login'
import NotFound from './notFound'
import Home from './home'

const App = () => {
  const client = useApolloClient()
  const history = useHistory()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const logout = async () => {
    await client.clearStore()
    localStorage.removeItem(AUTH_TOKEN)
    history.push('/login')
  }
  return (
    <div className='h-100 pl3'>
      <Route path='/signIn' render={() => <Login />} />
      <Route path='/signUp' render={() => <Login mod='register' />} />
      {
        pathname !== '/signIn' && pathname !== '/signUp'
        && (
          <div>
            <div className='flex items-center justify-end pa2 dark-gray'>
              <button
                type='button'
                className='sans-serif f6 ba pa3 b--white-80 bg-transparent mr2 gray grow'
                onClick={logout}
              >
                {t('logout')}
              </button>
              <Link to='/' className='dib'>
                <div className='sans-serif f6 ba pa3 b--white-80 bg-transparent mr2 gray grow'>
                  back to back
                </div>
              </Link>
            </div>
            <div className='pa2 gray athelas'>
              <Switch>
                <Route exact path='/' component={Home} />
                {/* <Route exact path='/' component={Back} />
                <Route exact path='/post/show/:id' component={Post} />
                <Route exact path='/post/update/:id' component={PreUpdatePost} />
                <Route exact path='/post/delete/:id' component={DeletePost} />
                <Route exact path='/post/create/:postType' component={PreCreatePost} />
                <Route exact path='/post/create' component={PreCreatePost} /> */}
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default hot(App)
