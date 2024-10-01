import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../Components/Hooks/UserHooks';

const Navdata = () => {
  const { userProfile } = useProfile();
  const history = useNavigate();
  //state data
  const [isUsers, setIsUsers] = useState(false);
  const [isDocuments, setDocuments] = useState(false);

  const [iscurrentState, setIscurrentState] = useState('Users');

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
    if (isUsers !== 'Users') {
      setIsUsers(false);
    }
    if (isDocuments !== 'Documents') {
      setDocuments(false);
    }
  }, [history, isUsers, isDocuments]);

  const menuItems = [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'ri-contacts-book-2-fill',
      link: '/admin/users',
      click: function (e) {
        e.preventDefault();
        setIsUsers(!isUsers);
        setIscurrentState('Users');
        updateIconSidebar(e);
      },
      stateVariables: isUsers,
      isForEndUser: false,
      isForAdmin: true,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: 'ri-folder-open-fill',
      link: '/admin/documents',
      click: function (e) {
        e.preventDefault();
        setDocuments(!isDocuments);
        setIscurrentState('Documents');
        updateIconSidebar(e);
      },
      stateVariables: isDocuments,
      isForEndUser: false,
      isForAdmin: true,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: 'ri-folder-open-fill',
      link: '/documents',
      click: function (e) {
        e.preventDefault();
        setDocuments(!isDocuments);
        setIscurrentState('Documents');
        updateIconSidebar(e);
      },
      stateVariables: isDocuments,
      isForEndUser: true,
      isForAdmin: false,
    },
  ];
  const endUserItems = menuItems.filter((item) => item.isForEndUser);
  const adminItems = menuItems.filter((item) => item.isForAdmin);
  return (
    <React.Fragment>
      {userProfile.role &&
      userProfile.role.some((role) => role.toLowerCase().includes('admin'))
        ? adminItems
        : endUserItems}
    </React.Fragment>
  );
};
export default Navdata;
