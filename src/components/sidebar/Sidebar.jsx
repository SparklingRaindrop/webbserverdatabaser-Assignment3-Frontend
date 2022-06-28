import React from 'react';
import { GridItem } from '@chakra-ui/react';
import UserDisplay from './UserDisplay';

export default function Sidebar(props) {
    const { socket, handleSwitchTab } = props;

    return (
        <GridItem
            maxW='100%'
            paddingY='2rem'
            gridRow='1 / span 4'
            gridColumn='1 / span 1'
            overflowX='hidden'
            overflowY='scroll'>
            <UserDisplay
                socket={socket}
                w='100%'
                bg='green.400'
                handleSwitchTab={handleSwitchTab} />
        </GridItem>
    )
}
