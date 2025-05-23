import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Menu } from '../Website/Context/contextMenu';
import { WindowSize } from '../Website/Context/contextWindowSize';
import { Axios } from '../../Api/Axios/axios';
import { USER } from '../../Api/api';
import { Linkes } from './navLinkes';
import { motion, AnimatePresence } from 'framer-motion';

export default function SideBar() {
    const menu = useContext(Menu);
    
    const isOpen = menu.isOpen;
    const windowSize = useContext(WindowSize);
    const [user, setUser] = useState({ name: '', role: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Axios.get(`/${USER}`)
            .then((response) => setUser(response.data))
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    }, []);

    // أنيميشن للشريط الجانبي
    const sidebarVariants = {
        open: {
            width: '230px',
            x: 0,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
        closed: {
            width: windowSize.windowSize < 767 ? '0px' : '60px',
            x: windowSize.windowSize < 767 ? '-100%' : 0,
            transition: { duration: 0.4, ease: 'easeIn' },
        },
    };

    // أنيميشن للروابط
    const linkVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, delay: index * 0.1 },
        }),
    };

    return (
        <motion.div
            className="bg-gradient-to-b from-gray-900 to-blue-900 shadow-xl flex flex-col h-full left-0 z-20 absolute bottom-20"
            variants={sidebarVariants}
            initial={isOpen ? 'open' : 'closed'}
            animate={isOpen ? 'open' : 'closed'}
        >
            <div className="flex-1">
                {isLoading ? (
                    <div className="space-y-4 px-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-10 bg-gray-700 rounded-lg animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {Linkes.map((link, index) =>
                            link.role.includes(user.role) ? (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    variants={linkVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 text-gray-200 no-underline transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-amber-600 text-white sm:bg-transparent'
                                                    : 'hover:bg-amber-500 hover:text-gray-900'
                                            }`
                                        }
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FontAwesomeIcon icon={link.icon} className="text-lg" />
                                        </motion.div>
                                        <span
                                            className={`text-sm font-semibold ${
                                                isOpen ? 'block' : 'hidden'
                                            }`}
                                        >
                                            {link.title}
                                        </span>
                                    </NavLink>
                                </motion.div>
                            ) : null
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}