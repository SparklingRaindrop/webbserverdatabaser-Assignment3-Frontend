import {atom} from 'recoil';

export const userState = atom({
    key: 'userState',
    default: {
        name: null,
        id: null,
        current_room: null,
        active_tab: null,
        active_dm: [],
    },
});