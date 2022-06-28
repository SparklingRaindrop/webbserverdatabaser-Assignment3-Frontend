import { GridItem } from '@chakra-ui/react';
import React from 'react';
import ConversationTabs from './ConversationTabs';

export default function MainSection(props) {
    const { tabIndex, handleSwitchTab } = props;

    return (
        <GridItem
            w='100%'
            pt='2rem'
            gridRow='1 / span 3'
            gridColumn={['2 / span 2', '2 / span 3']}>
            <ConversationTabs
                tabIndex={tabIndex}
                handleSwitchTab={handleSwitchTab} />
        </GridItem>
    )
}
