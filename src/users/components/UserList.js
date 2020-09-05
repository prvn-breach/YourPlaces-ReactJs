import React from 'react';

import './UserList.css';
import UserItem from '../components/UserItem';
import Card from '../../shared/components/UIElements/Card';

const UserList = props => {
    if(props.items.length === 0){
        return (
            <div className="center">
                <Card>
                    <h2>No Users Found</h2>
                </Card>
            </div>
        );
    }

    return (
        <ul className="user-list">
            {props.items.map((user) => (
                <UserItem 
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    image={user.image}
                    placeCount={user.places.length}
                />
            ))}
        </ul>
    );
}; 

export default UserList;