import { GridItem, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../recoil/user/atom';
import ConversationWindow from './ConversationWindow';


function TabButton(props) {
    const { label } = props;
    const setUser = useSetRecoilState(userState);

    function handleOnClick(tabName) {
        setUser(prev => ({
            ...prev,
            active_tab: tabName
        }));
    }

    return (
        <Tab
            _selected={{ color: 'green.900', bg: 'green.300' }}
            onClick={() => handleOnClick(label)}>
            {label}
        </Tab>
    );
}

export default function ConversationTabs(props) {
    const { tabIndex } = props;

    const user = useRecoilValue(userState);

    return (
        <Tabs
            h='100%'
            isLazy
            variant='enclosed-colored'
            size='lg'
            display='grid'
            gridTemplateRows='auto 1fr'
            gridTemplateColumns='1fr'
            colorScheme='green'
            onChange={(index) => handleSwitchTab(index)}
            index={tabIndex}>
            <GridItem>
                <TabList>
                    <TabButton label={user.current_room} />
                    {
                        user.active_dm && Object.keys(user.active_dm).map(receiverName => (
                            <TabButton
                                key={receiverName}
                                label={receiverName}
                            />
                        ))
                    }
                </TabList>
            </GridItem>

            <GridItem
                maxH='100%'
                className='conversations'
                overflowY='scroll'>
                <TabPanels>
                    <TabPanel>
                        <ConversationWindow
                            receiverId={undefined}
                            receiverName={user.current_room} />
                    </TabPanel>
                    {
                        user.active_dm && Object.keys(user.active_dm).map(receiverName => (
                            <TabPanel key={receiverName}>
                                <ConversationWindow
                                    receiverName={receiverName}
                                    receiverId={user.active_dm[receiverName]} />
                            </TabPanel>
                        ))
                    }
                </TabPanels>
            </GridItem>
        </Tabs>
    )
}