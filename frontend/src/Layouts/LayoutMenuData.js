import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../Components/Hooks/UserHooks';

const Navdata = () => {
  const { userProfile } = useProfile();
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isCategorys, setIsCategorys] = useState(false);
  const [isPartnerrs, setIsPartnerrs] = useState(false);
  const [isUsers, setIsUsers] = useState(false);
  const [isGrounds, setIsGrounds] = useState(false);
  const [isBookings, setIsBookings] = useState(false);
  const [isSendNotification, setIsSendNotification] = useState(false);

  const [iscurrentState, setIscurrentState] = useState('Dashboard');

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute('subitems')) {
      const ul = document.getElementById('two-column-menu');
      const iconItems = ul.querySelectorAll('.nav-icon.active');
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove('active');
        var id = item.getAttribute('subitems');
        if (document.getElementById(id))
          document.getElementById(id).classList.remove('show');
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');
    if (iscurrentState !== 'Dashboard') {
      setIsDashboard(false);
    }
    if (iscurrentState !== 'Category') {
      setIsCategorys(false);
    }
    if (isPartnerrs !== 'Partners') {
      setIsPartnerrs(false);
    }
    if (isSendNotification !== 'SendNotification') {
      setIsSendNotification(false);
    }
    if (isUsers !== 'Users') {
      setIsUsers(false);
    }
    if (isGrounds !== 'Grounds') {
      setIsGrounds(false);
    }
    if (isBookings !== 'Bookings') {
      setIsBookings(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isGrounds,
    isUsers,
    isPartnerrs,
    isSendNotification,
    isBookings,
  ]);

  const menuItems = [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'dashboard',
      label: 'Dashboards',
      icon: 'ri-dashboard-2-line',
      link: '/#',
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState('Dashboard');
        updateIconSidebar(e);
      },
      isForPartner: false,
      isForAdmin: true,
    },
    {
      id: 'category',
      label: 'Category',
      icon: 'ri-apps-2-line',
      link: '/category',
      click: function (e) {
        e.preventDefault();
        setIsCategorys(!isCategorys);
        setIscurrentState('Category');
        updateIconSidebar(e);
      },
      stateVariables: isCategorys,
      isForPartner: false,
      isForAdmin: true,
    },
    {
      id: 'pertners',
      label: 'Pertners',
      icon: 'ri-team-line',
      link: '/partners',
      click: function (e) {
        e.preventDefault();
        setIsPartnerrs(!isPartnerrs);
        setIscurrentState('Partners');
        updateIconSidebar(e);
      },
      stateVariables: isPartnerrs,
      isForPartner: false,
      isForAdmin: true,
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'ri-contacts-book-2-fill',
      link: '/users',
      click: function (e) {
        e.preventDefault();
        setIsUsers(!isUsers);
        setIscurrentState('Users');
        updateIconSidebar(e);
      },
      stateVariables: isUsers,
      isForPartner: false,
      isForAdmin: true,
    },
    {
      id: 'notification',
      label: 'Send Notification',
      icon: ' ri-send-plane-fill',
      link: '/sendNotification',
      click: function (e) {
        e.preventDefault();
        setIsSendNotification(!isSendNotification);
        setIscurrentState('SendNotification');
        updateIconSidebar(e);
      },
      stateVariables: isSendNotification,
      isForPartner: false,
      isForAdmin: true,
    },
    {
      id: 'dashboard',
      label: 'Dashboards',
      icon: 'ri-dashboard-2-line',
      link: '/partner/index',
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState('Dashboard');
        updateIconSidebar(e);
      },
      isForPartner: true,
      isForAdmin: false,
    },
    {
      id: 'ground',
      label: 'Grounds',
      icon: 'ri-map-2-line',
      link: '/partner/ground',
      stateVariables: isGrounds,
      click: function (e) {
        e.preventDefault();
        setIsGrounds(!isGrounds);
        setIscurrentState('Grounds');
        updateIconSidebar(e);
      },
      isForPartner: true,
      isForAdmin: false,
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'ri-calendar-check-fill',
      link: '/partner/bookings',
      stateVariables: isBookings,
      click: function (e) {
        e.preventDefault();
        setIsBookings(!isBookings);
        setIscurrentState('Bookings');
        updateIconSidebar(e);
      },
      isForPartner: true,
      isForAdmin: false,
    },
  ];
  const partnerItems = menuItems.filter((item) => item.isForPartner);
  const adminItems = menuItems.filter((item) => item.isForAdmin);
  return (
    <React.Fragment>
      {userProfile.role && userProfile.role.toLowerCase() === 'admin'
        ? adminItems
        : partnerItems}
    </React.Fragment>
  );
};
export default Navdata;
