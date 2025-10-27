import combineContext from '@/utils/combineContext';
import { AuthContextProvider } from './AuthContext';
import { VideoSocketContextProvider } from './VideoContext';


 export const AppContextProvider = combineContext(
    VideoSocketContextProvider,
    AuthContextProvider,
 ); 