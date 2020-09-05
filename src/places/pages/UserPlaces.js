import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from "../../shared/hooks/http-hook";
import { get_user_places } from "../../assets/js/apiEndPoints";

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const { isLoadingSpinner, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const userPlaces = await sendRequest(get_user_places+'?' + new URLSearchParams({
                    uid: userId
                }));
                setLoadedPlaces(userPlaces.places);
            } catch (err) {}
        }
        fetchPlaces();
    }, [sendRequest, userId]);

    const onPlaceDeleteHandler = (deletePlaceId) => {
        setLoadedPlaces(prevPlaces => 
            prevPlaces.filter(place => place.id !== deletePlaceId)
        );
    }

    return (
        <React.Fragment>
            {isLoadingSpinner && <LoadingSpinner asOverlay />}
            {error && <ErrorModal  error={error} onClear={clearError}/>}
            <PlaceList items={loadedPlaces} onDeletePlace={onPlaceDeleteHandler}/>
        </React.Fragment>
    )
};

export default UserPlaces;