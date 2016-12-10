import {Route, IndexRoute} from 'react-router';
import App from './components/app';
import DashboardMain from './components/pages/DashboardMain';
import Upload from './components/pages/Upload';
import Schools from './components/pages/Schools';
import Students from './components/pages/Students';
import SingleStudent from './components/pages/SingleStudent';
import SearchResult from './components/pages/SearchResult';
import SingleCollege from './components/pages/SingleCollege';
import Colleges from './components/pages/Colleges';
import FilteredStudents from './components/pages/FilteredStudents';

export default (
    <Route path='/' component={ App }>
        <IndexRoute component={ DashboardMain }/>
        <Route path='upload' component={ Upload }/>
        <Route path='schools' component={ Schools }/>
        <Route path='students' component={ Students }/>
        <Route path='colleges' component={ Colleges }/>
        <Route path='filtered' component={ FilteredStudents }/>
        <Route path='student/:osis' component={ SingleStudent }/>
        <Route path='search' component={ SearchResult }/>
        <Route path='college/:id' component={ SingleCollege }/>
    </Route>
);
