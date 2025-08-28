'use client';
import { Provider } from 'react-redux';
import { store } from '../lib/store';
import SocketProvider from './SocketProvider';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <SocketProvider>
        {children}
        <Toaster position="top-right" />
      </SocketProvider>
    </Provider>
  );
}
