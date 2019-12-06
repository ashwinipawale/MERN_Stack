import React from 'react';
import PropTypes from 'prop-types';
import { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { addEducation } from '../../actions/profile';

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    addEducation(formData, history);
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any school or bootcamp that
        you have attended
      </p>
      <small>* = required field</small>
      <form action='' className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            value={school}
            onChange={e => onChange(e)}
            placeholder='* School'
            name='school'
            required
          />
        </div>

        <div className='form-group'>
          <input
            type='text'
            value={degree}
            onChange={e => onChange(e)}
            placeholder='* Degree Or Certificate'
            name='degree'
            required
          />
        </div>

        <div className='form-group'>
          <input
            type='text'
            value={fieldofstudy}
            onChange={e => onChange(e)}
            placeholder='* Field Of Study'
            name='fieldofstudy'
            required
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
            Current
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
            placeholder='Program Description'
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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(withRouter(AddEducation));
