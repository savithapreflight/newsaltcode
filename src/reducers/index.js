import pageIdentity from './pageIdentity';
import authentication from './authentication';
import network from './network'
import interval from "./interval"
import sync from "./sync"
import bluetooth from "./bluetooth"
import cargo from './cargo.reducer';
import { combineReducers } from 'redux';
import socket from './socket';

const rootReducer = combineReducers({
    page:pageIdentity,
    authentication,
    network,
    interval,
    sync,
    socket,
    bluetooth,
    cargo,
});

export default rootReducer;
