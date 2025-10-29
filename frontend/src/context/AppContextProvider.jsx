import combineContext from '@/utils/combineContext';
import { AuthContextProvider } from './AuthContext';
import { VideoSocketContextProvider } from './VideoContext';
import { CreateProjectContextProvider } from './CreateProjectContext';


 export const AppContextProvider = combineContext(
    VideoSocketContextProvider,
    AuthContextProvider,
    CreateProjectContextProvider,
 ); 