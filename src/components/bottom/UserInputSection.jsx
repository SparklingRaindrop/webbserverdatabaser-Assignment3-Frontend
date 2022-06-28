import { GridItem } from '@chakra-ui/react'
import React from 'react'
import MessageField from '../MessageField'

export default function UserInputSection(props) {
    const { socket } = props;
    return (
        <GridItem
            w='100%'
            gridRow='4 / span 1'
            gridColumn={['2 / span 2', '2 / span 3']}
            borderTop='1px'
            borderColor='gray.200'>
            <MessageField
                socket={socket} />
        </GridItem>
    )
}
