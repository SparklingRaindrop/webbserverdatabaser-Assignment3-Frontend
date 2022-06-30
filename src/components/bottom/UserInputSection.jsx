import React from 'react';

import { GridItem } from '@chakra-ui/react';

import MessageField from './MessageField';

export default function UserInputSection(props) {
    const { socket } = props;
    return (
        <GridItem
            w='100%'
            p='1rem 0 2rem'
            gridRow='4 / span 1'
            gridColumn={['2 / span 2', '2 / span 3']}
            borderTop='1px'
            borderColor='gray.200'>
            <MessageField
                socket={socket} />
        </GridItem>
    )
}
