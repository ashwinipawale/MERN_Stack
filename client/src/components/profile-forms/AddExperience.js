import React from 'react';
import PropTypes from 'prop-types';
import { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { addExperience } from '../../actions/profile';

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const { company, title, location, from, to, current, description } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    addExperience(formData, history);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Add An Experience</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any developer/programmer
        position that you had in the past
      </p>
      <small>* = required field</small>
      <form action='' className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            value={title}
            onChange={e => onChange(e)}
            placeholder='* Job Title'
            name='title'
            required
          />
        </div>

        <div className='form-group'>
          <input
            type='text'
            value={company}
            onChange={e => onChange(e)}
            placeholder='* Company'
            name='company'
            required
          />
        </div>

        <div className='form-group'>
          <input
            type='text'
            value={location}
            onChange={e => onChange(e)}
            placeholder='Location'
            name='location'
          />
        </div>

        <div className='form-group'>
          <h4>From Date</h4>
          <input
            type='date'
            value={from}
            onChange={e => onChange(e)}
            name='from'
          />
        </div>

        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              value={current}
              onChange={e => {
                setFormData({ ...formData, current: !current });
                toggleDisabled(!toDateDisabled);
              }}
              name='current'
            />{' '}
            Current Job
          </p>
        </div>

        <div className='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            value={to}
            onChange={e => onChange(e)}
            name='to'
            disabled={toDateDisabled ? 'disabled' : ''}
          />
        </div>

        <div className='form-group'>
          <textarea
            name='description'
            id=''
            cols='30'
            rows='5'
            placeholder='Job Description'
            value={description}
            onChange={e => onChange(e)}
          ></textarea>
        </div>

        <input type='submit' className='btn btn-primary my-1' />
        <Link to='/dashboard' className='btn btn-light my-1'>
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired
};

export default connect(null, { addExperience })(withRouter(AddExperience));
