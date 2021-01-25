import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMonthAndDayString,  createDateArray } from '../../utilities/date.utils';
import moment from 'moment';
import CommitmentGroup from '../commitment-group/commitment-group.component';
import AddCommitment from '../add-commitment/add-commitment.component';

import { toggleCreateCommitmentForm } from '../../redux/commitment-form/commitment-form.actions';
import './challenge-overview.styles.css';

export default function ChallengeOverview() {
  const dispatch = useDispatch();
  const [targetGroup, setTargetGroup] = useState('');
  const createFormOpenStatus = useSelector(state => state.commitmentForm.createCommitmentForm);
  const { challenge } = useSelector(state => state.challenge);
  const { userId } = useSelector(state => state.user);
  const userCommitments = useSelector(state => {
    const userCommitments = state.commitments.commitments.filter((commitment) => commitment.userId === userId);
    return userCommitments;
  });
  const endDate = moment(challenge.endDate).format('YYYY-MM-DD');
  const startDate = moment(challenge.startDate).format('YYYY-MM-DD');
  const numOfDays = moment(endDate).diff(startDate, 'days');
  const commitmentGroups = userCommitments.reduce((acc, commitment) => {
      if (!acc.includes(commitment.name)) {
        acc.push(commitment.name);
      }
      return acc
    }, []);
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
  }

  const dateArray = createDateArray(startDate, numOfDays);

  const handleClick = (e) => {
    setTargetGroup(e.target.getAttribute('name'));
    dispatch(toggleCreateCommitmentForm())
  }



  return (
    <div className="challenge-overview">
      {
        createFormOpenStatus ? (<AddCommitment targetGroup={targetGroup} startDate={startDate} endDate={endDate} commitments={userCommitments} />) : null
      }
      <div style={containerStyle} className="challenge-days">
        <div className="table-header">
          <button className="toggle-create-form-button" type="button" onClick={() => {
            setTargetGroup('');
            dispatch(toggleCreateCommitmentForm())
            }}> &#43; Commitment</button>
          <h4 className="table-date-head">Date</h4>
        </div>
        {
          dateArray.map((date, index) => {
            return (
              <div key={`day-${index}`} className="table-date" >
                  { getMonthAndDayString(date) }
              </div>)
          })
        }
      </div>
      <div className="commitments-container">

      {
        commitmentGroups.map((group) => {
          const commitments = userCommitments.filter((commitment) => commitment.name === group)
          return <CommitmentGroup handleClick={handleClick} name={group} startDate={ startDate } endDate={endDate} numOfDays={ numOfDays } commitments={commitments} />
        })
      }
      </div>
    </div>
  )
}
