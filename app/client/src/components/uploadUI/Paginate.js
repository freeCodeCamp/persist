import React, { Component } from 'react';
import axios from 'axios';
import StudentTable from '../student/StudentTable';

export default class Paginate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      students: [],
      offset: 0
    };
  }

  componentDidMount() {
    this.mounted = true;
    window.addEventListener('scroll', this.handleScroll.bind(this));
    this.getNewStudents();
  }

  getNewStudents() {
    const _this = this;
    axios.post('/studentPaginate', {
      offset: _this.state.offset
    })
      .then((response) => {
        _this.addStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    this.mounted = false;
  }

  handleScroll() {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
      this.getNewStudents();
    }
  }

  addStudents(newStudents) {
    const _this = this;
    let students = this.state.students;
    students = [...students, ...newStudents];
    if (!this.mounted) {
      return;
    }
    this.setState({
      students: students,
      offset: _this.state.offset + 20
    });
  }

  render() {
    return (
      <div>
        <StudentTable students={ this.state.students } />
      </div>
      );
  }
}
