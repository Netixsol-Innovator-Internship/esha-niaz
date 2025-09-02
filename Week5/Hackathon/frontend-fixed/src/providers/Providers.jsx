'use client';
import { Provider } from 'react-redux';
import store from '../redux/store';
import SocketProvider from './SocketProvider';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <SocketProvider>{children}</SocketProvider>
    </Provider>
  );
}
