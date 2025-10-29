import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Router from './Router';
import { AppContextProvider } from './context/AppContextProvider';
import { Modals } from './components/organisms/Modals/Modals';

function App() {

  const queryClient = new QueryClient();
 
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Modals />
        <Router />
      </AppContextProvider>
    </QueryClientProvider>
  )
}

export default App
