/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCommitmentsAsync } from '../../redux/commitments/commitments.actions';
import generalDataFetch from '../../utilities/generalFetch';
import { Line, Pie } from 'react-chartjs-2';
import moment from 'moment';

function Charts() {
  const dispatch = useDispatch();
  const commitments = useSelector((state) => state.commitments.commitments);
  const userId = useSelector((state) => state.user.userId);
  const challenge = useSelector((state) => state.challenge.challenge);
  const [datesLabel, setDatesLabel] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const machineDate = useSelector(state => state.currentDate.currentDate);
  
  useEffect(() => {
    dispatch(fetchCommitmentsAsync());
  }, [dispatch]);

  useEffect(() => {
    (function setChartDates() {
      let dateArray = [];
      let currentDate = moment(challenge.startDate);
      let stopDate = moment(challenge.endDate);
      while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
        currentDate = moment(currentDate).add(1, 'days');
      }
      setDatesLabel(dateArray);
    })();
  }, []);

  useEffect(() => {
    const getUsersData = async () => {
      const method = 'GET';
      const endpoint = '/users';

      try {
        const users = await generalDataFetch(endpoint, method);
        setUsers(users.jsonData);
      } catch (error) {
        console.log(error);
      }
    };
    getUsersData();
  }, []);

  const remaining = commitments
    .filter((comm) => comm.userId === selectedUserId)
    .filter((commitment) => commitment.endDate >= moment(machineDate).format())
    .length;
  const missed = commitments
    .filter((comm) => comm.userId === selectedUserId)
    .filter(
      (commitment) =>
        commitment.endDate < moment(machineDate).format() &&
        commitment.isDone === false
    ).length;
  const completed = commitments
    .filter((comm) => comm.userId === selectedUserId)
    .filter((commitment) => commitment.isDone === true).length;

  const completedPerDay = datesLabel.map((date) => {
    const dailyComms = commitments
      .filter((comm) => comm.userId === selectedUserId)
      .filter((comm) => comm.endDate <= date);
    const percent =
      (dailyComms.filter((comm) => comm.isDone === true).length /
        dailyComms.length) *
      100;
    return percent;
  });

  const totalCompletedPerDay = datesLabel.map((date) => {
    const dailyComms = commitments
      .filter((comm) => comm.endDate <= date);
    const percent =
      (dailyComms.filter((comm) => comm.isDone === true).length /
        dailyComms.length) *
      100;
    return percent;
  });

  const handelUserSelection = (event) => {
    const id = users.filter(user => user.username === event.target.value)[0].id;
    setSelectedUserId(id);
  }

  const userSelectButtons = users.map((user) => {
    return (
      <div className='user' key={user.username}>
        <input
          type='radio'
          id={user.username}
          name='contact'
          value={user.username}
          onClick={handelUserSelection}
        />
        <label htmlFor={user.username}>{user.username}</label>
      </div>
    );
  });

  return (
    <div className='charts-main-container'>
      <div className='user-select-container'>
        <form className='user-select-form'>{userSelectButtons}</form>
      </div>
      <div className='charts-container'>
        <div className='line-chart-container'>
          <Line
            data={{
              labels: datesLabel,
              datasets: [
                {
                  label: 'User Completition percentage',
                  data: completedPerDay,
                  backgroundColor: '#86c2327b',
                },
                {
                  label: 'Total Completition percentage',
                  data: totalCompletedPerDay,
                  backgroundColor: 'rgba(191, 188, 8, 0.2)',
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      suggestedMin: 0,
                      suggestedMax: 100,
                    },
                  },
                ],
              },
            }}
          />
          <Pie
            data={{
              datasets: [
                {
                  label: 'Completition percentage',
                  data: [completed, remaining, missed],
                  backgroundColor: [
                    '#86c2327b',
                    'rgba(144, 144, 144, 0.2)',
                    'rgba(255, 30, 30, 0.4)',
                  ],
                },
              ],
              labels: ['Done', 'Remaining', 'Missed'],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
}

export default Charts;
