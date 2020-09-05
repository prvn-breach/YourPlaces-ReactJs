import { useCallback, useState, useEffect } from "react";

export const useAuth = () => {
    const [token , setToken] = useState(false);
    const [expireToken, setExpireToken] = useState();
    const [userId, setUserId] = useState(null);
  
    let logoutTimer;
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate ? 
            expirationDate : new Date(
                new Date().getTime() + (1000 * 60) * 60
            );
            
      setExpireToken(tokenExpirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({ userId: uid, token: token, expiration: tokenExpirationDate.toISOString() })
      );
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
      setExpireToken(null);
      let userData = JSON.parse(
        localStorage.getItem("userData")
      );
      if(userData && userData.token) {
        localStorage.removeItem("userData");
      }
    }, []);
  
    useEffect(() => {
      if(token && expireToken) {
        const remainingTime = expireToken.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [logout, expireToken, logoutTimer]);
  
    useEffect(() => {
      let userData = JSON.parse(
        localStorage.getItem("userData")
      );
      if(
        userData && 
        userData.token && 
        new Date(userData.expiration) > new Date()
      ) {
        const { userId, token , expiration} = userData;
        login(userId, token, expiration);
      }
    }, [login]);
  
    return { token, login, logout, userId };
}