import React from 'react';
import {
    ListItem,
    UnorderedList,
} from '@chakra-ui/react';

export default function MemberList(props) {
    const { members } = props;
    return (
        <UnorderedList listStyleType='none'>
            {
                members.length > 0 ?
                    members.map(member =>
                        <ListItem key={member.id}>
                            {member.name}
                        </ListItem>
                    ) :
                    <ListItem>
                        No member
                    </ListItem>
            }
        </UnorderedList>
    );
}