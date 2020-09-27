import React, { useState, useEffect } from 'react';
import { BrowserRouter} from 'react-router-dom';
import CssBaseLine from '@material-ui/core/CssBaseline';
import { useDispatch, useSelector} from 'react-redux'
import Pages from './pages/Pages'
import {setUser} from './store/auth'
import { loadUserTasks } from './store/tasks';
import {loadUserTeams,setUsersInUserTeam, loadUsersInUserTeam} from './store/teams'


function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const loadUser = async () => {
      // enter your back end route to get the current user
      const res = await fetch("/api/session");
      if (res.ok) {
        res.data = await res.json(); // current user info
        dispatch(setUser(res.data.user))
        dispatch(loadUserTasks(res.data.user.id))
        dispatch(loadUserTeams(res.data.user.id))
      }
    }
    setLoading(false);
    loadUser();
  }, [dispatch]);
  // const teams = useSelector(state=>state.userTeams.teamsUserIsIn)
  // useEffect(()=>{
  //   if(teams){
  //     Object.values(teams).forEach((team) => {
  //     console.log("hIYA!")
  //     dispatch(loadUsersInUserTeam(team.id))
  //   })}
  // },[teams,dispatch])
  if (loading) return null;

  return (
    <>
    <CssBaseLine />
    <BrowserRouter>
      <Pages/>
    </BrowserRouter>
    </>
  );
}

export default App;
