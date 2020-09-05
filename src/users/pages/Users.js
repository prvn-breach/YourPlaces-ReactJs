import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { get_users } from "../../assets/js/apiEndPoints";
import UserList from '../components/UserList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
    const { isLoadingSpinner, error, sendRequest, clearError } = useHttpClient();
    const [ loadedUsers, setLoadedUsers ] = useState();
    const history = useHistory();

    useEffect(() => {
        const getUsers = async() => {
            try {
                const users = await sendRequest(get_users);
                if(users.data.length === 0) {
                    history.push('/auth');
                }
                setLoadedUsers(users.data);
            } catch(err) {};
        };
        getUsers();
    }, [ sendRequest, history ]);

    return (
        <React.Fragment>
            {isLoadingSpinner && <LoadingSpinner asOverlay />}
            {error && <ErrorModal  error={error} onClear={clearError}/>}
            {!isLoadingSpinner && loadedUsers && <UserList items={loadedUsers}/>}
        </React.Fragment>
    );
};

export default Users;