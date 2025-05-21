import React from 'react';
import PropTypes from 'prop-types';
import './DailyTask.css';
import instance from '../../utils/axios';

const DailyTask = ({ tasks }) => {
  // 完成任务处理
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await instance.post(`/game/complete-task/${taskId}`);
      
      if (response.data && response.data.code === 200) {
        alert(`任务已完成！获得${response.data.data.pointsEarned}积分`);
        // 重新加载页面或更新任务状态
        window.location.reload();
      } else {
        alert('无法完成任务，请稍后再试');
      }
    } catch (error) {
      console.error('完成任务失败:', error);
      alert('无法完成任务，请稍后再试');
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-tasks">
        <p>今日暂无任务</p>
      </div>
    );
  }

  return (
    <div className="daily-tasks">
      {tasks.map(task => (
        <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
          <div className="task-content">
            <h3 className="task-title">{task.title}</h3>
            <p className="task-description">{task.description}</p>
            <div className="task-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (task.progress / task.target) * 100)}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {task.progress} / {task.target}
              </div>
            </div>
          </div>
          <div className="task-reward">
            <div className="reward-amount">+{task.reward}</div>
            <div className="reward-label">积分</div>
            {task.completed ? (
              <div className="task-status">已完成</div>
            ) : (
              <button 
                className="claim-button"
                disabled={task.progress < task.target}
                onClick={() => handleCompleteTask(task.id)}
              >
                {task.progress >= task.target ? '领取' : '未完成'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

DailyTask.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      reward: PropTypes.number.isRequired,
      progress: PropTypes.number.isRequired,
      target: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired
};

export default DailyTask;
