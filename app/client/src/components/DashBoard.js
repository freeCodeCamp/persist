import React, { Component } from 'react';
import HeaderBar from './admin-components/header-bar/header-bar';
import NavigationMenu from './admin-components/navigation-menu';
// import ControlPanel from './admin-components/control-panel';
import ControlMenu from './admin-components/controls-menu';
import Footer from './admin-components/footer';
import '../../public/style/main2.scss';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import studentValidation from '../../../server/models/validation/studentValidation';

injectTapEventPlugin();

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const mongoose = window.mongoose;
    const Student = new mongoose.Schema(studentValidation);

    var doc = new mongoose.Document({}, Student);

    doc.tags = ['bloody hell it works man!']

    doc.validate(function(error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div className='wrapper'>
        <HeaderBar />
        <NavigationMenu />
        <section className='content-wrapper'>
          <MuiThemeProvider>
            { this.props.currentPage }
          </MuiThemeProvider>
        </section>
        <Footer />
        <ControlMenu />
      </div>
      );
  }
}

export default Dashboard;
