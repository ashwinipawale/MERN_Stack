import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

export const Education = ({ education }) => {
  const educationData = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className='hide-sm'>{edu.degree}</td>
      <td className='hide-sm'>{edu.fieldofstudy}</td>
      <td>
        <Moment format='YYYY/MM/DD'>{edu.from}</Moment>
        {' - '}
        {edu.to === null ? (
          'Now'
        ) : (
          <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
        )}
      </td>
      <td>
        <button className='btn btn-danger'>Delete</button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2'>Education</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree Or Certificate</th>
            <th className='hide-sm'>Field Of Study</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{educationData}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired
};

export default Education;
