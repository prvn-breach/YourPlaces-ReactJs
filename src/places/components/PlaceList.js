import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import PlaceItem from './PlaceItem';
import './PlaceList.css';

const PlaceList = props => {
    if (props.items.length === 0){
        return (
            <div className="center">
                <Card>
                    <h2>No Places Found, May be Create One ?</h2>
                    <Button to={`/place/new`}>Share Place</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className="place-list">
            {props.items.map(place => (
                <PlaceItem 
                    key={place.id}
                    id={place.id}
                    title={place.title}
                    image={place.image}
                    address={place.address}
                    description={place.description}
                    createrId={place.creator}
                    coordinates={place.location}
                    onDelete={props.onDeletePlace}
                />
            ))}
        </ul>
    );
};

export default PlaceList;