import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Menu } from '../Website/Context/contextMenu';
import { WindowSize } from '../Website/Context/contextWindowSize';
import { Axios } from '../../Api/Axios/axios';
import { USER } from '../../Api/api';
import { Linkes } from './navLinkes';

export default function SideBar(){
    const menu = useContext(Menu)
    const isOpen = menu.isOpen
    const windowSize = useContext(WindowSize)
    const [user , setUser] = useState("")

    useEffect(() => {
        Axios.get(`/${USER}`)
        .then((data) => setUser(data.data))
        .catch(() => console.log("login"))
    }, [])
    
    return(
        <div className="sideBar" style={{
            width: isOpen ? "230px" : "fit-content" , 
            left: windowSize.windowSize < 767 && !isOpen ? "-100%" : "0px" }}>
            {
                    Linkes.map((link , index) => {
                        return(
                            link.role.includes(user.role) &&
                            <NavLink to={link.path} key={index}>
                                <FontAwesomeIcon className='m-3' icon={link.icon}/>
                                <button style={{border: "0" , outline: "0" , backgroundColor: "inherit" , height: "40px" , display: isOpen ? "contents" : "none"}}>{link.title}</button>
                            </NavLink>
                        )
                    })
            }
        </div>
    )
}