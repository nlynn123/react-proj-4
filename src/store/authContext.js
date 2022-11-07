import { useState, useEffect, useCallback, createContext } from 'react'

let logoutTimer

const AuthContext = createContext({
  token: '',
  login: () => {},
  logout: () => {},
  userId: null
})

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime()
  const expTime = expirationTime 
  const remainingTime = expTime - currentTime
  return remainingTime
}

const getLocalData = () => {
  const storedToken = localStorage.getItem('token')
  const storedUserId = localStorage.getItem('userId')
  const storedExp = localStorage.getItem('expirationTime')

  const remainingTime = calculateRemainingTime(storedExp)

  if (remainingTime <= 1000 * 60 * 30) {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime')
    return null
  }


  return {
    token: storedToken,
    duration: remainingTime,
    userId: storedUserId,
  }
}



export const AuthContextProvider = (props) => {
  const localData = getLocalData()
  
  let initialToken
  let initialId
  if (localData) {
    initialToken = localData.token
    initialId = localData.userId
  }

  const [token, setToken] = useState(initialToken)
  const [userId, setUserId] = useState(initialId)


  const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('expirationTime')

        if(logoutTimer) {
          clearTimeout(logoutTimer)
        }
  }, [])

  const login = (token, expirationTime, userId) => {
    setToken(token)
    setUserId(userId)
    localStorage.setItem('token', token)
    localStorage.setItem('expirationTime', expirationTime)
    localStorage.setItem('userId', userId)

    const remainingTime = calculateRemainingTime(expirationTime)

    logoutTimer = setTimeout(logout, remainingTime)
  }
  
  useEffect(() => {
    if(localData) {
      logoutTimer = setTimeout(logout, localData.duration)
    }
  }, [localData, logout])

  const contextValue = {
    token,
    login,
    logout, 
    userId
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext
